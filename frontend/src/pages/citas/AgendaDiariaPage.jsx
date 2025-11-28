import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";
import FechaNavigator from "../../components/citas/FechaNavigator";
import CitaCard from "../../components/citas/CitaCard";
import ModalPago from "../../components/citas/ModalPago";
import Sidebar from "../../components/Sidebar";

function formatLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISOToLocalDate(isoString) {
  const [y, m, d] = isoString.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const nombresMeses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export default function AgendaDiariaPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const fechaParam = params.get("fecha");
  const [fechaActual, setFechaActual] = useState(
    fechaParam ? parseISOToLocalDate(fechaParam) : new Date()
  );

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [citaParaPago, setCitaParaPago] = useState(null);

  const empleadaId = localStorage.getItem("empleada_id") || "1"; // académico

  const cargarCitas = async (fechaISO) => {
    const fechaValida = fechaISO || new Date().toISOString().split("T")[0];

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/citas?empleada_id=${empleadaId}&fecha=${fechaValida}`
      );

      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Respuesta inesperada:", data);
        return;
      }

      setCitas(data);
    } catch (error) {
      console.error("Error cargando citas:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    const iso = formatLocalISO(fechaActual);
    cargarCitas(iso);
    navigate(`/agenda?fecha=${iso}`, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fechaActual]);

  const tituloFecha = (() => {
    const d = fechaActual;
    return `${d.getDate()} de ${
      nombresMeses[d.getMonth()]
    } de ${d.getFullYear()}`;
  })();

  const cambiarDia = (delta) => {
    const d = new Date(fechaActual);
    d.setDate(d.getDate() + delta);
    setFechaActual(d);
  };

  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando citas del día...</p>;
  }

  const editarCita = (id) => navigate(`/citas/editar/${id}`);

  const finalizarConPago = (cita) => {
    setCitaParaPago(cita);
    setMostrarModalPago(true);
  };

  const confirmarPago = async ({ metodo_pago, monto }) => {
    try {
      const response = await fetch(`${API_URL}/citas/${citaParaPago.id}/pago`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metodo_pago, monto }),
      });

      if (response.ok) {
        alert("Pago registrado y cita finalizada correctamente");
        setMostrarModalPago(false);
        setCitaParaPago(null);
        await cargarCitas(formatLocalISO(fechaActual));
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo registrar el pago"}`);
      }
    } catch (error) {
      console.error("Error al registrar pago:", error);
      alert("Error de conexión al registrar el pago");
    }
  };

  const cambiarEstado = async (id, estado) => {
    await fetch(`http://localhost:4000/api/citas/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
      headers: { "Content-Type": "application/json" },
    });

    cargarCitas(formatLocalISO(fechaActual)); // refrescar
  };

  const cancelarCita = async (id) => {
    const confirmar = window.confirm("¿Seguro que quieres cancelar esta cita?");
    if (!confirmar) return;

    await fetch(`http://localhost:4000/api/citas/${id}/cancelar`, {
      method: "PATCH",
    });

    await cargarCitas(); // refrescar la agenda diaria
  };

  const fechaFormateada = fechaActual.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const fechaISO = formatLocalISO(fechaActual);

  return (
    <div className="layout-contenido-principal">
      {/* ========== MENÚ DESPLEGABLE ========== */}
      <Sidebar />
      <h2 style={{ textAlign: "center", marginTop: "8px" }}>Agenda diaria</h2>

      <FechaNavigator
        titulo={tituloFecha}
        onPrev={() => cambiarDia(-1)}
        onNext={() => cambiarDia(1)}
      />

      <div
        className="agenda-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px",
        }}
      >
        <h2>{fechaFormateada}</h2>

        <button
          className="btn-agenda-crear"
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            background: "#b083ff",
            color: "white",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/citas/nueva?fecha=${fechaISO}`)}
        >
          ➕ Crear cita
        </button>
      </div>

      {citas.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "16px" }}>
          No hay citas para esta fecha.
        </p>
      ) : (
        citas.map((cita) => (
          <CitaCard
            key={cita.id}
            cita={cita}
            onEdit={() => editarCita(cita.id)}
            onEstado={(nuevoEstado) => cambiarEstado(cita.id, nuevoEstado)}
            onCancel={() => cancelarCita(cita.id)}
            onFinalizarConPago={finalizarConPago}
          />
        ))
      )}

      {mostrarModalPago && citaParaPago && (
        <ModalPago
          cita={citaParaPago}
          onConfirm={confirmarPago}
          onCancel={() => {
            setMostrarModalPago(false);
            setCitaParaPago(null);
          }}
        />
      )}
    </div>
  );
}
