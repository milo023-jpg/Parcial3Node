const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// ========================
// 1) Validar Email
// ========================
const validarEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const [rows] = await pool.query(
      "SELECT id, email FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "El correo no existe" });
    }

    return res.json({
      userId: rows[0].id,
      pregunta: "¿Año de expedición de cédula?"
    });

  } catch (err) {
    console.error("Error en validarEmail:", err);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// ========================
// 2) Validar Respuesta
// ========================
const validarRespuesta = (req, res) => {
  const { respuesta } = req.body;

  console.log("Respuesta recibida:", respuesta);

  if (!respuesta) {
    return res.status(400).json({ message: "Falta la respuesta" });
  }

  if (respuesta !== "2020") {
    return res.status(400).json({ message: "Respuesta incorrecta" });
  }

  return res.json({ message: "Respuesta correcta" });
};

// ========================
// 3) Guardar nueva contraseña
// ========================
const resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ message: "Datos incompletos" });
  }

  try {
    const hash = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE usuarios SET password_hash = ? WHERE id = ?",
      [hash, userId]
    );

    return res.json({ message: "Contraseña actualizada correctamente" });

  } catch (err) {
    console.error("Error actualizando contraseña:", err);
    return res.status(500).json({ message: "Error al actualizar contraseña" });
  }
};

module.exports = {
  validarEmail,
  validarRespuesta,
  resetPassword
};
