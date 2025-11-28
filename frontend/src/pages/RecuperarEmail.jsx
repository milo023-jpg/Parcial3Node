import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";

export default function RecuperarEmail() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRecuperar = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/recovery/email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Error al verificar email");
        return;
      }

      navigate("/recuperar/pregunta", {
        state: {
          userId: data.userId,
          pregunta: data.pregunta,
          nombre: data.nombre,
        },
      });
    } catch (err) {
      setLoading(false);
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Recuperar contraseña</h2>
        <p className="login-subtitle">Ingresa tu correo para iniciar el proceso</p>

        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleRecuperar}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Verificando..." : "Recuperar"}
          </button>
        </form>

        {/* 🔙 Botón volver estilizado */}
        <p
          className="forgot-password"
          onClick={() => navigate("/")}
        >
          ← Volver al inicio
        </p>
      </div>
    </div>
  );
}
