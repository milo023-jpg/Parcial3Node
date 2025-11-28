// src/pages/citas/CrearCitaPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../config/api";
import Sidebar from "../../components/Sidebar";
import "./CrearEditarCita.css";

export default function CrearCitaPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const fechaParam = params.get("fecha");

  const empleadaId = localStorage.getItem("empleada_id") || "1";

  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const [fecha, setFecha] = useState(
    fechaParam || new Date().toISOString().split("T")[0]
  );
  const [hora, setHora] = useState("");

  const cargarDatos = async () => {
    const resClientes = await fetch(`${API_URL}/clientes`);
    const listaClientes = await resClientes.json();
    setClientes(listaClientes);

    const resServicios = await fetch(`${API_URL}/servicios`);
    const listaServicios = await resServicios.json();
    setServicios(listaServicios);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const toggleServicio = (id) => {
    if (serviciosSeleccionados.includes(id)) {
      setServiciosSeleccionados(serviciosSeleccionados.filter((s) => s !== id));
    } else {
      setServiciosSeleccionados([...serviciosSeleccionados, id]);
    }
  };

  const crearCita = async () => {
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

    try {
      const res = await fetch(`${API_URL}/citas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error creando cita");
        return;
      }

      alert("Cita creada exitosamente");
      navigate(`/calendario`);
    } catch (error) {
      console.error("Error creando cita:", error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="crear-cita-wrapper">
      <div className="crear-cita-card">
        <Sidebar />
        <h2 className="crear-cita-title">Crear nueva cita</h2>

        <div className="formulario-cita">
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

          <label className="crear-cita-label">Servicios:</label>
          <div className="lista-servicios">
            {servicios.map((s) => (
              <label className="servicio-item" key={s.id}>
                <input
                  type="checkbox"
                  checked={!!serviciosSeleccionados.includes(s.id)}
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

          <label className="crear-cita-label">Fecha:</label>
          <input
            className="crear-cita-input"
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />

          <label className="crear-cita-label">Hora:</label>
          <input
            className="crear-cita-input"
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          />

          <button className="btn-crear-cita" onClick={crearCita}>
            Crear cita
          </button>
          <button className="btn-cancelar-form">Cancelar</button>
        </div>
      </div>
    </div>
  );
}
