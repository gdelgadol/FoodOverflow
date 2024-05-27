import axios from 'axios';
import Cookies from 'universal-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import './PagoPendiente.css';
import React, { useEffect, useState, useRef } from 'react';

function PendingPayment() {
  const url =  import.meta.env.VITE_API_URL;
  const [userInfo, setUserInfo] = useState({
    username: ''
  });
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

  return (
    <div className="pending-page">
      <div className="pending-container">
        <h1 className="pending-title">Pago Pendiente</h1>
        <p className="pending-message">
          Hola <strong>{userInfo.username}</strong>, tu pago está pendiente.<br />
          Por favor, revisa tu correo electrónico para más información.<br />
          ¡Gracias por tu apoyo a Food Overflow!
        </p>
      </div>
    </div>
  );
}

export default PendingPayment;