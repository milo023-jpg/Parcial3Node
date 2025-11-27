import React from "react";

export default function FechaNavigator({ titulo, onPrev, onNext }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        marginTop: "10px",
        padding: "0 4px",
      }}
    >
      <button type="button" onClick={onPrev} className="nav-btn">
        ←
      </button>

      <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>
        {titulo}
      </h3>

      <button type="button" onClick={onNext} className="nav-btn">
        →
      </button>
    </div>
  );
}
