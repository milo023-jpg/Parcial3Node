import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function RecuperarNueva() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { userId } = loc.state || {};
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId) {
    navigate("/recuperar");
    return null;
  }

  const handleGuardar = async (e) => {
    e.preventDefault();
    setError("");
    setOkMsg("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/recovery/nueva-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword: password }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Error al guardar la contraseña");
        return;
      }

      setOkMsg("Contraseña actualizada correctamente. Redirigiendo al login...");
      setTimeout(() => {
        navigate("/");
      }, 1400);
    } catch (err) {
      setLoading(false);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Crear nueva contraseña</h2>
        <p className="login-subtitle">Escribe tu nueva contraseña</p>

        {error && <p className="login-error">{error}</p>}
        {okMsg && <p style={{ color: "green" }}>{okMsg}</p>}

        <form onSubmit={handleGuardar}>
          <div className="input-group">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
