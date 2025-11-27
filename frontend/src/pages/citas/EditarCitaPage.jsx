// src/pages/citas/EditarCitaPage.jsx

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import Sidebar from "../../components/Sidebar";

export default function EditarCitaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const empleadaId = localStorage.getItem("empleada_id") || "1";

  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([]);

  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  const cargarCita = async () => {
    const res = await fetch(`${API_URL}/citas/${id}`);
    const cita = await res.json();

    setClienteId(cita.cliente_id);
    setServiciosSeleccionados(cita.servicios.map((s) => s.id));

    const f = cita.fecha_inicio.split("T")[0];
    const h = cita.fecha_inicio.split("T")[1].substring(0, 5);

    setFecha(f);
    setHora(h);
  };

  const cargarDatosExtras = async () => {
    const rClientes = await fetch(`${API_URL}/clientes`);
    setClientes(await rClientes.json());

    const rServicios = await fetch(`${API_URL}/servicios`);
    setServicios(await rServicios.json());
  };

  useEffect(() => {
    cargarDatosExtras();
    cargarCita();
  }, []);

  const toggleServicio = (id) => {
    if (serviciosSeleccionados.includes(id)) {
      setServiciosSeleccionados(serviciosSeleccionados.filter((s) => s !== id));
    } else {
      setServiciosSeleccionados([...serviciosSeleccionados, id]);
    }
  };

  const editar = async () => {
    const body = {
      cliente_id: clienteId,
      empleada_id: empleadaId,
      servicios: serviciosSeleccionados,
      fecha,
      hora,
    };

    await fetch(`${API_URL}/citas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    alert("Cita actualizada");
    navigate(`/agenda?fecha=${fecha}`);
  };

  return (
    <div className="layout-contenido-principal">
      <Sidebar />

      <h2 style={{ textAlign: "center" }}>Editar cita</h2>

      <div className="formulario-cita">

        <label>Cliente:</label>
        <select value={clienteId} onChange={(e) => setClienteId(e.target.value)}>
          <option value="">Seleccione...</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.apellido}
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

        <button className="btn-crear" onClick={editar}>Guardar cambios</button>
      </div>
    </div>
  );
}
