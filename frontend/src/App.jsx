import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Calendario from "./pages/calendario";
import RecuperarEmail from "./pages/RecuperarEmail";
import RecuperarPregunta from "./pages/RecuperarPregunta";
import RecuperarNueva from "./pages/RecuperarNueva";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* RUTAS PROTEGIDAS */}
        <Route path="/calendario" element={<Calendario />} />

        {/* Recuperación de contraseña */}
        <Route path="/recuperar" element={<RecuperarEmail />} />
        <Route path="/recuperar/pregunta" element={<RecuperarPregunta />} />
        <Route path="/recuperar/nueva" element={<RecuperarNueva />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
