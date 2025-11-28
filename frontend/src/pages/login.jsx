import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      navigate("/calendario");
    } catch (err) {
      setErrorMsg("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* ⭐ LOGO (AGREGADO SIN MODIFICAR NADA MÁS) */}
        <img
          src={logo}
          alt="Logo"
          style={{
            width: "180px",
            display: "block",
            margin: "0 auto 20px auto"
          }}
        />

        <h2 className="login-title">Bienvenida ✨</h2>
        <p className="login-subtitle">Inicia sesión para continuar</p>

        {errorMsg && <p className="login-error">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary">Iniciar sesión</button>
        </form>

        {/* 🔗 ENLACE A RECUPERAR CONTRASEÑA */}
        <p className="forgot-password">
          <Link
            to="/recuperar"
            style={{
              color: "var(--fucsia-acento)",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </p>

      </div>
    </div>
  );
}
