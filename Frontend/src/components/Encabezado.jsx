import React from 'react';
import "./Encabezado.css";
import iconoImg from "../assets/logo.png";

function Encabezado() {
  return (
    <div className="header">
      {/* Contenido para tamaños de pantalla más grandes */}
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
        <strong>Sobre nosótros</strong>
        </button>
        <button className="menu-button">
          <strong>Contáctenos</strong>
        </button>
        <button className="menu-button">
          <strong>Apóyanos</strong>
        </button>
      </div>

      {/* Contenido adicional para tamaños de pantalla más pequeños */}
      <div className="additional-content-for-small-screens">
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
