import React from "react";
import { useNavigate } from "react-router-dom";
import "./CitaModal.css";

export default function CitaModal({ cita, onClose, onUpdate, onFinalizarConPago }) {
  const navigate = useNavigate();

  if (!cita) return null;

  // Cambiar estado de la cita
  const cambiarEstado = async (nuevoEstado) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/citas/${cita.id}/estado`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ estado: nuevoEstado }),
        }
      );

      await res.json();
      onUpdate(); // refrescar citas en pantalla
      onClose(); // cerrar modal
    } catch (error) {
      console.error("Error cambiando estado:", error);
    }
  };

  // Cancelar cita
  const cancelarCita = async () => {
    try {
      const confirmar = window.confirm(
        "¿Seguro que quieres cancelar esta cita?"
      );
      if (!confirmar) return;

      await fetch(`http://localhost:4000/api/citas/${cita.id}/cancelar`, {
        method: "PATCH",
      });

      onUpdate();
      onClose();
    } catch (error) {
      console.error("Error cancelando cita:", error);
    }
  };

  // Redirigir a la edición
  const editarCita = () => {
    console.log("ID que se está enviando a editar:", cita.id);
    navigate(`/citas/editar/${cita.id}`);
    onClose();
  };

  // Ir a vista diaria
  const verDiaCompleto = () => {
    const fecha = cita.fecha_inicio.split("T")[0];
    navigate(`/agenda?fecha=${fecha}`);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">
          {cita.cliente?.nombre} {cita.cliente?.apellido}
        </h2>

        <p>
          <strong>Estado:</strong> {cita.estado}
        </p>

        <p>
          <strong>Horario:</strong>
          <br />
          {new Date(cita.fecha_inicio).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {" → "}
          {new Date(cita.fecha_fin).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        <p>
          <strong>Servicios:</strong>
        </p>
        <ul className="modal-servicios-list">
          {cita.servicios?.map((s) => (
            <li key={s.id}>
              {s.nombre} — {s.duracion} min
            </li>
          ))}
        </ul>

        {/* BOTONES ACCIÓN */}
        <div className="modal-btn-group">
          {cita.estado !== "cancelada" && cita.estado !== "finalizada" && (
            <button className="btn-editar" onClick={editarCita}>
              ✏️ Editar
            </button>
          )}

          <button className="btn-dia" onClick={verDiaCompleto}>
            📅 Ver día completo
          </button>

          {cita.estado !== "cancelada" && cita.estado !== "finalizada" && (
            <button className="btn-cancelar" onClick={cancelarCita}>
              ❌ Cancelar cita
            </button>
          )}

          {/* Flujo de estados */}
          {cita.estado === "pendiente" && (
            <button
              className="btn-en-curso"
              onClick={() => cambiarEstado("en_curso")}
            >
              ▶️ Marcar en curso
            </button>
          )}

          {cita.estado === "en_curso" && (
            <button
              className="btn-finalizar"
              onClick={() => {
                if (onFinalizarConPago) {
                  onClose();
                  onFinalizarConPago(cita);
                } else {
                  cambiarEstado("finalizada");
                }
              }}
            >
              ✔️ Marcar finalizada
            </button>
          )}
        </div>

        <button className="modal-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
}
