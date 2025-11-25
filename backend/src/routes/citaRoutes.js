// src/routes/citaRoutes.js

const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaController");

// Obtener citas por empleada y fecha (público)
router.get("/", citaController.obtenerCitasPublico);

// Obtener todas las citas por empleada
router.get("/todas", citaController.obtenerTodasPublico);

// Crear cita (público)
router.post("/", citaController.crearCitaPublico);

// Editar cita (público)
router.put("/:id", citaController.editarCitaPublico);

// Cambiar estado (público)
router.patch("/:id/estado", citaController.cambiarEstadoPublico);

// Cancelar cita (público)
router.patch("/:id/cancelar", citaController.cancelarCitaPublico);

module.exports = router;
