import React from "react";

export default function CitaCard({ cita, onEdit, onCancel, onEstado }) {
  const {
    cliente,
    fecha_inicio,
    fecha_fin,
    servicios = [],
    estado,
  } = cita;

  // COLORES POR ESTADO
  const estadoColor = {
    pendiente: "#ffa53f",
    "en_curso": "#4db6ff",
    finalizada: "#52c41a",
    cancelada: "#ff4d4f",
  };

  // LABEL LEGIBLE
  const estadoLabel = {
    pendiente: "PENDIENTE",
    "en_curso": "EN CURSO",
    finalizada: "FINALIZADA",
    cancelada: "CANCELADA",
  };

  // BOTONES SEGÚN ESTADO
  const mostrarBotones = {
    pendiente: ["editar", "cancelar", "enCurso"],
    "en_curso": ["editar", "cancelar", "finalizar"],
    finalizada: [],
    cancelada: [],
  }[estado] || [];

  return (
    <div
      className="cita-card"
      style={{
        background: "white",
        borderRadius: "16px",
        padding: "16px",
        margin: "12px 0",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* ====================== */}
      {/*   NOMBRE DEL CLIENTE   */}
      {/* ====================== */}
      <h3 style={{ margin: "0 0 6px 0", fontSize: "18px" }}>
        {cliente?.nombre} {cliente?.apellido}
      </h3>

      {/* ====================== */}
      {/*     HORARIO CITA       */}
      {/* ====================== */}
      <p style={{ margin: "4px 0", fontWeight: "500" }}>
        {new Date(cita.fecha_inicio).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} 
          {" → "}
        {new Date(cita.fecha_fin).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </p>

      {/* ====================== */}
      {/*   ESTADO ACTUAL        */}
      {/* ====================== */}
      <span
        style={{
          display: "inline-block",
          margin: "8px 0",
          padding: "4px 10px",
          borderRadius: "8px",
          background: estadoColor[estado] || "#ccc",
          color: "white",
          fontSize: "12px",
          fontWeight: "600",
        }}
      >
        {estadoLabel[estado] || estado}
      </span>

      {/* ====================== */}
      {/*   SERVICIOS LISTADOS   */}
      {/* ====================== */}
      {servicios.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600" }}>
            Servicios:
          </p>

          <ul style={{ margin: 0, paddingLeft: "18px" }}>
            {servicios.map((s, i) => (
              <li key={i} style={{ fontSize: "14px", marginBottom: "3px" }}>
                {s.nombre} ({s.duracion} min)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ====================== */}
      {/*   BOTONES DE ACCIÓN    */}
      {/* ====================== */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        {/* EDITAR */}
        {mostrarBotones.includes("editar") && (
          <button
            onClick={onEdit}
            style={{
              background: "#b083ff",
              border: "none",
              color: "white",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ✏️ Editar
          </button>
        )}

        {/* CANCELAR */}
        {mostrarBotones.includes("cancelar") && (
          <button
            onClick={onCancel}
            style={{
              background: "#ff6b81",
              border: "none",
              color: "white",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ❌ Cancelar
          </button>
        )}

        {/* FINALIZAR */}
        {mostrarBotones.includes("finalizar") && (
          <button
            onClick={() => onEstado("finalizada")}
            style={{
              background: "#2ecc71",
              border: "none",
              color: "white",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ✔ Finalizar
          </button>
        )}

        {/* EN CURSO */}
        {mostrarBotones.includes("enCurso") && (
          <button
            onClick={() => onEstado("en_curso")}
            style={{
              background: "#f4d03f",
              border: "none",
              color: "black",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            ▶ En curso
          </button>
        )}
      </div>
    </div>
  );
}
