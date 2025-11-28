import { useState } from "react";
import { formatCurrency } from "../../utils/formatters";
import "./ModalPago.css";

export default function ModalPago({ cita, onConfirm, onCancel }) {
  const [metodoPago, setMetodoPago] = useState("efectivo");
  const [monto, setMonto] = useState(cita.valor_total || 0);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!monto || monto <= 0) {
      alert("El monto debe ser mayor a 0");
      return;
    }

    setLoading(true);
    try {
      await onConfirm({ metodo_pago: metodoPago, monto: parseFloat(monto) });
    } catch (error) {
      console.error("Error al registrar pago:", error);
      alert("Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>💰 Registrar Pago</h3>
          <button className="modal-close" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="info-cita">
            <p>
              <strong>Cliente:</strong> {cita.cliente?.nombre || "N/A"}{" "}
              {cita.cliente?.apellido || ""}
            </p>
            <p>
              <strong>Servicios:</strong>{" "}
              {cita.servicios?.map((s) => s.nombre).join(", ") || "N/A"}
            </p>
            <p className="total-cita">
              <strong>Total de la cita:</strong>{" "}
              {formatCurrency(cita.valor_total)}
            </p>
          </div>

          <div className="form-group">
            <label htmlFor="metodo-pago">Método de pago:</label>
            <select
              id="metodo-pago"
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              className="form-select"
            >
              <option value="efectivo">💵 Efectivo</option>
              <option value="tarjeta">💳 Tarjeta</option>
              <option value="transferencia">🏦 Transferencia</option>
              <option value="otro">📱 Otro</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="monto">Monto a cobrar:</label>
            <input
              id="monto"
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="form-input"
              min="0"
              step="1000"
            />
            <small className="form-hint">
              Puedes modificar el monto si hay descuento
            </small>
          </div>
        </div>

        <div className="modal-footer">
          <button
            onClick={onCancel}
            className="btn-cancelar"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="btn-confirmar"
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar Pago"}
          </button>
        </div>
      </div>
    </div>
  );
}
