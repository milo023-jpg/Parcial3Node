import React from "react";

export default function EstadoBadge({ estado }) {
  const colores = {
    pendiente: "#F8D57E",   // amarillo pastel
    en_curso: "#A7C7E7",    // azul pastel
    finalizada: "#A6E7A1",  // verde pastel
    cancelada: "#F7A8B8",   // rosa pastel
  };

  if (!estado) return null;

  return (
    <span
      style={{
        backgroundColor: colores[estado] || "#ddd",
        padding: "4px 10px",
        borderRadius: "12px",
        fontSize: "11px",
        fontWeight: 600,
        color: "#333",
        letterSpacing: "0.5px",
      }}
    >
      {estado.replace("_", " ").toUpperCase()}
    </span>
  );
}
