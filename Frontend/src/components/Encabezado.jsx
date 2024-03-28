import React, { useState } from 'react';
import "./Encabezado.css";
import iconoImg from "../assets/logo.png";
import { Link } from "react-router-dom";

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
        <Link to={"/About"}>
        <button className="menu-button">
        <strong>Sobre nosótros</strong>
        </button>
        </Link>
        <Link to={"/Contact"}>
        <button className="menu-button">
          <strong>Contáctenos</strong>
        </button>
        </Link>
        <Link to={"/Apoyanos"}>
        <button className="menu-button">
          <strong>Apóyanos</strong>
        </button>
        </Link>
        {/* Botones para tamaños de pantalla más pequeños */}
        <Link to={"/"}>
        <button className="menu-button2" >
          <strong>Iniciar sesión</strong> 
        </button>
        </Link>
        <Link to={"/Register"}>
        <button className="menu-button3">
          <strong>Registrarse</strong>
        </button>
        </Link>
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
          <Link to={"/"}>
          <button className="menu-button2">
            <center>
            <strong>Iniciar sesión</strong>
            </center>
          </button>
          </Link>
          <Link to={"/Register"}>
          <button className="menu-button3">
            <center>
            <strong>Registrarse</strong>
            </center>
          </button>
          </Link>
          <Link to={"/About"}>
          <button className="menu-button">
            <center>
            <strong>Sobre nosótros</strong>
            </center>
          </button>
          </Link>
          <Link to={"/Contact"}>
          <button className="menu-button">
            <center>
            <strong>Contáctenos</strong>
            </center>
          </button>
          </Link>
          <Link to={"/Apoyanos"}>
          <button className="menu-button">
            <center>
            <strong>Apóyanos</strong>
            </center>
          </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Encabezado;