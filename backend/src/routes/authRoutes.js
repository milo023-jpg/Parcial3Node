const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const recoveryController = require("../controllers/recoveryController");



// rutas de login
router.post("/login", authController.login);

// rutas de recuperación de contraseña (sin correo)
router.post("/recovery/email", recoveryController.validarEmail);
router.post("/recovery/pregunta", recoveryController.validarRespuesta);
router.post("/recovery/nueva-password", recoveryController.resetPassword);

module.exports = router;
