const pool = require("../config/db");

// =============================
// Registrar pago de una cita
// =============================
exports.registrarPago = async (req, res) => {
  try {
    const citaId = req.params.id;
    const { metodo_pago, monto } = req.body;

    if (!metodo_pago || !monto) {
      return res.status(400).json({ 
        error: "metodo_pago y monto son requeridos" 
      });
    }

    // Verificar que la cita existe
    const [cita] = await pool.query(
      "SELECT id, estado, valor_total FROM citas WHERE id = ?",
      [citaId]
    );

    if (cita.length === 0) {
      return res.status(404).json({ error: "Cita no encontrada" });
    }

    // Verificar que la cita no esté cancelada
    if (cita[0].estado === "cancelada") {
      return res.status(400).json({ 
        error: "No se puede registrar pago para una cita cancelada" 
      });
    }

    // Registrar el pago
    const [result] = await pool.query(
      `INSERT INTO pagos (cita_id, metodo_pago, monto, fecha_pago)
       VALUES (?, ?, ?, NOW())`,
      [citaId, metodo_pago, monto]
    );

    // Marcar la cita como finalizada
    await pool.query(
      "UPDATE citas SET estado = 'finalizada' WHERE id = ?",
      [citaId]
    );

    res.status(201).json({
      mensaje: "Pago registrado correctamente",
      pagoId: result.insertId,
      citaId: citaId,
      estado: "finalizada"
    });

  } catch (error) {
    console.error("Error registrarPago:", error);
    res.status(500).json({ error: error.message });
  }
};

// =============================
// Obtener pagos de una cita
// =============================
exports.obtenerPagosCita = async (req, res) => {
  try {
    const citaId = req.params.id;

    const [pagos] = await pool.query(
      `SELECT p.*, c.valor_total, c.estado as estado_cita
       FROM pagos p
       JOIN citas c ON c.id = p.cita_id
       WHERE p.cita_id = ?
       ORDER BY p.fecha_pago DESC`,
      [citaId]
    );

    res.json(pagos);

  } catch (error) {
    console.error("Error obtenerPagosCita:", error);
    res.status(500).json({ error: error.message });
  }
};
