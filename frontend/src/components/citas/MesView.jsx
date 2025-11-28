import React from "react";
import "./MesView.css";
import { useNavigate } from "react-router-dom";

export default function MesView({ monthCells, citasPorDia, onDayClick }) {
  const navigate = useNavigate();
  const getColorByCount = (count) => {
    if (count === 0) return "#ffffff";
    if (count === 1) return "#fde4ff";
    if (count === 2) return "#f9c9ff";
    return "#f2a6ff"; // 3 o más
  };

  return (
    <div className="mes-grid">
      {["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"].map((d) => (
        <div key={d} className="mes-header-cell">{d}</div>
      ))}

      {monthCells.map((cell) => {
        const citasDia = (citasPorDia[cell.iso] || []).filter(
          (cita) => cita.estado !== "cancelada"
        );
        const count = citasDia.length;

        return (
          <div
            key={cell.iso + (cell.inMonth ? "m" : "o")}
            className={`mes-cell ${cell.inMonth ? "" : "mes-cell-out"}`}
            style={{ backgroundColor: getColorByCount(count) }}
            onClick={() => onDayClick(cell, citasDia)}
          >
            <div className="mes-cell-day">{cell.dayNumber}</div>
            {count > 0 && (
              <div className="mes-cell-count">
                {count} {count === 1 ? "cita" : "citas"}
              </div>
            )}
          </div>
        );
      })}
      <button 
        className="fab-crear-cita"
        onClick={() => navigate("/citas/nueva")}
      >
        +
      </button>

    </div>
  );
}
