import { Link } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="sidebar-toggle"
        onClick={() => setOpen(!open)}
      >
        <FaBars size={22} />
      </button>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <h2 className="sidebar-title">Menú</h2>

        <nav className="sidebar-menu">
          <Link to="/calendario">📅 Calendario</Link>
          <Link to="/servicios">💅 Servicios</Link>
          <Link to="/cliente">👩 Cliente</Link>
          <Link to="/citas">📆 Gestión de citas</Link>
          <Link to="/ventas">💲 Historial de ventas</Link>
        </nav>
      </div>

      {/* Fondo oscuro al abrir */}
      {open && (
        <div className="sidebar-overlay" onClick={() => setOpen(false)}></div>
      )}
    </>
  );
}
