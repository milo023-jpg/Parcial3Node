// src/pages/Servicios.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    duracion_minutos: "",
    precio: "",
    categoria: "",
    activo: 1
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add", "edit", "view"
  const [editingId, setEditingId] = useState(null);
  const [viewingServicio, setViewingServicio] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/servicios`;

  // Cargar servicios
  const fetchServicios = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
      alert("Error al cargar servicios. Revisa la consola.");
    }
  };

  useEffect(() => {
    fetchServicios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked ? 1 : 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || form.duracion_minutos === "" || form.precio === "") {
      alert("Nombre, duración (minutos) y precio son obligatorios");
      return;
    }

    const payload = {
      nombre: form.nombre,
      descripcion: form.descripcion || null,
      duracion_minutos: Number(form.duracion_minutos),
      precio: Number(form.precio),
      categoria: form.categoria || null,
      activo: form.activo == null ? 1 : form.activo
    };

    try {
      const res = await fetch(
        modalType === "edit" && editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: modalType === "edit" && editingId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.error || "No se pudo guardar el servicio"}`);
        return;
      }

      // reset + reload
      setForm({ nombre: "", descripcion: "", duracion_minutos: "", precio: "", categoria: "", activo: 1 });
      setEditingId(null);
      setShowModal(false);
      fetchServicios();
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      alert("Error al guardar servicio. Revisa la consola.");
    }
  };

  const handleEdit = (s) => {
    setForm({
      nombre: s.nombre,
      descripcion: s.descripcion || "",
      duracion_minutos: s.duracion_minutos,
      precio: s.precio,
      categoria: s.categoria || "",
      activo: s.activo
    });
    setEditingId(s.id);
    setModalType("edit");
    setShowModal(true);
  };

  const handleView = (s) => {
    setViewingServicio(s);
    setModalType("view");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este servicio?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(`Error: ${data.error || "No se pudo eliminar el servicio"}`);
        return;
      }
      fetchServicios();
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      alert("Error al eliminar servicio. Revisa la consola.");
    }
  };

  return (
    <div className="servicios-page" style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "18px", position: "relative" }}>
        {/* Título estilo llamativo (usa app.css) */}
        <div className="page-title-card">
          <h2 className="page-title">Catálogo de Servicios💅🏼</h2>
          <p className="page-subtitle">Administra los servicios: nombre, duración, precio y categoría</p>
        </div>

        {/* Agregar */}
        {!showModal && (
          <button
            className="btn-primary"
            style={{ marginBottom: "15px", float: "right", padding: "8px 12px", fontSize: "14px", borderRadius: "10px", minWidth: "120px" }}
            onClick={() => {
              setForm({ nombre: "", descripcion: "", duracion_minutos: "", precio: "", categoria: "", activo: 1 });
              setModalType("add");
              setShowModal(true);
            }}
          >
            ➕ Nuevo Servicio
          </button>
        )}

        <div style={{ clear: "both" }} />

        {/* Lista servicios */}
        <div className="servicios-list" style={{ marginTop: "18px", display: "grid", gap: "12px" }}>
          {servicios.length === 0 ? (
            <div className="no-data">No hay servicios aún. Agrega uno nuevo ✨</div>
          ) : (
            servicios.map((s) => (
              <div key={s.id} className="card servicio-card">
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>
                      {/* iconos simples */}
                      🎀{s.nombre} {s.activo ? null : <span style={{ fontSize: 14, color: "#999", marginLeft: 8 }}>(Inactivo)</span>}
                    </h3>
                    <p style={{ margin: "6px 0", color: "var(--gris-violeta)" }}>{s.descripcion}</p>

                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: 6 }}>
                      <small>⏱️ {s.duracion_minutos} min</small>
                      <small>💲 {Number(s.precio).toFixed(2)}</small>
                      <small>🏷️ {s.categoria || "—"}</small>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", minWidth: 180 }}>
                    <button className="btn-primary" style={{ flex: 1, background: "#4caf50" }} onClick={() => handleEdit(s)}>Editar✏️</button>
                    <button className="btn-primary" style={{ flex: 1, background: "var(--fucsia-acento)" }} onClick={() => handleDelete(s.id)}>Eliminar✖️</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="card modal-card">
              <button className="modal-close" onClick={() => setShowModal(false)}>X</button>

              {(modalType === "add" || modalType === "edit") && (
                <>
                  <h3 style={{ textAlign: "center" }}>{modalType === "edit" ? "Editar Servicio" : "Agregar Servicio"}</h3>

                  <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Nombre" name="nombre" value={form.nombre} onChange={handleChange} />
                    <textarea placeholder="Descripción" name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid var(--gris-violeta)", marginBottom: 12 }} />

                    <div style={{ display: "flex", gap: 10 }}>
                      <input type="number" placeholder="Duración (min)" name="duracion_minutos" value={form.duracion_minutos} onChange={handleChange} style={{ flex: 1 }} />
                      <input type="number" placeholder="Precio" step="0.01" name="precio" value={form.precio} onChange={handleChange} style={{ flex: 1 }} />
                    </div>

                    <input type="text" placeholder="Categoría" name="categoria" value={form.categoria} onChange={handleChange} />
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input type="checkbox" name="activo" checked={Number(form.activo) === 1} onChange={handleChange} /> Activo
                    </label>

                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 12 }}>{modalType === "edit" ? "Actualizar" : "Guardar"}</button>
                  </form>
                </>
              )}

              {modalType === "view" && viewingServicio && (
                <>
                  <h3 style={{ textAlign: "center" }}>Detalle del Servicio</h3>
                  <p><strong>Nombre:</strong> {viewingServicio.nombre}</p>
                  <p><strong>Descripción:</strong> {viewingServicio.descripcion}</p>
                  <p><strong>Duración:</strong> {viewingServicio.duracion_minutos} min</p>
                  <p><strong>Precio:</strong> ${Number(viewingServicio.precio).toFixed(2)}</p>
                  <p><strong>Categoría:</strong> {viewingServicio.categoria}</p>
                  <p><strong>Activo:</strong> {viewingServicio.activo ? "Sí" : "No"}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Servicios;
