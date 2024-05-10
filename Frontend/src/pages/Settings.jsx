import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "../api/axios.jsx";
import { useNavigate } from "react-router-dom";


function Settings() {
  const { u_id, token, email } = useParams(); // Obtener los parámetros de la URL
  const navigate = useNavigate();
  const url =  import.meta.env.VITE_API_URL;

  const sendActivationEmail = () => {
    axios.post(`${url}/settings/${u_id}/${token}/${email}`)
      .then((res) => {
        //console.log("Correo de activación enviado:", res.data);
        Swal.fire({
          title: `<strong>${res.data.message}</strong>`,
          icon: "success",
          timer: 4000,
          confirmButtonColor: "#27ae60",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/login");
          } else if (result.isDenied) {
            navigate("/login");
          }
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "<strong>Error al enviar el correo de activación:</strong>",
          text: `${error}`,
          icon: "success",
          timer: 4000,
          confirmButtonColor: "#ff0000",
        });
      });
  };

  useEffect(() => {sendActivationEmail()}, [])

  return (
    <></>
  );
}

export default Settings;