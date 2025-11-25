// src/utils/calcularDuracion.js

module.exports = function calcularDuracion(servicios) {
  return servicios.reduce((acc, s) => acc + Number(s.duracion_minutos), 0);
};
