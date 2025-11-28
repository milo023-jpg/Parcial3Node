import { useState, useEffect } from "react";
import LayoutBase from "../components/LayoutBase";
import { formatCurrency } from "../utils/formatters";
import "./ReportesPage.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function ReportesPage() {
  const [resumen, setResumen] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  const empleadaId = localStorage.getItem("empleada_id") || "1";

  useEffect(() => {
    cargarDatos();
  }, [fecha]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [resumenRes, serviciosRes, clientesRes] = await Promise.all([
        fetch(`${API_URL}/reportes/resumen?empleada_id=${empleadaId}&fecha=${fecha}`),
        fetch(`${API_URL}/reportes/servicios-mas-vendidos?empleada_id=${empleadaId}&limite=5`),
        fetch(`${API_URL}/reportes/clientes-frecuentes?empleada_id=${empleadaId}&limite=5`)
      ]);

      const resumenData = await resumenRes.json();
      const serviciosData = await serviciosRes.json();
      const clientesData = await clientesRes.json();

      setResumen(resumenData);
      setServicios(serviciosData);
      setClientes(clientesData);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <LayoutBase title="📊 Reportes">
        <div className="loading">Cargando reportes...</div>
      </LayoutBase>
    );
  }

  return (
    <LayoutBase title="📊 Reportes">
      <div className="reportes-container">
        {/* Filtro de fecha */}
        <div className="filtro-fecha">
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="input-fecha"
          />
        </div>

        {/* Indicadores principales */}
        <div className="indicadores-grid">
          <div className="indicador-card rosa">
            <div className="indicador-icon">📅</div>
            <div className="indicador-info">
              <h3>{resumen?.citasHoy || 0}</h3>
              <p>Citas del día</p>
            </div>
          </div>

          <div className="indicador-card azul">
            <div className="indicador-icon">⏳</div>
            <div className="indicador-info">
              <h3>{resumen?.citasPendientes || 0}</h3>
              <p>Pendientes</p>
            </div>
          </div>

          <div className="indicador-card verde">
            <div className="indicador-icon">✅</div>
            <div className="indicador-info">
              <h3>{resumen?.citasFinalizadas || 0}</h3>
              <p>Finalizadas</p>
            </div>
          </div>

          <div className="indicador-card morado">
            <div className="indicador-icon">💰</div>
            <div className="indicador-info">
              <h3>{formatCurrency(resumen?.ventasHoy)}</h3>
              <p>Ventas del día</p>
            </div>
          </div>

          <div className="indicador-card naranja">
            <div className="indicador-icon">📈</div>
            <div className="indicador-info">
              <h3>{formatCurrency(resumen?.ventasMes)}</h3>
              <p>Ventas del mes</p>
            </div>
          </div>

          <div className="indicador-card fucsia">
            <div className="indicador-icon">👥</div>
            <div className="indicador-info">
              <h3>{resumen?.totalClientes || 0}</h3>
              <p>Total clientes</p>
            </div>
          </div>
        </div>

        {/* Servicios más vendidos */}
        <div className="reporte-section">
          <h2>💅 Servicios Más Vendidos</h2>
          <div className="tabla-container">
            {servicios.length > 0 ? (
              <table className="tabla-reportes">
                <thead>
                  <tr>
                    <th>Servicio</th>
                    <th>Cantidad</th>
                    <th>Ingresos</th>
                  </tr>
                </thead>
                <tbody>
                  {servicios.map((servicio) => (
                    <tr key={servicio.id}>
                      <td>{servicio.nombre}</td>
                      <td>{servicio.cantidad_vendida}</td>
                      <td>{formatCurrency(servicio.ingresos_totales)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No hay datos de servicios</p>
            )}
          </div>
        </div>

        {/* Clientes frecuentes */}
        <div className="reporte-section">
          <h2>⭐ Clientes Frecuentes</h2>
          <div className="tabla-container">
            {clientes.length > 0 ? (
              <table className="tabla-reportes">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Citas</th>
                    <th>Total Gastado</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.nombre} {cliente.apellido}</td>
                      <td>{cliente.telefono}</td>
                      <td>{cliente.total_citas}</td>
                      <td>{formatCurrency(cliente.total_gastado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No hay datos de clientes</p>
            )}
          </div>
        </div>
      </div>
    </LayoutBase>
  );
}
