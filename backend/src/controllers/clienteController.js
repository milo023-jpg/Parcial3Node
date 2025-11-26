// src/controllers/clienteController.js
const pool = require("../config/db");

// ======================================================
//    OBTENER TODOS LOS CLIENTES
// ======================================================
exports.getAllClientes = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM clientes ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// ======================================================
//    OBTENER CLIENTE POR ID
// ======================================================
exports.getClienteById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM clientes WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// ======================================================
//    CREAR CLIENTE
// ======================================================
exports.createCliente = async (req, res, next) => {
  try {
    const { nombre, apellido, telefono, email, alias, cedula } = req.body;

    if (!nombre || !apellido || !telefono) {
      return res.status(400).json({ error: "Nombre, apellido y teléfono son obligatorios" });
    }

    const [result] = await pool.query(
      `INSERT INTO clientes 
       (nombre, apellido, telefono, email, alias, cedula) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido,
        telefono || null, // <- pasar null si está vacío
        email || null,
        alias || null,
        cedula || null
      ]
    );

    res.json({ message: "Cliente creado", id: result.insertId });
  } catch (error) {
    console.error("Error al crear cliente:", error); // <-- agregar esto para ver error real en consola
    next(error);
  }
};


// ======================================================
//    ACTUALIZAR CLIENTE
// ======================================================
exports.updateCliente = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email } = req.body; // cambio: correo -> email

    const [result] = await pool.query(
      "UPDATE clientes SET nombre = ?, telefono = ?, email = ? WHERE id = ?", // cambio: correo -> email
      [nombre, telefono, email, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente actualizado" });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//    ELIMINAR CLIENTE
// ======================================================
exports.deleteCliente = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM clientes WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    next(error);
  }
};
