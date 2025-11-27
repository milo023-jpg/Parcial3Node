// src/services/citaService.js

const pool = require("../config/db");
const validarSolapamiento = require("../utils/validarSolapamiento");
const calcularDuracion = require("../utils/calcularDuracion");

module.exports = {
  // ============================
  // Obtener citas por día
  // ============================
  obtenerCitasPorDia: async (empleadaId, fecha) => {
    const [rows] = await pool.query(
      `
      SELECT c.*, cl.nombre, cl.apellido
      FROM citas c
      JOIN clientes cl ON cl.id = c.cliente_id
      WHERE c.empleada_id = ?
        AND DATE(c.fecha_inicio) = ?
      ORDER BY c.fecha_inicio ASC
      `,
      [empleadaId, fecha]
    );

    return rows;
  },

  // ============================
  // Obtener todas las citas por empleada
  // ============================
  /* obtenerTodasPorEmpleada: async (empleadaId) => {
    const [rows] = await pool.query(
      `
    SELECT c.*, cl.nombre, cl.apellido
    FROM citas c
    JOIN clientes cl ON cl.id = c.cliente_id
    WHERE c.empleada_id = ?
    ORDER BY c.fecha_inicio ASC
    `,
      [empleadaId]
    );

    return rows;
  }, */

  obtenerTodasPorEmpleada: async (empleadaId) => {
    const [citas] = await pool.query(
      `
      SELECT 
        c.*,
        cl.nombre AS cliente_nombre,
        cl.apellido AS cliente_apellido
      FROM citas c
      INNER JOIN clientes cl ON cl.id = c.cliente_id
      WHERE c.empleada_id = ?
      ORDER BY c.fecha_inicio ASC
    `,
      [empleadaId]
    );

    // POR CADA CITA → CONSULTA SERVICIOS
    for (let cita of citas) {
      const [servicios] = await pool.query(
        `
        SELECT 
          s.id,
          s.nombre,
          cs.precio_servicio AS precio,
          cs.duracion_minutos AS duracion,
          cs.orden
        FROM cita_servicios cs
        INNER JOIN servicios s ON s.id = cs.servicio_id
        WHERE cs.cita_id = ?
        ORDER BY cs.orden ASC
      `,
        [cita.id]
      );

      cita.servicios = servicios;

      // Agrupar cliente
      cita.cliente = {
        nombre: cita.cliente_nombre,
        apellido: cita.cliente_apellido,
      };

      // limpiar campos viejos
      delete cita.cliente_nombre;
      delete cita.cliente_apellido;
    }

    return citas;
  },

  // ============================
  // Crear una nueva cita
  // ============================
  crearCita: async (empleadaId, data) => {
    const { cliente_id, servicios, fecha, hora } = data;

    // 1. Validar que existan servicios
    if (!servicios || servicios.length === 0) {
      throw new Error("Debe seleccionar al menos un servicio.");
    }

    // 2. Obtener info de servicios
    const [infoServicios] = await pool.query(
      `
      SELECT id, duracion_minutos, precio
      FROM servicios
      WHERE id IN (?)
      `,
      [servicios]
    );

    if (infoServicios.length === 0) {
      throw new Error("Servicios no válidos.");
    }

    // 3. Calcular duración total
    const duracionTotal = calcularDuracion(infoServicios);

    // 4. Construir fecha_inicio y fecha_fin
    const fechaInicio = new Date(`${fecha}T${hora}:00`);
    const fechaFin = new Date(fechaInicio.getTime() + duracionTotal * 60000);

    // 5. Validar solapamiento con otras citas de la empleada
    await validarSolapamiento(empleadaId, fechaInicio, fechaFin);

    // 6. Calcular valor total
    const valorTotal = infoServicios.reduce(
      (acc, s) => acc + Number(s.precio),
      0
    );

    // 7. Crear cita
    const [result] = await pool.query(
      `
      INSERT INTO citas (cliente_id, empleada_id, fecha_inicio, fecha_fin, valor_total)
      VALUES (?, ?, ?, ?, ?)
      `,
      [cliente_id, empleadaId, fechaInicio, fechaFin, valorTotal]
    );

    const citaId = result.insertId;

    // 8. Insertar servicios en cita_servicios
    for (const s of infoServicios) {
      await pool.query(
        `
        INSERT INTO cita_servicios (cita_id, servicio_id, precio_servicio, duracion_minutos)
        VALUES (?, ?, ?, ?)
        `,
        [citaId, s.id, s.precio, s.duracion_minutos]
      );
    }

    return { id: citaId, mensaje: "Cita creada correctamente" };
  },

  // ============================
  // Editar cita (cambiar hora o servicios)
  // ============================
  // ============================
  // Editar cita (logica completa)
  // ============================
  editarCita: async (citaId, empleadaId, data) => {
    const { cliente_id, servicios, fecha, hora } = data;

    // 1. Obtener cita actual
    const [actual] = await pool.query(
      `SELECT * FROM citas WHERE id = ? AND empleada_id = ? LIMIT 1`,
      [citaId, empleadaId]
    );

    if (actual.length === 0) {
      throw new Error("La cita no existe o no pertenece a la empleada.");
    }

    const cita = actual[0];

    // 2. Verificar que existan servicios
    if (!servicios || servicios.length === 0) {
      throw new Error("Debe seleccionar al menos un servicio.");
    }

    // 3. Obtener info completa de servicios
    const [infoServicios] = await pool.query(
      `SELECT id, duracion_minutos, precio FROM servicios WHERE id IN (?)`,
      [servicios]
    );

    if (infoServicios.length === 0) {
      throw new Error("Servicios no válidos.");
    }

    // 4. Recalcular duración y total
    const duracionTotal = calcularDuracion(infoServicios);

    let fechaInicio = cita.fecha_inicio;
    let fechaFin = cita.fecha_fin;

    // 5. Si cambiaron fecha/hora
    if (fecha && hora) {
      fechaInicio = new Date(`${fecha}T${hora}:00`);
      fechaFin = new Date(fechaInicio.getTime() + duracionTotal * 60000);

      // 6. Validar solapamientos
      await validarSolapamiento(empleadaId, fechaInicio, fechaFin, citaId);
    }

    // 7. Recalcular valor total
    const valorTotal = infoServicios.reduce(
      (acc, s) => acc + Number(s.precio),
      0
    );

    // 8. Actualizar cita principal
    await pool.query(
      `
      UPDATE citas
      SET cliente_id = ?, fecha_inicio = ?, fecha_fin = ?, valor_total = ?
      WHERE id = ?
    `,
      [cliente_id, fechaInicio, fechaFin, valorTotal, citaId]
    );

    // 9. Eliminar servicios actuales de la cita
    await pool.query(`DELETE FROM cita_servicios WHERE cita_id = ?`, [citaId]);

    // 10. Insertar los nuevos servicios
    for (const s of infoServicios) {
      await pool.query(
        `
      INSERT INTO cita_servicios (cita_id, servicio_id, precio_servicio, duracion_minutos)
      VALUES (?, ?, ?, ?)
      `,
        [citaId, s.id, s.precio, s.duracion_minutos]
      );
    }

    return {
      mensaje: "Cita actualizada correctamente",
      citaId,
    };
  },

  cambiarEstado: async (citaId, estado) => {
    await pool.query(`UPDATE citas SET estado = ? WHERE id = ?`, [
      estado,
      citaId,
    ]);
    return { mensaje: "Estado actualizado" };
  },

  cancelarCita: async (citaId) => {
    await pool.query(`UPDATE citas SET estado = 'cancelada' WHERE id = ?`, [
      citaId,
    ]);
    return { mensaje: "Cita cancelada" };
  },

  // ============================
  // Obtener citas por día (CON servicios)
  // ============================
  obtenerCitasPorDiaCompleto: async (empleadaId, fecha) => {
    // 1. Traer las citas básicas
    const [citas] = await pool.query(
      `
    SELECT 
      c.*,
      cl.nombre AS cliente_nombre,
      cl.apellido AS cliente_apellido
    FROM citas c
    INNER JOIN clientes cl ON cl.id = c.cliente_id
    WHERE c.empleada_id = ?
      AND DATE(c.fecha_inicio) = ?
    ORDER BY c.fecha_inicio ASC
  `,
      [empleadaId, fecha]
    );

    // 2. POR CADA CITA — obtener servicios
    for (let c of citas) {
      const [servicios] = await pool.query(
        `
      SELECT 
        s.id,
        s.nombre,
        cs.precio_servicio AS precio,
        cs.duracion_minutos AS duracion,
        cs.orden
      FROM cita_servicios cs
      INNER JOIN servicios s ON s.id = cs.servicio_id
      WHERE cs.cita_id = ?
      ORDER BY cs.orden ASC
    `,
        [c.id]
      );

      c.servicios = servicios;

      c.cliente = {
        nombre: c.cliente_nombre,
        apellido: c.cliente_apellido,
      };

      delete c.cliente_nombre;
      delete c.cliente_apellido;
    }

    return citas;
  },
};
