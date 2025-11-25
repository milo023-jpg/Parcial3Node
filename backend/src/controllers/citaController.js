// src/controllers/citaController.js

const citaService = require("../services/citaService");

// =============================
// Obtener citas sin autenticación
// =============================
exports.obtenerCitasPublico = async (req, res) => {
  try {
    const empleadaId = req.query.empleada_id;
    const fecha = req.query.fecha;

    if (!empleadaId) {
      return res.status(400).json({ error: "empleada_id es requerido" });
    }

    const citas = await citaService.obtenerCitasPorDia(empleadaId, fecha);
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
    if (!empleada_id) return res.status(400).json({ error: "empleada_id es requerido" });

    const nuevaCita = await citaService.crearCita(empleada_id, req.body);
    res.status(201).json(nuevaCita);

  } catch (error) {
    console.error("Error crearCitaPublico:", error);
    res.status(500).json({ error: error.message });
  }
};

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
