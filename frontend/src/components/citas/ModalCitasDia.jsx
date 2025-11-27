import React from "react";
import CitaCard from "./CitaCard";
import "./ModalCitasDia.css";

export default function ModalCitasDia({
  isOpen,
  onClose,
  fechaLabel,
  citas,
  onVerDiaCompleto,
  onEdit,
  onEstado,
  onCancel,
  onCrearCita, // ← nueva prop para el botón "Crear cita"
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-citas">
        <div className="modal-header">
          <h3>{fechaLabel}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {citas.length === 0 ? (
            <p>No hay citas para este día.</p>
          ) : (
            citas.map((cita) => (
              <CitaCard
                key={cita.id}
                cita={cita}
                onEdit={() => onEdit(cita.id)}
                onEstado={(nuevoEstado) => onEstado(cita.id, nuevoEstado)}
                onCancel={() => onCancel(cita.id)}
              />
            ))
          )}
        </div>

        <button
          className="btn-ver-dia"
          onClick={onVerDiaCompleto}
          disabled={citas.length === 0}
        >
          Ver día completo
        </button>

        <button className="btn-dia" onClick={onCrearCita}>
          ➕ Crear cita este día
        </button>
      </div>
    </div>
  );
}
