require("dotenv").config();
const pool = require("./config/db");

(async () => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS fecha");
    console.log("Conexión exitosa:", rows);
  } catch (error) {
    console.error("Error en la conexión:", error);
  }
})();


