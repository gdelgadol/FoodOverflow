import { useState } from "react";
import "./Register.css";
import "./Change_email.css";
import iconoImg from "../assets/logo.png";
import { Link } from "react-router-dom";
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import Swal from 'sweetalert2';

function Change_email() {
  const [formData, setFormData] = useState({
    password: "",
    newEmail: "",
  });
  const url =  import.meta.env.VITE_API_URL;
  const urlFront =  import.meta.env.VITE_FRONT_URL;

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    axios
      .post(`${url}/update_email/`, {
        jwt: jwt,
        password: formData.password,
        new_email: formData.newEmail,
      })
      .then((res) => {
        if (res.data.type === "SUCCESS") {
          cookies.remove("auth_token");
          Swal.fire({
            title: `<strong>${res.data.message} Inicia sesión nuevamente.</strong>`,
            icon: "success",
            confirmButtonColor: "#27ae60",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = `${urlFront}/login`;
            } else if (result.isDenied) {
              window.location.href = `${urlFront}/login`;
            }
          });

          // Swal.fire({
          //   title: `<strong>${res.data.message} Inicia sesión nuevamente.</strong>`,
          //   icon: "success",
          //   timer: 4000,
          //   confirmButtonColor: "#27ae60",
          // });
          // //sendActivationEmail(formData.newEmail);
          // cookies.remove("auth_token");
          // window.location.href = `${urlFront}/login`;
        } else {
          Swal.fire({
            title: `<strong>${res.data.message}</strong>`,
            icon: "error",
            timer: 4000,
            confirmButtonColor: "#ff0000",
          });
        }
      })
      .catch((error) => {
        console.error("Error al cambiar el correo electrónico:", error);
      });
  };


  return (
    <div className="register">
      <div className="form">
        <div className="icon">
          <img
            src={iconoImg}
            alt="Icono de la página"
            style={{ width: "45px", height: "50px" }}
          />
        </div>
        <h1>Cambiar correo electrónico</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Contraseña actual</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Introduce tu contraseña actual"
              required
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="newEmail">Nuevo correo electrónico</label>
            <input
              type="email"
              id="newEmail"
              name="newEmail"
              placeholder="Introduce tu nuevo correo electrónico"
              required
              onChange={handleInput}
            />
          </div>
          <p className="note">
            Debe contener un formato de email válido.
          </p>
          <br></br>
          <button type="submit" className="register-button center-button">
            <strong>Cambiar correo</strong>
          </button>
        </form>
        <center>
          <p className="loginRegister">
            ¿Deseas volver a los datos de usuario? <Link to={"/profile"}>Perfil</Link>
          </p>
        </center>
      </div>
    </div>
  );
}

export default Change_email;