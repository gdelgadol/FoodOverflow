import "./Encabezado.css";
import iconoImg from "../assets/logo.png";

function Encabezado() {
  return (
    <div className="header">
      <div className="icon-header">
        <img
          src={iconoImg}
          alt="Icono de la página"
          style={{ width: "37px", height: "43px" }}
        />
        <div className="logo">Food Overflow</div>
      </div>

      <div className="search">
        <input type="text" placeholder="Buscar..." />
      </div>
      <div className="menu">
        <button className="menu-button">
          <h1>Sobre nosotros</h1>
        </button>
        <button className="menu-button">
          <strong>Contáctenos</strong>
        </button>
        <button className="menu-button">
          <strong>Apóyanos</strong>
        </button>
        <div className="separator"></div>
        <button className="menu-button2">
          <strong>Iniciar sesión</strong>
        </button>
        <button className="menu-button3">
          <strong>Registrarse</strong>
        </button>
      </div>
    </div>
  );
}

export default Encabezado;
