const pool = require("../config/db");

// =============================
// Resumen general del dashboard
// =============================
exports.obtenerResumen = async (req, res) => {
  try {
    const empleadaId = req.query.empleada_id;
    const fecha = req.query.fecha || new Date().toISOString().split('T')[0];

    if (!empleadaId) {
      return res.status(400).json({ error: "empleada_id es requerido" });
    }

    // Citas del día
    const [citasHoy] = await pool.query(
      `SELECT COUNT(*) as total
       FROM citas
       WHERE empleada_id = ? AND DATE(fecha_inicio) = ?`,
      [empleadaId, fecha]
    );

    // Citas pendientes del día
    const [citasPendientes] = await pool.query(
      `SELECT COUNT(*) as total
       FROM citas
       WHERE empleada_id = ? 
         AND DATE(fecha_inicio) = ?
         AND estado = 'pendiente'`,
      [empleadaId, fecha]
    );

    // Citas finalizadas del día
    const [citasFinalizadas] = await pool.query(
      `SELECT COUNT(*) as total
       FROM citas
       WHERE empleada_id = ? 
         AND DATE(fecha_inicio) = ?
         AND estado = 'finalizada'`,
      [empleadaId, fecha]
    );

    // Ventas totales del día
    const [ventasHoy] = await pool.query(
      `SELECT COALESCE(SUM(p.monto), 0) as total
       FROM pagos p
       JOIN citas c ON c.id = p.cita_id
       WHERE c.empleada_id = ? AND DATE(p.fecha_pago) = ?`,
      [empleadaId, fecha]
    );

    // Ventas del mes actual
    const [ventasMes] = await pool.query(
      `SELECT COALESCE(SUM(p.monto), 0) as total
       FROM pagos p
       JOIN citas c ON c.id = p.cita_id
       WHERE c.empleada_id = ? 
         AND YEAR(p.fecha_pago) = YEAR(CURDATE())
         AND MONTH(p.fecha_pago) = MONTH(CURDATE())`,
      [empleadaId]
    );

    // Total de clientes únicos
    const [totalClientes] = await pool.query(
      `SELECT COUNT(DISTINCT c.cliente_id) as total
       FROM citas c
       WHERE c.empleada_id = ?`,
      [empleadaId]
    );

    res.json({
      fecha: fecha,
      citasHoy: citasHoy[0].total,
      citasPendientes: citasPendientes[0].total,
      citasFinalizadas: citasFinalizadas[0].total,
      ventasHoy: parseFloat(ventasHoy[0].total),
      ventasMes: parseFloat(ventasMes[0].total),
      totalClientes: totalClientes[0].total
    });

  } catch (error) {
    console.error("Error obtenerResumen:", error);
    res.status(500).json({ error: error.message });
  }
};

// =============================
// Servicios más vendidos
// =============================
exports.obtenerServiciosMasVendidos = async (req, res) => {
  try {
    const empleadaId = req.query.empleada_id;
    const limite = req.query.limite || 10;

    if (!empleadaId) {
      return res.status(400).json({ error: "empleada_id es requerido" });
    }

    const [servicios] = await pool.query(
      `SELECT 
         s.id,
         s.nombre,
         s.precio,
         COUNT(cs.servicio_id) as cantidad_vendida,
         SUM(cs.precio_servicio) as ingresos_totales
       FROM cita_servicios cs
       JOIN servicios s ON s.id = cs.servicio_id
       JOIN citas c ON c.id = cs.cita_id
       WHERE c.empleada_id = ? AND c.estado = 'finalizada'
       GROUP BY s.id, s.nombre, s.precio
       ORDER BY cantidad_vendida DESC
       LIMIT ?`,
      [empleadaId, parseInt(limite)]
    );

    res.json(servicios.map(s => ({
      ...s,
      ingresos_totales: parseFloat(s.ingresos_totales)
    })));

  } catch (error) {
    console.error("Error obtenerServiciosMasVendidos:", error);
    res.status(500).json({ error: error.message });
  }
};

