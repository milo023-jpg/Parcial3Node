const express = require("express");
const router = express.Router();
const reporteController = require("../controllers/reporteController");

router.get("/resumen", reporteController.obtenerResumen);
router.get("/servicios-mas-vendidos", reporteController.obtenerServiciosMasVendidos);
router.get("/clientes-frecuentes", reporteController.obtenerClientesFrecuentes);
router.get("/ventas", reporteController.obtenerVentas);

module.exports = router;
