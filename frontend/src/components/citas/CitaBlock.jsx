import React from "react";
import "./CitaBlock.css";

export default function CitaBlock({ cita, horaInicio, onSelect }) {

  const inicio = new Date(cita.fecha_inicio);
  const fin = new Date(cita.fecha_fin);

  const minutosDesdeInicio = (inicio.getHours() - horaInicio) * 60 + inicio.getMinutes();
  const duracionMin = (fin - inicio) / 60000;

  const PIXEL_POR_MINUTO = 1;

  const top = minutosDesdeInicio * PIXEL_POR_MINUTO;
  const height = Math.max(duracionMin * PIXEL_POR_MINUTO, 40);

  const colores = {
    pendiente: "#F8D57E",
    en_curso: "#A7C7E7",
    finalizada: "#A6E7A1",
    cancelada: "#F7A8B8",
  };

  return (
    <div
      className="cita-block"
      onClick={onSelect}
      style={{
        top: `${top}px`,
        height: `${height}px`,
        backgroundColor: colores[cita.estado] || "#ddd",
      }}
    >
      <strong className="cita-bloque-nombre">
        {cita.cliente?.nombre}
      </strong>
      <div className="cita-bloque-servicio">
        {cita.servicios?.[0]?.nombre}
      </div>
    </div>
  );
}
