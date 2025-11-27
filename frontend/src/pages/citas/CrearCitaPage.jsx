// src/pages/citas/CrearCitaPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../config/api";
import Sidebar from "../../components/Sidebar";

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

  const [fecha, setFecha] = useState(fechaParam || new Date().toISOString().split("T")[0]);
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
      cliente_id: clienteId,
      empleada_id: empleadaId,
      servicios: serviciosSeleccionados,
      fecha,
      hora,
    };

    await fetch(`${API_URL}/citas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    alert("Cita creada exitosamente");
    navigate(`/agenda?fecha=${fecha}`);
  };

  return (
    <div className="layout-contenido-principal">
      <Sidebar />
      <h2 style={{ textAlign: "center" }}>Crear nueva cita</h2>

      <div className="formulario-cita">

        <label>Cliente:</label>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Seleccione...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido} — {c.alias}
            </option>
          ))}
        </select>

        <label>Servicios:</label>
        <div className="lista-servicios">
          {servicios.map((s) => (
            <label key={s.id} className="servicio-item">
              <input
                type="checkbox"
                checked={serviciosSeleccionados.includes(s.id)}
                onChange={() => toggleServicio(s.id)}
              />
              {s.nombre} ({s.duracion_minutos} min)
            </label>
          ))}
        </div>

        <label>Fecha:</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <label>Hora:</label>
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />

        <button className="btn-crear" onClick={crearCita}>Crear cita</button>
      </div>
    </div>
  );
}
