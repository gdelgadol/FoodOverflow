import React, { useState } from 'react';
import "./Encabezado.css";
import iconoImg from "../assets/logo.png";
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';

function Encabezado() {
  const cookies = new Cookies();
  const jwt = cookies.get("auth_token");

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Eliminar el token JWT
    cookies.remove('auth_token');
    window.location.href = "http://localhost:5173/Login";
  };

  return (
    <div className="header">
      {/* Contenido para tamaños de pantalla más grandes */}
      <Link to={"/"}>
      <div className="icon-header">
        <img
          src={iconoImg}
          alt="Icono de la página"
          style={{ width: "37px", height: "43px" }}
        />
        <div className="logo">Food Overflow</div>
      </div>
      </Link>
      <div className="search">
        <input type="text" placeholder="Buscar" />
      </div>
      <div className="menu">
        <Link to={"/About"}>
        <button className="menu-button">
        <span className="spanHeader">Sobre nosótros</span>
        </button>
        </Link>
        <Link to={"/Contact"}>
        <button className="menu-button">
          <span className="spanHeader">Contáctenos</span>
        </button>
        </Link>
        <Link to={"/Apoyanos"}>
        <button className="menu-button">
          <span className="spanHeader">Apóyanos</span>
        </button>
        </Link>
        <div className="separator"></div>
        {/* Botones para tamaños de pantalla más pequeños */}
        {jwt ? (
          <>
            <Link to={"/crear_publicacion"}>
              <button className="menu-button2">
                <strong>Crear</strong> 
              </button>
            </Link>
            <Link to={"/Profile"}>
              <button className="menu-button3">
                <strong>Usuario</strong>
              </button>
            </Link>
            <button className="menu-button2" onClick={handleLogout}>
              <strong>Cerrar sesión</strong>
            </button>
          </>
        ) : (
          <>
            <Link to={"/Login"}>
              <button className="menu-button2">
                <strong>Iniciar sesión</strong> 
              </button>
            </Link>
            <Link to={"/Register"}>
              <button className="menu-button3">
                <strong>Registrarse</strong>
              </button>
            </Link>
          </>
        )}
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
            {jwt ? (
            <>
              <Link to={"/crear_publicacion"}>
                <button className="menu-button2">
                  <center>
                  <strong>Crear</strong>
                  </center>
                </button>
              </Link>
              <Link to={"/Home"}>
                <button className="menu-button3">
                  <center>
                  <strong>Usuario</strong>
                  </center>
                </button>
              </Link>
            </>
          ) : (
            <>
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
            </>
          )}
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