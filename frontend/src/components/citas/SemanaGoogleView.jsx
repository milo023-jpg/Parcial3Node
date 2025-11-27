import React from "react";
import CitaBlock from "./CitaBlock";
import "./SemanaGoogleView.css";

import { useState } from "react";
import CitaModal from "./CitaModal";

// Horas visibles (puedes ajustar)
const HORA_INICIO = 5;
const HORA_FIN = 23;

export default function SemanaGoogleView({ semanaDias, citas, onUpdate }) {
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  // Agrupar citas por día
  const citasPorDia = {};
  semanaDias.forEach((d) => (citasPorDia[d.iso] = []));

  citas.forEach((cita) => {
    if (citasPorDia[cita.fechaLocal]) {
      citasPorDia[cita.fechaLocal].push(cita);
    }
  });

  return (
    <div className="semana-google-container">
      {/* Cabecera días */}
      <div className="header-dias">
        <div className="hora-col-header"></div>
        {semanaDias.map((dia) => (
          <div key={dia.iso} className="dia-header">
            <div className="dia-nombre">{dia.nombreCorto}</div>
            <div className="dia-numero">{dia.diaNumero}</div>
          </div>
        ))}
      </div>

      {/* Cuerpo del calendario */}
      <div className="grid-semanal">
        {/* Columna de horas */}
        <div className="col-horas">
          {Array.from({ length: HORA_FIN - HORA_INICIO }, (_, i) => {
            const hora = HORA_INICIO + i;
            return (
              <div key={hora} className="hora-item">
                {hora}:00
              </div>
            );
          })}
        </div>

        {/* Columnas de días */}
        <div className="dias-grid">
          {semanaDias.map((dia) => (
            <div key={dia.iso} className="dia-col-google">
              {/* Fondo de las horas (líneas grises) */}
              {Array.from({ length: HORA_FIN - HORA_INICIO }, (_, i) => (
                <div key={i} className="hora-slot"></div>
              ))}

              {/* Bloques de citas */}
              {citasPorDia[dia.iso].map((cita) => (
                <CitaBlock
                  key={cita.id}
                  cita={cita}
                  horaInicio={HORA_INICIO}
                  onSelect={() => setCitaSeleccionada(cita)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <CitaModal
        cita={citaSeleccionada}
        onClose={() => setCitaSeleccionada(null)}
        onUpdate={onUpdate}
      />
    </div>
  );
}
