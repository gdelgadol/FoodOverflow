import React, {useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios from "../api/axios.jsx";
import Swal from 'sweetalert2';
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
        if(res.data.type === "SUCCESS"){
          Swal.fire({
            title: `<strong>${res.data.message}</strong>`,
            icon: "success",
            confirmButtonColor: "#27ae60",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            } else if (result.isDenied) {
              navigate("/login");
            }
          });
        }else if(res.data.type === "ERROR")
          Swal.fire({
            title: `<strong>${res.data.message}</strong>`,
            icon: "error",
            confirmButtonColor: "#ff0000",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/login");
            } else if (result.isDenied) {
              navigate("/login");
            }
          });
      });
  };

  useEffect(() => {activate()}, [])

  return (
    <></>
  );
}

export default Activate;