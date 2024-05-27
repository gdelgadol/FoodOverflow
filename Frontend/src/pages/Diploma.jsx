import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import './Diploma.css';
import jsPDF from 'jspdf';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Link } from "react-router-dom";
import iconoBlanco from "../assets/logo-blanco.png";
import iconoImg from "../assets/logo.png";
import { PiSignatureThin } from "react-icons/pi";

function Diploma() {
  const url =  import.meta.env.VITE_API_URL;
  const [userInfo, setUserInfo] = useState({
    username: ''
  });

  const diplomaRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    axios
      .post(`${url}/get_user/profile`, {
        jwt: jwt,
      })
      .then((res) => {
        setUserInfo({
          username: res.data.username,
        });
      })
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      });
  }, []);

  const downloadPDF = () => {
    const input = diplomaRef.current;

    html2canvas(input, { scale: 3 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [841.89, 595.28], 
        });
        const imgProps = pdf.getImageProperties(imgData);

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pdfWidth * 0.75;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        const marginLeft = (pdfWidth - imgWidth) / 2;

        pdf.addImage(imgData, 'PNG', marginLeft, 20, imgWidth, imgHeight);
        pdf.save('diploma.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');

  return (
    <div className="diploma-page">
      {status === 'approved' ? (
        <>
          <div ref={diplomaRef} className="diploma-container">
          <div className="icon">
          <img
            src={iconoImg}
            alt="Icono de la página"
            style={{ width: "65px", height: "75px" }}
          />
        </div>
            <h1 className="diploma-title">Diploma de Donación</h1>
            <hr className="separator2" /> 
            <div className="diploma-content">
            <center>
              <h1>¡Felicidades, <strong>{userInfo.username}</strong>!</h1>
              <p>Por tu generosa contribución, ahora oficialmente eres donador/a de Food Overflow.</p>
              <br></br>
              <PiSignatureThin size={90}/>
              <br></br>
              <span className='ceo'>CEO de Food Overflow</span>
            </center>
            </div>
          </div>
          <center>
          <button className="diploma-button" onClick={downloadPDF}>Descargar Diploma</button>
          </center>
        </>
      ) : (
                <div className="not-found-container">
                            <div>
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
      )}
    </div>
  );
}

export default Diploma;
