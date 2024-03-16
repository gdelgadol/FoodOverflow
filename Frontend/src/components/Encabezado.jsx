import React, { useState } from 'react';
import "./Encabezado.css";
import iconoImg from "../assets/logo.png";

function Encabezado() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
        {/* Botones para tamaños de pantalla más pequeños */}
        <button className="menu-button2">
          <strong>Iniciar sesión</strong>
        </button>
        <button className="menu-button3">
          <strong>Registrarse</strong>
        </button>
      </div>

      {/* Hamburguesa */}
      <button className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </button>

      {/* Tamaños de pantalla más pequeños */}
      {menuOpen && (
        <div className="menu-dropdown">
          <div className="search">
            <input type="text" placeholder="Buscar..." />
          </div>
          <button className="menu-button2">
            <center>
            <strong>Iniciar sesión</strong>
            </center>
          </button>
          <button className="menu-button3">
            <center>
            <strong>Registrarse</strong>
            </center>
          </button>
          <button className="menu-button">
            <center>
            <strong>Sobre nosótros</strong>
            </center>
          </button>
          <button className="menu-button">
            <center>
            <strong>Contáctenos</strong>
            </center>
          </button>
          <button className="menu-button">
            <center>
            <strong>Apóyanos</strong>
            </center>
          </button>
        </div>
      )}
    </div>
  );
}

export default Encabezado;