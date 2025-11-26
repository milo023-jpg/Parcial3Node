import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Calendario from "./pages/calendario";
import RecuperarEmail from "./pages/RecuperarEmail";
import RecuperarPregunta from "./pages/RecuperarPregunta";
import RecuperarNueva from "./pages/RecuperarNueva";
import Cliente from "./pages/Cliente";
import ReportesPage from "./pages/ReportesPage";
import HistorialVentas from "./pages/HistorialVentas";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/calendario" element={<Calendario />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/reportes" element={<ReportesPage />} />
        <Route path="/ventas" element={<HistorialVentas />} />

        {/* Recuperación de contraseña */}
        <Route path="/recuperar" element={<RecuperarEmail />} />
        <Route path="/recuperar/pregunta" element={<RecuperarPregunta />} />
        <Route path="/recuperar/nueva" element={<RecuperarNueva />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
