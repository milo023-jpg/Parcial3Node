// src/routes/citaRoutes.js

const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaController");

// Obtener todas las citas
router.get("/todas", citaController.obtenerTodasPublico);

// Obtener citas por fecha
router.get("/", citaController.obtenerCitasPublico);

// Crear
router.post("/", citaController.crearCitaPublico);

// Editar
router.put("/:id", citaController.editarCitaPublico);

// Cambiar estado
router.patch("/:id/estado", citaController.cambiarEstadoPublico);

// Cancelar
router.patch("/:id/cancelar", citaController.cancelarCitaPublico);

module.exports = router;
