// src/app.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // para recibir JSON en req.body

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const servicioRoutes = require("./routes/servicioRoutes");
const citaRoutes = require("./routes/citaRoutes");
const reporteRoutes = require("./routes/reporteRoutes");

// Registrar rutas con prefijo /api
app.use("/api/auth", authRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/servicios", servicioRoutes);
app.use("/api/citas", citaRoutes);
app.use("/api/reportes", reporteRoutes);

// Ruta base simple para comprobar el estado del servidor
app.get("/", (req, res) => {
  res.json({ message: "API del Sistema de Belleza funcionando correctamente" });
});

// Manejo básico de errores
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({
    error: "Error interno del servidor",
    detalle: err.message,
  });
});

module.exports = app;
