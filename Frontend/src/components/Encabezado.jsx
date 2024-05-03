import React, { useState } from 'react';
import "./Encabezado.css";
import iconoImg from "../assets/logo.png";
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';

function Encabezado() {
  const cookies = new Cookies();
  const jwt = cookies.get("auth_token");

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUsuarioOpen, setMenuUsuarioOpen] = useState(false);
  const urlFront =  import.meta.env.VITE_FRONT_URL;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioOpen(!menuUsuarioOpen);
  };

  const handleLogout = () => {
    // Eliminar el token JWT
    cookies.remove('auth_token', { path: '/' });
    setTimeout(() => {
      window.location.href = `${urlFront}/login`;
    }, 500);
  };

  return (
    <div className="header">
      {/* Contenido para tamaños de pantalla más grandes */}
      <button className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </button>
      <Link to={"/"}>
      <div className="icon-header">
        <img
          src={iconoImg}
          alt="Icono de la página"
          style={{ width: "37px", height: "43px" }}
        />
        <div className="logo">FoodOverflow</div>
      </div>
      </Link>
      <div className="search">
        <input type="text" placeholder="Buscar" />
      </div>
      <div className="menu">
        <div className="menu-info">
        <Link to={"/"}>
        <button className="menu-button">
          <span className="spanHeader">Inicio</span>
        </button>
        </Link>
        <Link to={"/about"}>
        <button className="menu-button">
        <span className="spanHeader">Sobre nosotros</span>
        </button>
        </Link>
        <Link to={"/support"}>
        <button className="menu-button">
          <span className="spanHeader">Apóyanos</span>
        </button>
        </Link>
        <div className="separator"></div>
        </div>
        {/* Botones para tamaños de pantalla más pequeños */}
        {jwt ? (
          <>
            <Link to={"/crear_publicacion"}>
              <button className="menu-button2">
                <strong>Publicar</strong> 
              </button>
            </Link>
              <button className="menu-button3" onClick={toggleMenuUsuario}>
                <strong>Usuario</strong>
              </button>
          </>
        ) : (
          <>
            <Link to={"/login"}>
              <button className="menu-button2">
                <strong>Iniciar sesión</strong> 
              </button>
            </Link>
            <Link to={"/register"}>
              <button className="menu-button3">
                <strong>Registrarse</strong>
              </button>
            </Link>
          </>
        )}
      </div>
      
      {/* Menú de usuario */}
      {menuUsuarioOpen && (
        <div className="menu-usuario">
          <Link to={"/profile"}>
          <button className="menu-button-user" onClick={toggleMenuUsuario}>
            <span className="spanHeader">Configuración de la cuenta</span>
          </button>
          </Link>
          <Link to={"/user/profile"}>
          <button className="menu-button-user" onClick={toggleMenuUsuario}>
            <span className="spanHeader">Mi perfil</span>
          </button>
          </Link>
          <div className="separator-user-menu"></div>
          <button className="menu-button-user" onClick={handleLogout}>
            <span className="spanHeader">Cerrar sesión</span>
          </button>
        </div>
      )}

      {/* Tamaños de pantalla más pequeños */}
      {menuOpen && (
        <div className="menu-dropdown">
          <Link to={"/"}>
          <button className="menu-button">
            <center>
            <strong>Inicio</strong>
            </center>
          </button>
          </Link>
          <Link to={"/About"}>
          <button className="menu-button">
            <center>
            <strong>Sobre nosotros</strong>
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