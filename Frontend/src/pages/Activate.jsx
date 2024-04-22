import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "../api/axios.jsx";
import { useNavigate } from "react-router-dom";
function Activate() {
  const { uid, token } = useParams(); // Obtener los parámetros de la URL
  const navigate = useNavigate();
  const url =  import.meta.env.VITE_API_URL;

  const activate = () => {
    axios
      .post(`${url}/activate/${uid}/${token}`, {
      })
      .then((res) => {
          navigate("/login");
          alert(res.data.message);
      });
  };

  useEffect(() => {activate()}, [])

  return (
    <></>
  );
}

export default Activate;