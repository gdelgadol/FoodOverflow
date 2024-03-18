import { useRef, useState } from "react";
import axios from "axios";
import "./Register.css";
import iconoImg from "../assets/logo.png";

import { Link, useNavigate } from "react-router-dom";

/* Toda esta función es generada por chat gpt, para ver como conectamos eso con el back*/
function Register() {
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();

  const [state, setState] = useState({
    email: "",
    password: "",
    check_password: "",
    username: "",
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
    register();
  };

  const navigate = useNavigate();

  const register = () => {
    axios
      .post("http://127.0.0.1:8000/signup/", {
        email: state.email,
        username: state.username,
        password: state.password,
        check_password: state.check_password,
      })
      .then((res) => {
        if (res.data.type === "SUCCESS") {
          alert(res.data.message);
          navigate("/");
        } else {
          alert(res.data.message);
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
        <h1>Únete a Food Overflow hoy</h1>
        <h1
          ref={errRef}
          className={errMsg ? "errmsg li-h1-error " : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Ingresa tu email"
              required
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Crea tu nombre de usuario"
              required
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Crea tu contraseña"
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
            Registrarse
          </button>
        </form>
        <p className="loginRegister">
          Al hacer clic en Registrarse, aceptas nuestro{" "}
          <Link to={"/Acuerdo"}>Acuerdo del usuario</Link> y confirmas que has
          entendido la Política de privacidad.
        </p>
        <center>
        <p className="loginRegister">
          ¿Ya tienes una cuenta? <Link to={"/"}>Inicia sesión</Link>
        </p>
        </center>
      </div>
    </div>
  );
}

export default Register;
