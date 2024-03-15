import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Rec_contrasena from "./pages/recuperar_contrasena"
import './App.css'
import {Route, Routes} from "react-router-dom";
import Encabezado from "./components/Encabezado.jsx"

function App() {

  return (
    <>
      <Encabezado />
      <div className="container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/recuperar_contrasena" element={<Rec_contrasena />} />
        </Routes>
      </div>
    </>
  );
}

export default App
