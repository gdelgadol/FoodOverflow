import React from "react";
import { Link } from "react-router-dom";
import iconoBlanco from "../assets/logo-blanco.png";
import './NotFound.css'; // Importa los estilos específicos para NotFound

const NotFound = () => {
  return (
    <div className="not-found-container">
                <div>
          {/* Puedes ajustar el tamaño de tu imagen según sea necesario */}
          <img
            alt="Logo de Food Overflow"
            src={iconoBlanco}
            className="not-found-logo-food"
            style={{ width: '70px', height: 'auto' }} 
          />
        </div>
      <div className="not-found-message">

        <div className="not-found-text">
        <center>
          <span className="not-found-title">
            ¡Oops! Página no encontrada
          </span>
        </center>
        <center>
            <span className="error-number"> 
            Código de error: 404
          </span>
          </center>
          <br />
          <center>
          <span className="sub-title">
            Parece que la página que estás buscando no existe en Food Overflow
          </span>
          </center>
        </div>
      </div>
      <div className="not-found-actions">
        <Link to="/forum">
          <button className="not-found-home-button">Volver a la página del foro</button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
