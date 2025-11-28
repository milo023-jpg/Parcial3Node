/**
 * Formatea un número como moneda colombiana
 * Ejemplo: 80000 -> "$80.000"
 * Ejemplo: 1234567 -> "$1.234.567"
 */
export const formatCurrency = (value) => {
  if (!value || value === 0) return '$0';
  
  // Redondear para eliminar decimales
  const rounded = Math.round(value);
  
  // Formatear con separadores de miles
  return `$${rounded.toLocaleString('es-CO')}`;
};

/**
 * Formatea un número sin símbolo de moneda
 * Ejemplo: 80000 -> "80.000"
 */
export const formatNumber = (value) => {
  if (!value || value === 0) return '0';
  
  const rounded = Math.round(value);
  return rounded.toLocaleString('es-CO');
};
