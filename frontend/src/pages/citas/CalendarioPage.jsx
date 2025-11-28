import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config/api";

import SemanaGoogleView from "../../components/citas/SemanaGoogleView";
import MesView from "../../components/citas/MesView";
import FechaNavigator from "../../components/citas/FechaNavigator";
import ModalCitasDia from "../../components/citas/ModalCitasDia";
import ModalPago from "../../components/citas/ModalPago";
import Sidebar from "../../components/Sidebar";

import "../../App.css"; // si necesitas estilos generales

function formatLocalISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const nombresDiasCortos = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
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

export default function CalendarioPage() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("semana"); // 'semana' | 'mes'
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalInfo, setModalInfo] = useState({
    isOpen: false,
    fechaISO: null,
    label: "",
    citas: [],
  });
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [citaParaPago, setCitaParaPago] = useState(null);

  const navigate = useNavigate();

  const getCitas = async () => {
    const empleadaId = localStorage.getItem("empleada_id") || "1";

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/citas/todas?empleada_id=${empleadaId}`
      );
      if (!res.ok) throw new Error("Error al cargar citas");

      const data = await res.json();

      // Normalización
      const normalizadas = data.map((c) => {
        const dInicio = new Date(c.fecha_inicio);
        return {
          ...c,
          fechaLocal: formatLocalISO(dInicio),
        };
      });

      setCitas(normalizadas);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // =======================
  // Finalizar con pago
  // =======================
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
        await getCitas();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || "No se pudo registrar el pago"}`);
      }
    } catch (error) {
      console.error("Error al registrar pago:", error);
      alert("Error de conexión al registrar el pago");
    }
  };

  // =======================
  // Cargar citas de empleada
  // =======================
  useEffect(() => {
    getCitas();
  }, []);

  // =======================
  // Lógica semana actual
  // =======================
  const getSemanaDias = (baseDate) => {
    const result = [];
    const date = new Date(baseDate);
    // queremos lunes como inicio: 0=domingo...6=sábado
    const day = date.getDay(); // 0..6
    const diffToMonday = (day + 6) % 7; // lunes=0
    date.setDate(date.getDate() - diffToMonday);

    for (let i = 0; i < 7; i++) {
      const d = new Date(date);
      d.setDate(date.getDate() + i);

      result.push({
        date: d,
        iso: formatLocalISO(d),
        nombreCorto: nombresDiasCortos[d.getDay()],
        diaNumero: d.getDate(),
      });
    }
    return result;
  };

  const semanaDias = getSemanaDias(currentDate);

  const tituloSemana = (() => {
    const inicio = semanaDias[0].date;
    const fin = semanaDias[6].date;
    const mismoMes = inicio.getMonth() === fin.getMonth();

    const parteInicio = `${inicio.getDate()} ${
      nombresMeses[inicio.getMonth()]
    }`;
    const parteFin = `${fin.getDate()} ${nombresMeses[fin.getMonth()]}`;
    const año = inicio.getFullYear();

    return `Semana del ${parteInicio} al ${parteFin} ${año}`;
  })();

  const handlePrevSemana = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextSemana = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  // =======================
  // Lógica vista mensual
  // =======================
  const getMonthCells = (baseDate) => {
    const cells = [];
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstOfMonth = new Date(year, month, 1);
    const firstDay = (firstOfMonth.getDay() + 6) % 7; // lunes=0
    const startDate = new Date(year, month, 1 - firstDay);

    for (let i = 0; i < 42; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);

      cells.push({
        date: d,
        dayNumber: d.getDate(),
        inMonth: d.getMonth() === month,
        iso: formatLocalISO(d),
      });
    }

    return cells;
  };

  const monthCells = getMonthCells(currentDate);

  const tituloMes = `${
    nombresMeses[currentDate.getMonth()]
  } ${currentDate.getFullYear()}`;

  const citasPorDia = citas.reduce((acc, c) => {
    if (!acc[c.fechaLocal]) acc[c.fechaLocal] = [];
    acc[c.fechaLocal].push(c);
    return acc;
  }, {});

  const handlePrevMes = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const handleNextMes = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const abrirModalDia = (cell, citasDelDia) => {
    const d = cell.date;
    const label = `${d.getDate()} de ${
      nombresMeses[d.getMonth()]
    } de ${d.getFullYear()}`;

    setModalInfo({
      isOpen: true,
      fechaISO: cell.iso,
      label,
      citas: citasDelDia,
    });
  };

  const cerrarModalDia = () => {
    setModalInfo((prev) => ({ ...prev, isOpen: false }));
  };

  const verDiaCompleto = () => {
    if (!modalInfo.fechaISO) return;
    cerrarModalDia();
    navigate(`/agenda?fecha=${modalInfo.fechaISO}`);
  };

  const crearCitaEsteDia = () => {
    if (!modalInfo.fechaISO) return;
    cerrarModalDia(); // opcional
    navigate(`/citas/nueva?fecha=${modalInfo.fechaISO}`);
  };


  // =======================
  // UI
  // =======================
  if (loading) {
    return <p style={{ textAlign: "center" }}>Cargando citas...</p>;
  }

  if (error) {
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;
  }

  return (
    <div className="layout-contenido-principal">
      {/* ========== MENÚ DESPLEGABLE ========== */}
      <Sidebar />
      {/* Puedes envolver esto en tu LayoutBase/Sidebar si ya lo tienes */}
      <h2 style={{ textAlign: "center", marginTop: "8px" }}>
        Calendario de citas
      </h2>

      <div
        style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}
      >
        <button
          className="nav-btn"
          style={{
            marginRight: "8px",
            background: viewMode === "semana" ? "#b28bff" : "#e8b6ff",
          }}
          onClick={() => setViewMode("semana")}
        >
          Semana
        </button>
        <button
          className="nav-btn"
          style={{
            background: viewMode === "mes" ? "#b28bff" : "#e8b6ff",
          }}
          onClick={() => setViewMode("mes")}
        >
          Mes
        </button>
      </div>

      {viewMode === "semana" ? (
        <>
          <FechaNavigator
            titulo={tituloSemana}
            onPrev={handlePrevSemana}
            onNext={handleNextSemana}
          />
          <SemanaGoogleView
            semanaDias={semanaDias}
            citas={citas}
            onUpdate={getCitas}
            onFinalizarConPago={finalizarConPago}
          />
        </>
      ) : (
        <>
          <FechaNavigator
            titulo={tituloMes}
            onPrev={handlePrevMes}
            onNext={handleNextMes}
          />
          <MesView
            monthCells={monthCells}
            citasPorDia={citasPorDia}
            onDayClick={abrirModalDia}
          />
        </>
      )}

      <ModalCitasDia
        isOpen={modalInfo.isOpen}
        onClose={cerrarModalDia}
        fechaLabel={modalInfo.label}
        citas={modalInfo.citas}
        onVerDiaCompleto={verDiaCompleto}
        onCrearCita={crearCitaEsteDia}
        onEdit={(id) => navigate(`/citas/editar/${id}`)}
        onEstado={async (id, estado) => {
          await fetch(`${API_URL}/citas/${id}/estado`, {
            method: "PATCH",
            body: JSON.stringify({ estado }),
            headers: { "Content-Type": "application/json" },
          });
          await getCitas();
        }}
        onCancel={async (id) => {
          if (window.confirm("¿Cancelar esta cita?")) {
            await fetch(`${API_URL}/citas/${id}/cancelar`, { method: "PATCH" });
            await getCitas();
          }
        }}
        onFinalizarConPago={finalizarConPago}
      />

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
