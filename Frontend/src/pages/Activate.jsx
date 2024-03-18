import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "../api/axios.jsx";
import { useNavigate } from "react-router-dom";
function Activate() {
  const { uid, token } = useParams(); // Obtener los parámetros de la URL
  const navigate = useNavigate();

  const activate = () => {
    axios
      .post(`http://127.0.0.1:8000/activate/${uid}/${token}`, {
      })
      .then((res) => {
          navigate("/");
          alert(res.data.message);
      });
  };

  useEffect(() => {activate()}, [])

  return (
    <></>
  );
}

export default Activate;