// =============================
// Clientes más frecuentes
// =============================
exports.obtenerClientesFrecuentes = async (req, res) => {
  try {
    const empleadaId = req.query.empleada_id;
    const limite = req.query.limite || 10;

    if (!empleadaId) {
      return res.status(400).json({ error: "empleada_id es requerido" });
    }

    const [clientes] = await pool.query(
      `SELECT 
         cl.id,
         cl.nombre,
         cl.apellido,
         cl.telefono,
         cl.email,
         COUNT(c.id) as total_citas,
         SUM(c.valor_total) as total_gastado,
         MAX(c.fecha_inicio) as ultima_cita
       FROM clientes cl
       JOIN citas c ON c.cliente_id = cl.id
       WHERE c.empleada_id = ?
       GROUP BY cl.id, cl.nombre, cl.apellido, cl.telefono, cl.email
       ORDER BY total_citas DESC
       LIMIT ?`,
      [empleadaId, parseInt(limite)]
    );

    res.json(clientes.map(c => ({
      ...c,
      total_gastado: parseFloat(c.total_gastado)
    })));

  } catch (error) {
    console.error("Error obtenerClientesFrecuentes:", error);
    res.status(500).json({ error: error.message });
  }
};

// =============================
// Reporte de ventas con filtros
// =============================
exports.obtenerVentas = async (req, res) => {
  try {
    const empleadaId = req.query.empleada_id;
    const fechaInicio = req.query.fecha_inicio;
    const fechaFin = req.query.fecha_fin;
    const metodoPago = req.query.metodo_pago;

    if (!empleadaId) {
      return res.status(400).json({ error: "empleada_id es requerido" });
    }

    let query = `
      SELECT 
        p.id as pago_id,
        p.monto,
        p.metodo_pago,
        p.fecha_pago,
        c.id as cita_id,
        c.fecha_inicio,
        c.valor_total,
        cl.nombre as cliente_nombre,
        cl.apellido as cliente_apellido,
        cl.telefono as cliente_telefono
      FROM pagos p
      JOIN citas c ON c.id = p.cita_id
      JOIN clientes cl ON cl.id = c.cliente_id
      WHERE c.empleada_id = ?
    `;

    const params = [empleadaId];

    if (fechaInicio) {
      query += " AND DATE(p.fecha_pago) >= ?";
      params.push(fechaInicio);
    }

    if (fechaFin) {
      query += " AND DATE(p.fecha_pago) <= ?";
      params.push(fechaFin);
    }

    if (metodoPago) {
      query += " AND p.metodo_pago = ?";
      params.push(metodoPago);
    }

    query += " ORDER BY p.fecha_pago DESC";

    const [ventas] = await pool.query(query, params);

    // Calcular totales
    const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.monto), 0);
    const cantidadVentas = ventas.length;

    // Agrupar por método de pago
    const porMetodo = ventas.reduce((acc, v) => {
      if (!acc[v.metodo_pago]) {
        acc[v.metodo_pago] = { cantidad: 0, total: 0 };
      }
      acc[v.metodo_pago].cantidad++;
      acc[v.metodo_pago].total += parseFloat(v.monto);
      return acc;
    }, {});

    res.json({
      ventas: ventas.map(v => ({
        ...v,
        monto: parseFloat(v.monto),
        valor_total: parseFloat(v.valor_total)
      })),
      resumen: {
        total_ventas: totalVentas,
        cantidad_ventas: cantidadVentas,
        promedio_venta: cantidadVentas > 0 ? totalVentas / cantidadVentas : 0,
        por_metodo: Object.entries(porMetodo).map(([metodo, data]) => ({
          metodo,
          cantidad: data.cantidad,
          total: data.total
        }))
      }
    });

  } catch (error) {
    console.error("Error obtenerVentas:", error);
    res.status(500).json({ error: error.message });
  }
};
