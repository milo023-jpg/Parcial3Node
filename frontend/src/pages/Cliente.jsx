import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

function Cliente() {
  const [clientes, setClientes] = useState([]);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    alias: "",
    cedula: ""
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [viewingCliente, setViewingCliente] = useState(null);

  // ------------- NUEVOS ESTADOS PARA FILTROS --------------
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroApellido, setFiltroApellido] = useState("");
  const [filtroTelefono, setFiltroTelefono] = useState("");

  const API_URL = `${import.meta.env.VITE_API_URL}/api/clientes`;

  // ============================
  //      CARGAR CLIENTES
  // ============================
  const fetchClientes = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error("Error al cargar clientes:", error);
      alert("Error al cargar clientes. Revisa la consola.");
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // ============================
  //      MANEJO FORMULARIO
  // ============================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ============================
  //      AGREGAR / EDITAR CLIENTE
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.apellido || !form.telefono) {
      alert("Nombre, apellido y teléfono son obligatorios");
      return;
    }

    const payload = {
      nombre: form.nombre,
      apellido: form.apellido,
      telefono: form.telefono,
      email: form.email || null,
      alias: form.alias || null,
      cedula: form.cedula || null
    };

    try {
      const res = await fetch(
        modalType === "edit" && editingId
          ? `${API_URL}/${editingId}`
          : API_URL,
        {
          method: modalType === "edit" ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error || "No se pudo guardar el cliente"}`);
        return;
      }

      setForm({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        alias: "",
        cedula: ""
      });

      setEditingId(null);
      setShowModal(false);
      fetchClientes();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      alert("Error al guardar cliente. Revisa la consola.");
    }
  };

  // ============================
  //      EDITAR CLIENTE
  // ============================
  const handleEdit = (cliente) => {
    setForm({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      telefono: cliente.telefono,
      email: cliente.email || "",
      alias: cliente.alias || "",
      cedula: cliente.cedula || ""
    });
    setEditingId(cliente.id);
    setModalType("edit");
    setShowModal(true);
  };

  // ============================
  //        VER DETALLE
  // ============================
  const handleView = (cliente) => {
    setViewingCliente(cliente);
    setModalType("view");
    setShowModal(true);
  };

  // ============================
  //      ELIMINAR CLIENTE
  // ============================
  const handleDelete = async (id) => {
    if (!window.confirm("¿Deseas eliminar este cliente?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        alert(`Error: ${data.error || "No se pudo eliminar el cliente"}`);
        return;
      }

      fetchClientes();
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      alert("Error al eliminar cliente. Revisa la consola.");
    }
  };

  // ============================
  //      FILTRADO CLIENTES
  // ============================
  const filteredClientes = clientes.filter((c) => {
    return (
      c.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
      c.apellido.toLowerCase().includes(filtroApellido.toLowerCase()) &&
      (c.telefono || "").toLowerCase().includes(filtroTelefono.toLowerCase())
    );
  });

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroApellido("");
    setFiltroTelefono("");
  };

  return (
    <div className="cliente-page" style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "15px", position: "relative" }}>
        <div className="titulo-clientes-box">
  <h2 className="titulo-clientes-text">👥 GESTIÓN DE CLIENTES </h2>
</div>


        {/* =======================
              FILTROS
        =========================*/}
        <div
          style={{
            background: "#fff",
            padding: "15px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
          }}
        >
          <h3 style={{ color: "#ff1493" }}>Buscar clientes 🔎 </h3>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Nombre"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: "8px" }}
            />

            <input
              type="text"
              placeholder="Apellido"
              value={filtroApellido}
              onChange={(e) => setFiltroApellido(e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: "8px" }}
            />

            <input
              type="text"
              placeholder="Teléfono"
              value={filtroTelefono}
              onChange={(e) => setFiltroTelefono(e.target.value)}
              style={{ flex: 1, padding: "8px", borderRadius: "8px" }}
            />
          </div>

          <button
            onClick={limpiarFiltros}
            style={{
              marginTop: "10px",
              background: "var(--fucsia-acento)",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            Limpiar filtros
          </button>
        </div>

        {/* BOTÓN AGREGAR */}
        {!showModal && (
          <button
            className="btn-primary"
            style={{
              marginBottom: "15px",
              float: "right",
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "10px",
              minWidth: "100px",
              maxWidth: "120px"
            }}
            onClick={() => {
              setForm({
                nombre: "",
                apellido: "",
                telefono: "",
                email: "",
                alias: "",
                cedula: ""
              });
              setModalType("add");
              setShowModal(true);
            }}
          >
            ➕ Agregar
          </button>
        )}

        <div
          style={{
            marginTop: "30px",
            background: "#fff",
            padding: "10px",
            borderRadius: "12px"
          }}
        >
          {filteredClientes.length === 0 ? (
            <p
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "16px",
                color: "gray"
              }}
            >
              ❌ No se encontraron clientes con esos filtros.
            </p>
          ) : (
            filteredClientes.map((c) => (
              <div
                key={c.id}
                className="card"
                style={{
                  background: "#fff",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                }}
              >
                <strong>
                  {c.nombre} {c.apellido}
                </strong>
                <p>{c.alias}</p>
                <p>{c.telefono}</p>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "10px"
                  }}
                >
                  <button
                    className="btn-primary"
                    style={{
                      flex: 1,
                      background: "var(--lavanda-intensa)"
                    }}
                    onClick={() => handleView(c)}
                  >
                    Ver 👀
                  </button>

                  <button
                    className="btn-primary"
                    style={{ flex: 1, background: "#4caf50" }}
                    onClick={() => handleEdit(c)}
                  >
                    Editar✏️
                  </button>

                  <button
                    className="btn-primary"
                    style={{ flex: 1, background: "var(--fucsia-acento)" }}
                    onClick={() => handleDelete(c.id)}
                  >
                    Eliminar✖️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ==============================
              MODAL COMPLETO
        ===============================*/}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
              padding: "10px"
            }}
          >
            <div
              className="card"
              style={{
                maxWidth: "380px",
                width: "100%",
                padding: "20px",
                borderRadius: "12px",
                background: "#fff",
                position: "relative"
              }}
            >
              <button
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "var(--fucsia-acento)",
                  color: "#fff",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                onClick={() => setShowModal(false)}
              >
                X
              </button>

              {(modalType === "add" || modalType === "edit") && (
                <>
                  <h3 style={{ textAlign: "center" }}>
                    {modalType === "edit"
                      ? "Editar Cliente"
                      : "Agregar Cliente"}
                  </h3>

                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      placeholder="Nombre"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      placeholder="Apellido"
                      name="apellido"
                      value={form.apellido}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      placeholder="Teléfono"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      placeholder="Email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      placeholder="Alias"
                      name="alias"
                      value={form.alias}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      placeholder="Cédula"
                      name="cedula"
                      value={form.cedula}
                      onChange={handleChange}
                    />

                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        width: "100%",
                        marginTop: "10px",
                        background: "var(--lavanda-intensa)"
                      }}
                    >
                      Guardar
                    </button>
                  </form>
                </>
              )}

              {modalType === "view" && viewingCliente && (
                <>
                  <h3 style={{ textAlign: "center" }}>Información del Cliente</h3>

                  <p><strong>Nombre:</strong> {viewingCliente.nombre}</p>
                  <p><strong>Apellido:</strong> {viewingCliente.apellido}</p>
                  <p><strong>Alias:</strong> {viewingCliente.alias}</p>
                  <p><strong>Teléfono:</strong> {viewingCliente.telefono}</p>
                  <p><strong>Email:</strong> {viewingCliente.email}</p>
                  <p><strong>Cédula:</strong> {viewingCliente.cedula}</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cliente;
