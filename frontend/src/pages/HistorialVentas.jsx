import { useState, useEffect } from "react";
import LayoutBase from "../components/LayoutBase";
import { formatCurrency } from "../utils/formatters";
import "./HistorialVentas.css";

const API_URL = `${import.meta.env.VITE_API_URL}/api` || "http://localhost:4000/api";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    metodo_pago: ""
  });

  const empleadaId = localStorage.getItem("empleada_id") || "1";

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/reportes/ventas?empleada_id=${empleadaId}`;
      
      if (filtros.fecha_inicio) url += `&fecha_inicio=${filtros.fecha_inicio}`;
      if (filtros.fecha_fin) url += `&fecha_fin=${filtros.fecha_fin}`;
      if (filtros.metodo_pago) url += `&metodo_pago=${filtros.metodo_pago}`;

      const response = await fetch(url);
      const data = await response.json();

      setVentas(data.ventas || []);
      setResumen(data.resumen || null);
    } catch (error) {
      console.error("Error cargando ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

  const aplicarFiltros = () => {
    cargarVentas();
  };

  const limpiarFiltros = () => {
    setFiltros({
      fecha_inicio: "",
      fecha_fin: "",
      metodo_pago: ""
    });
    setTimeout(() => cargarVentas(), 100);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <LayoutBase title="💰 Historial de Ventas">
      <div className="ventas-container">
        {/* Filtros */}
        <div className="filtros-card">
          <h3>🔍 Filtros</h3>
          <div className="filtros-grid">
            <div className="filtro-item">
              <label>Fecha Inicio:</label>
              <input
                type="date"
                name="fecha_inicio"
                value={filtros.fecha_inicio}
                onChange={handleFiltroChange}
                className="input-filtro"
              />
            </div>

            <div className="filtro-item">
              <label>Fecha Fin:</label>
              <input
                type="date"
                name="fecha_fin"
                value={filtros.fecha_fin}
                onChange={handleFiltroChange}
                className="input-filtro"
              />
            </div>

            <div className="filtro-item">
              <label>Método de Pago:</label>
              <select
                name="metodo_pago"
                value={filtros.metodo_pago}
                onChange={handleFiltroChange}
                className="input-filtro"
              >
                <option value="">Todos</option>
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="otro">Otro</option>
              </select>
            </div>
          </div>

          <div className="filtros-botones">
            <button onClick={aplicarFiltros} className="btn-aplicar">
              Aplicar Filtros
            </button>
            <button onClick={limpiarFiltros} className="btn-limpiar">
              Limpiar
            </button>
          </div>
        </div>

        {/* Resumen */}
        {resumen && (
          <div className="resumen-ventas">
            <div className="resumen-card">
              <div className="resumen-icon">💵</div>
              <div>
                <h4>Total Ventas</h4>
                <p className="resumen-valor">{formatCurrency(resumen.total_ventas)}</p>
              </div>
            </div>

            <div className="resumen-card">
              <div className="resumen-icon">📊</div>
              <div>
                <h4>Cantidad</h4>
                <p className="resumen-valor">{resumen.cantidad_ventas}</p>
              </div>
            </div>

            <div className="resumen-card">
              <div className="resumen-icon">📈</div>
              <div>
                <h4>Promedio</h4>
                <p className="resumen-valor">{formatCurrency(resumen.promedio_venta)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Desglose por método de pago */}
        {resumen && resumen.por_metodo.length > 0 && (
          <div className="metodos-pago-card">
            <h3>💳 Por Método de Pago</h3>
            <div className="metodos-grid">
              {resumen.por_metodo.map((metodo) => (
                <div key={metodo.metodo} className="metodo-item">
                  <span className="metodo-nombre">{metodo.metodo}</span>
                  <span className="metodo-cantidad">{metodo.cantidad} ventas</span>
                  <span className="metodo-total">{formatCurrency(metodo.total)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabla de ventas */}
        <div className="ventas-tabla-card">
          <h3>📋 Detalle de Ventas</h3>
          {loading ? (
            <div className="loading">Cargando ventas...</div>
          ) : ventas.length > 0 ? (
            <div className="tabla-scroll">
              <table className="tabla-ventas">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Teléfono</th>
                    <th>Método</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {ventas.map((venta) => (
                    <tr key={venta.pago_id}>
                      <td>{formatearFecha(venta.fecha_pago)}</td>
                      <td>{venta.cliente_nombre} {venta.cliente_apellido}</td>
                      <td>{venta.cliente_telefono}</td>
                      <td>
                        <span className={`badge-metodo ${venta.metodo_pago}`}>
                          {venta.metodo_pago}
                        </span>
                      </td>
                      <td className="monto">{formatCurrency(venta.monto)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No hay ventas registradas</p>
          )}
        </div>
      </div>
    </LayoutBase>
  );
}
