const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar usuario por email
    const [rows] = await pool.query(
      "SELECT id, nombre_completo, email, telefono, password_hash FROM usuarios WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    const user = rows[0];

    // 2. Comparar contraseña
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    // 3. Crear token mínimo
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      token,
      usuario: {
        id: user.id,
        nombre_completo: user.nombre_completo,
        email: user.email,
        telefono: user.telefono,
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ error: "Error en el servidor" });
  }
};
