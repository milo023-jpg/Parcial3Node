// src/server.js

require("dotenv").config();
const app = require("./app");

// Puerto desde variables de entorno
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
});
