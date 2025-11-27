
const express = require("express");
const router = express.Router();
const citaController = require("../controllers/citaController");
const pagoController = require("../controllers/pagoController");

// ---- RUTAS TEMPORALES PARA NO DEPENDER DE PERSONA 1 ----
router.get("/clientes", citaController.obtenerClientes);
router.get("/servicios", citaController.obtenerServicios);

// Servicios de una cita específica
router.get("/:id/servicios", citaController.obtenerServiciosDeCita);


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

// Pagos
router.post("/:id/pago", pagoController.registrarPago);
router.get("/:id/pagos", pagoController.obtenerPagosCita);

module.exports = router;
