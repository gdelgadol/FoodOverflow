import { useRef, useState } from "react";
import axios from "axios";
import "./Register.css";
import "./restablecer_contrasena.css";
import iconoImg from "../assets/logo.png";

import { Link, useNavigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

/* Toda esta función es generada por chat gpt, para ver como conectamos eso con el back*/
function Restablecer_contrasena() {
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const { uid, token } = useParams();
  const url =  import.meta.env.VITE_API_URL;

  const [state, setState] = useState({
    password: "",
    check_password: "",
  });

  const handleInput = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar que la contraseña tenga al menos 8 caracteres, una letra y un número
    const regexLetter = /[a-zA-Z]/;
    const regexNumber = /[0-9]/;
    if (
      state.password.length < 8 ||
      !regexLetter.test(state.password) ||
      !regexNumber.test(state.password)
    ) {
      setErrMsg(
        "La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra y un número."
      );
      return;
    }

    // Verificar que las contraseñas coincidan
    if (state.password !== state.check_password) {
      setErrMsg("Las contraseñas no coinciden.");
      return;
    }

    // Si la validación pasa, puedes enviar el formulario o hacer lo que necesites aquí
    console.log("Contraseña válida");
    resetPass();
  };

  const navigate = useNavigate();

  const resetPass = () => {
    axios
      .post(`${url}/restablecer_contrasena/${uid}/${token}`, {
        password: state.password,
      })
      .then((res) => {
        if (res.data.message === "Contraseña reseteada") { //desde el back se configura este mensaje
          alert("¡Contraseña restablecida con exito! Puedes volver a iniciar sesión.");
          navigate("/login");
        } else {
          alert("No se pudo restablecer tu contraseña. Por favor intentalo de nuevo.");
        }
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
        <h1>Crea tu nueva contraseña</h1>
        <h1
          ref={errRef}
          className={errMsg ? "errmsg li-h1-error " : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password">Nueva contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Crea tu nueva contraseña"
              required
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirm">Confirmar contraseña</label>
            <input
              type="password"
              id="check_password"
              name="check_password"
              placeholder="Confirma tu contraseña"
              required
              onChange={handleInput}
            />
          </div>
          <p className="note">
            Debe contener 8+ caracteres, incluyendo al menos 1 letra y 1 número.
          </p>
          <br></br>
          <button type="submit" className="register-button center-button">
            <strong>Cambiar contraseña</strong>
          </button>
        </form>
        <center>
        <p className="loginRegister">
          ¿Deseas volver al inicio de sesión? <Link to={"/"}>Inicia sesión</Link>
        </p>
        </center>
      </div>
    </div>
  );
}

export default Restablecer_contrasena;
