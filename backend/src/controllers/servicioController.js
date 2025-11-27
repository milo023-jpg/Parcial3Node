// backend/src/controllers/servicioController.js
const pool = require("../config/db");

// ======================================================
//    OBTENER TODOS LOS SERVICIOS
// ======================================================
exports.getAllServicios = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM servicios ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// ======================================================
//    OBTENER SERVICIO POR ID
// ======================================================
exports.getServicioById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM servicios WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// ======================================================
//    CREAR SERVICIO
// ======================================================
exports.createServicio = async (req, res, next) => {
  try {
    const { nombre, descripcion, duracion_minutos, precio, categoria, activo } = req.body;

    if (!nombre || duracion_minutos == null || precio == null) {
      return res.status(400).json({ error: "nombre, duracion_minutos y precio son obligatorios" });
    }

    const [result] = await pool.query(
      "INSERT INTO servicios (nombre, descripcion, duracion_minutos, precio, categoria, activo) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre, descripcion || null, duracion_minutos, precio, categoria || null, activo == null ? 1 : activo]
    );

    res.status(201).json({ message: "Servicio creado", id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//    ACTUALIZAR SERVICIO
// ======================================================
exports.updateServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    // allow partial updates
    const { nombre, descripcion, duracion_minutos, precio, categoria, activo } = req.body;

    // build dynamic set clause (safe using placeholders)
    const fields = [];
    const values = [];

    if (nombre !== undefined) { fields.push("nombre = ?"); values.push(nombre); }
    if (descripcion !== undefined) { fields.push("descripcion = ?"); values.push(descripcion); }
    if (duracion_minutos !== undefined) { fields.push("duracion_minutos = ?"); values.push(duracion_minutos); }
    if (precio !== undefined) { fields.push("precio = ?"); values.push(precio); }
    if (categoria !== undefined) { fields.push("categoria = ?"); values.push(categoria); }
    if (activo !== undefined) { fields.push("activo = ?"); values.push(activo); }

    if (fields.length === 0) {
      return res.status(400).json({ error: "No hay campos para actualizar" });
    }

    values.push(id);

    const sql = `UPDATE servicios SET ${fields.join(", ")} WHERE id = ?`;
    const [result] = await pool.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.json({ message: "Servicio actualizado" });
  } catch (error) {
    next(error);
  }
};

// ======================================================
//    ELIMINAR SERVICIO
// ======================================================
exports.deleteServicio = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM servicios WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.json({ message: "Servicio eliminado" });
  } catch (error) {
    next(error);
  }
};
