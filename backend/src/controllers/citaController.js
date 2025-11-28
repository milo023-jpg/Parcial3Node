// src/controllers/citaController.js

const citaService = require("../services/citaService");

// =============================
// Obtener citas sin autenticación
// =============================
exports.obtenerCitasPublico = async (req, res) => {
  try {
    const empleadaId = req.query.empleada_id;
    let fecha = req.query.fecha;

    if (!empleadaId) {
      return res.status(400).json({ error: "empleada_id es requerido" });
    }

    // Prevenir fallos si el frontend no envía fecha
    const fechaFinal = fecha || new Date().toISOString().split("T")[0];

    const citas = await citaService.obtenerCitasPorDiaCompleto(
      empleadaId,
      fechaFinal
    );

    res.json(citas);

  } catch (error) {
    console.error("Error obtenerCitasPublico:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// Obtener todas las citas sin autenticación
// =============================
exports.obtenerTodasPublico = async (req, res) => {
  try {
    const empleadaId = req.query.empleada_id;

    if (!empleadaId) {
      return res.status(400).json({ error: "empleada_id es requerido" });
    }

    const citas = await citaService.obtenerTodasPorEmpleada(empleadaId);
    res.json(citas);

  } catch (error) {
    console.error("Error obtenerTodasPublico:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// Crear cita sin autenticación
// =============================
exports.crearCitaPublico = async (req, res) => {
  try {
    const { empleada_id } = req.body;
    if (!empleada_id)
      return res.status(400).json({ error: "empleada_id es requerido" });

    const nuevaCita = await citaService.crearCita(empleada_id, req.body);

    if (nuevaCita.error) {
      return res.status(400).json({ error: nuevaCita.error });
    }

    res.status(201).json(nuevaCita);

  } catch (error) {
    console.error("Error crearCitaPublico:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// Editar cita sin autenticación
// =============================
// =============================
// Editar cita sin autenticación
// =============================
exports.editarCitaPublico = async (req, res) => {
  try {
    const citaId = req.params.id;
    const empleadaId = req.body.empleada_id;

    if (!empleadaId) {
      return res.status(400).json({ error: "empleada_id es requerido" });
    }

    const actualizado = await citaService.editarCita(citaId, empleadaId, req.body);

    // Si el service devuelve un error controlado
    if (actualizado.error) {
      return res.status(400).json({ error: actualizado.error });
    }

    res.json(actualizado);

  } catch (error) {
    console.error("Error editarCitaPublico:", error);
    res.status(500).json({ error: error.message });
  }
};


// =============================
// Cambiar estado sin autenticación
// =============================
exports.cambiarEstadoPublico = async (req, res) => {
  try {
    const citaId = req.params.id;
    const { estado } = req.body;

    const result = await citaService.cambiarEstado(citaId, estado);
    res.json(result);

  } catch (error) {
    console.error("Error cambiarEstadoPublico:", error);
    res.status(500).json({ error: error.message });
  }
};

// =============================
// Cancelar cita sin autenticación
// =============================
exports.cancelarCitaPublico = async (req, res) => {
  try {
    const citaId = req.params.id;

    const result = await citaService.cancelarCita(citaId);
    res.json(result);

  } catch (error) {
    console.error("Error cancelarCitaPublico:", error);
    res.status(500).json({ error: error.message });
  }
};

const pool = require("../config/db");

// =============================
// Obtener clientes (temporal)
// =============================
exports.obtenerClientes = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, apellido, telefono, alias 
      FROM clientes
      ORDER BY nombre ASC
    `);

    res.json(rows);

  } catch (error) {
    console.error("Error obtenerClientes:", error);
    res.status(500).json({ error: error.message });
  }
};

// =============================
// Obtener servicios activos (temporal)
// =============================
exports.obtenerServicios = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT id, nombre, descripcion, duracion_minutos, precio
      FROM servicios
      WHERE activo = 1
      ORDER BY nombre ASC
    `);

    res.json(rows);

  } catch (error) {
    console.error("Error obtenerServicios:", error);
    res.status(500).json({ error: error.message });
  }
};

// =============================
// Obtener servicios de una cita
// =============================
exports.obtenerServiciosDeCita = async (req, res) => {
  try {
    const citaId = req.params.id;

    const [rows] = await pool.query(`
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
    `, [citaId]);


    res.json(rows);

  } catch (error) {
    console.error("Error obtenerServiciosDeCita:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerCitaPorId = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener cita
    const [citaRows] = await pool.query(
      `
      SELECT 
        c.*,
        cl.nombre AS cliente_nombre,
        cl.apellido AS cliente_apellido
      FROM citas c
      INNER JOIN clientes cl ON cl.id = c.cliente_id
      WHERE c.id = ?
      `,
      [id]
    );

    if (citaRows.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    const cita = citaRows[0];

    // Obtener servicios asociados
    const [servicios] = await pool.query(
      `
      SELECT 
        s.id,
        s.nombre,
        cs.duracion_minutos AS duracion,
        cs.precio_servicio AS precio
      FROM cita_servicios cs
      INNER JOIN servicios s ON s.id = cs.servicio_id
      WHERE cs.cita_id = ?
      `,
      [id]
    );

    cita.servicios = servicios;

    // Cliente
    cita.cliente = {
      nombre: cita.cliente_nombre,
      apellido: cita.cliente_apellido,
    };

    delete cita.cliente_nombre;
    delete cita.cliente_apellido;

    res.json(cita);

  } catch (err) {
    console.error("Error obtenerCitaPorId:", err);
    res.status(500).json({ error: err.message });
  }
};
