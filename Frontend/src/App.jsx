import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Rec_contrasena from "./pages/recuperar_contrasena"
import Restablecer_contrasena from "./pages/restablecer_contrasena"
import Activate from "./pages/Activate"
import Crear_publicacion from "./pages/crear_publicacion"
import Profile from "./pages/Profile"
import './App.css'
import {Routes, Route} from "react-router-dom";
import Encabezado from "./components/Encabezado.jsx"
import Footer from "./components/Footer.jsx"
import PrivateRoute from "./utils/PrivateRoute"
import DetallesPublicacion from "./pages/DetallesPublicacion"
import AboutUs from "./pages/AboutUs.jsx"

function App() {
  return (
    <div className="app-body">
      <Encabezado />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/activate/:uid/:token" element={<Activate />} />
          <Route path="/recuperar_contrasena" element={<Rec_contrasena />} />
          <Route path="/restablecer_contrasena/:uid/:token/" element={<Restablecer_contrasena />} />
          <Route path="/post/:id" element={<DetallesPublicacion />}/>
          <Route element={<PrivateRoute />}>
            <Route path="/crear_publicacion" element={<Crear_publicacion />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="/about" element={<AboutUs />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App
