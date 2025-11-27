import React from "react";
import CitaCard from "./CitaCard";
import "./SemanaView.css";

export default function SemanaView({ semanaDias, citas }) {
  return (
    <div className="semana-container">
      {semanaDias.map((dia) => (
        <div key={dia.iso} className="dia-col">
          <div className="dia-header">
            <span className="dia-nombre">{dia.nombreCorto}</span>
            <span className="dia-numero">{dia.diaNumero}</span>
          </div>

          <div className="dia-citas">
            {citas
              .filter((c) => c.fechaLocal === dia.iso)
              .map((c) => (
                <CitaCard
                  key={cita.id}
                  cita={cita}
                  onEdit={() => editarCita(cita.id)}
                  onEstado={(nuevoEstado) =>
                    cambiarEstado(cita.id, nuevoEstado)
                  }
                  onCancel={() => cancelarCita(cita.id)}
                />
              ))}

            {citas.filter((c) => c.fechaLocal === dia.iso).length === 0 && (
              <p className="dia-sin-citas">Sin citas</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
