import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars } from "react-icons/fa";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Limpiamos datos de la sesión
    setOpen(false);       // Cerramos el menú
    navigate("/");        // Redirigimos al login
  };

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
          <Link to="/agenda">🗓 Agenda diaria</Link>
          <Link to="/citas/nueva">📝 Crear Cita</Link>
          <Link to="/servicios">💅 Servicios</Link>
          <Link to="/cliente">👩 Cliente</Link>
          <Link to="/reportes">📊 Reportes</Link>
          <Link to="/ventas">💲 Historial de ventas</Link>

          {/* Botón cerrar sesión */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: "25px",
              padding: "12px",
              width: "100%",
              background: "var(--fucsia-acento)",
              color: "white",
              fontSize: "15px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer"
            }}
          >
            🚪 Cerrar sesión
          </button>
        </nav>
      </div>

      {/* Fondo oscuro */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
