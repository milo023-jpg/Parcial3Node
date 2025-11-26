import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaKey } from "react-icons/fa";

export default function RecuperarPregunta() {
  const loc = useLocation();
  const navigate = useNavigate();
  const { userId, pregunta, nombre } = loc.state || {};

  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!userId) {
    navigate("/recuperar");
    return null;
  }

  const handleValidar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/auth/recovery/pregunta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          respuesta: answer   // <- CORREGIDO
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      // Guardamos userId para la última pantalla (cambiar password)
      localStorage.setItem("userIdRecovery", userId);

      navigate("/recuperar/nueva", { state: { userId } });
    } catch (err) {
      setError("Error al conectar con el servidor");
    }

    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Pregunta de seguridad</h2>
        <p className="login-subtitle">{pregunta || "Pregunta"}</p>

        {nombre && (
          <p style={{ marginBottom: 8, color: "var(--gris-violeta)" }}>
            Usuario: {nombre}
          </p>
        )}

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleValidar}>
          <div className="input-group">
            <FaKey className="input-icon" />
            <input
              type="text"
              placeholder="Respuesta"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Validando..." : "Validar"}
          </button>
        </form>
      </div>
    </div>
  );
}
