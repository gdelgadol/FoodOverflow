import { useState } from "react";
import "./Register.css";
import "./Change_email.css";
import iconoImg from "../assets/logo.png";
import { Link } from "react-router-dom";
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';

function Change_email() {
  const [formData, setFormData] = useState({
    password: "",
    newEmail: "",
  });

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    axios
      .post("http://127.0.0.1:8000/update_email/", {
        jwt: jwt,
        password: formData.password,
        new_email: formData.newEmail,
      })
      .then((res) => {
        if (res.data.type === "SUCCESS") {
          alert(res.data.message + " Inicia sesión nuevamente");
          sendActivationEmail(formData.newEmail);
          cookies.remove("auth_token");
          window.location.href = "http://localhost:5173/login";
        } else {
          alert(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error al cambiar el correo electrónico:", error);
      });
  };

  const sendActivationEmail = (email) => {
    axios.post("http://127.0.0.1:8000/settings/u_id/token/email", { email })
      .then((res) => {
        console.log("Correo de activación enviado:", res.data);
      })
      .catch((error) => {
        console.error("Error al enviar el correo de activación:", error);
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
            Debe contener 8+ caracteres, incluyendo al menos 1 letra y 1 número.
          </p>
          <br></br>
          <button type="submit" className="register-button center-button">
            <strong>Cambiar correo</strong>
          </button>
        </form>
        <center>
          <p className="loginRegister">
            ¿Deseas volver a los datos de usuario <Link to={"/profile"}>Perfil</Link>
          </p>
        </center>
      </div>
    </div>
  );
}

export default Change_email;
