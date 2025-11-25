import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Calendario from "./pages/calendario";


function App() {
  return (
    <BrowserRouter>
      <Routes>

         {/* Página principal → Login */}
        <Route path="/" element={<Login />} />

        {/* Vista después del login */}
        <Route path="/calendario" element={<Calendario />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
