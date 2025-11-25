// src/utils/validarSolapamiento.js

const pool = require("../config/db");

/**
 * Valida si la empleada ya tiene una cita en ese rango de tiempo.
 * excludeId = cita actual (para permitir editar)
 */
module.exports = async function validarSolapamiento(
  empleadaId,
  inicio,
  fin,
  excludeId = null
) {
  let sql = `
    SELECT id
    FROM citas
    WHERE empleada_id = ?
      AND estado != 'cancelada'
      AND (
        (fecha_inicio <= ? AND fecha_fin > ?) OR
        (fecha_inicio < ? AND fecha_fin >= ?) OR
        (fecha_inicio >= ? AND fecha_fin <= ?)
      )
  `;

  const params = [
    empleadaId,
    inicio, inicio,
    fin, fin,
    inicio, fin
  ];

  // Excluir la propia cita en edición
  if (excludeId) {
    sql += " AND id != ?";
    params.push(excludeId);
  }

  const [rows] = await pool.query(sql, params);

  if (rows.length > 0) {
    throw new Error("La empleada ya tiene una cita asignada en ese horario.");
  }
};
