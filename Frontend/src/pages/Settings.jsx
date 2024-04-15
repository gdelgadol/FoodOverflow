import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "../api/axios.jsx";
import { useNavigate } from "react-router-dom";


function Settings() {
  const { u_id, token, email } = useParams(); // Obtener los parámetros de la URL
  const navigate = useNavigate();

  const sendActivationEmail = () => {
    axios.post(`http://127.0.0.1:8000/settings/${u_id}/${token}/${email}`)
      .then((res) => {
        //console.log("Correo de activación enviado:", res.data);
        navigate("/login");
        alert(res.data.message);
      })
      .catch((error) => {
        alert("Error al enviar el correo de activación:", error);
      });
  };

  useEffect(() => {sendActivationEmail()}, [])

  return (
    <></>
  );
}

export default Settings;