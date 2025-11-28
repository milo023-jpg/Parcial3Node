// src/pages/citas/EditarCitaPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import Sidebar from "../../components/Sidebar";
import "./CrearEditarCita.css";

export default function EditarCitaPage() {
  console.log("📌 Entré a EditarCitaPage");
  const navigate = useNavigate();
  const { id } = useParams();
  const empleadaId = localStorage.getItem("empleada_id") || "1";

  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const [loading, setLoading] = useState(true);

  // ===============================
  //  CARGAR DATOS DE CLIENTES Y SERVICIOS
  // ===============================
  const cargarDatosExtras = async () => {
    const rClientes = await fetch(`${API_URL}/clientes`);
    setClientes(await rClientes.json());

    const rServicios = await fetch(`${API_URL}/servicios`);
    setServicios(await rServicios.json());
  };

  // ===============================
  //  CARGAR CITA EXISTENTE
  // ===============================
  const cargarCita = async () => {
    const res = await fetch(`${API_URL}/citas/${id}`);
    const cita = await res.json();

    // Cliente
    setClienteId(cita.cliente_id);

    // Servicios
    setServiciosSeleccionados(cita.servicios.map((s) => s.id));

    // Fecha y hora desde fecha_inicio
    const [f, hFull] = cita.fecha_inicio.split("T");
    const h = hFull.substring(0, 5);

    setFecha(f);
    setHora(h);

    setLoading(false);
  };

  useEffect(() => {
    cargarDatosExtras();
    cargarCita();
  }, []);

  const toggleServicio = (servId) => {
    if (serviciosSeleccionados.includes(servId)) {
      setServiciosSeleccionados(serviciosSeleccionados.filter((s) => s !== servId));
    } else {
      setServiciosSeleccionados([...serviciosSeleccionados, servId]);
    }
  };

  // ===============================
  //  GUARDAR CAMBIOS
  // ===============================
  const editar = async () => {
    if (!clienteId || serviciosSeleccionados.length === 0 || !fecha || !hora) {
      alert("Completa todos los campos");
      return;
    }

    const body = {
      cliente_id: Number(clienteId),
      empleada_id: Number(empleadaId),
      servicios: serviciosSeleccionados.map(Number),
      fecha,
      hora,
    };

    const res = await fetch(`${API_URL}/citas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Error actualizando cita");
      return;
    }

    alert("Cita actualizada correctamente");
    navigate(`/agenda?fecha=${fecha}`);
  };

  // ===============================
  //  UI
  // ===============================

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "20px" }}>
        Cargando cita...
      </p>
    );
  }

  return (
    <div className="crear-cita-wrapper">
      <div className="crear-cita-card">
        <Sidebar />
        <h2 className="crear-cita-title">Editar cita</h2>

        <div className="formulario-cita">
          {/* CLIENTE */}
          <label className="crear-cita-label">Cliente:</label>
          <select
            className="crear-cita-select"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          >
            <option value="">Seleccione...</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre} {c.apellido} — {c.alias}
              </option>
            ))}
          </select>

          {/* SERVICIOS */}
          <label className="crear-cita-label">Servicios:</label>
          <div className="lista-servicios">
            {servicios.map((s) => (
              <label className="servicio-item" key={s.id}>
                <input
                  type="checkbox"
                  checked={serviciosSeleccionados.includes(s.id)}
                  onChange={() => toggleServicio(s.id)}
                />
                <div>
                  <div className="servicio-nombre">{s.nombre}</div>
                  <div className="servicio-duracion">
                    ({s.duracion_minutos} min)
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* FECHA */}
          <label className="crear-cita-label">Fecha:</label>
          <input
            className="crear-cita-input"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          {/* HORA */}
          <label className="crear-cita-label">Hora:</label>
          <input
            className="crear-cita-input"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />

          <button className="btn-crear-cita" onClick={editar}>
            Guardar cambios
          </button>

          <button
            className="btn-cancelar-form"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
