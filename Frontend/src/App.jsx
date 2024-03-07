import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
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
        </Routes>
      </div>
    </>
  );
}

export default App
