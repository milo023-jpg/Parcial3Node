import Sidebar from "../components/Sidebar";

export default function Calendario() {
  return (
    <div className="page-container">
      <Sidebar />

      <div className="content">
        <h1 style={{ color: "var(--lavanda-intensa)" }}>Vista Calendario</h1>
        <p style={{ color: "var(--gris-violeta)" }}>
          Esta es una pantalla temporal mientras se construye el módulo real.
        </p>
      </div>
    </div>
  );
}
