import { useRef, useState, useEffect } from "react";
import "./recuperar_contrasena.css";
import imagen from "../assets/logo.png";
import eyeOpenIcon from "../assets/ojo.png";
import axios from "../api/axios.jsx";

import { Link, useNavigate } from "react-router-dom";

const Rec_contrasena = () => {
  const userRef = useRef();
  const errRef = useRef();
  const labelUserRef = useRef();
  const labelPwdRef = useRef();

  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const [errMsg, setErrMsg] = useState("");
  const { success, setSuccess } = useState(false);

  const handleClick = () => {
    setOpacity((prevOpacity) => (prevOpacity === 1 ? 0.5 : 1));
  };

  useEffect(() => {
    userRef.current.focus();
  }, []);

  const handleInputChangeUser = (e) => {
    setState({
      ...state,
      email: e.target.value,
    });
    if (e.target.value.trim() !== "") {
      labelUserRef.current.classList.add("active");
    } else {
      labelUserRef.current.classList.remove("active");
    }
  };


  const validation = (values) => {
    let error = {};
    error.email = "";
    error.password = "";

    // Expresión regular para validar el correo electrónico
    let emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(state.email)) {
      error.email = "El correo electrónico no es válido.";
    }

    // La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número

    if (!state.password.trim()) {
      error.password = "la contraseña no puede ser vacia.";
    }
    return error;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    reset();
  };

  const navigate = useNavigate();
  const reset = () => {
    axios
      .post("http://127.0.0.1:8000/password_reset/", {
        email: state.email,
      })
      .then((res) => {
        if (res.data.message === "Correo enviado") { //mensaje que va a llegar desde el backend
          alert("¡Se ha enviado el email exitosamente! Revisa tu bandeja de entrada, también tu bandeja de spam");
          navigate("/");
        } else {
          setErrMsg(res.data.message);
        }
      });
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Login Success</h1>
          <br />
          <p>
            <a href="#">Go To Home</a>
          </p>
        </section>
      ) : (
        <div className="login">
          <div className="li-form">
            <div className="li-div-centered">
              <img
                className="li-logo"
                alt="Logo de Food Overflow"
                src={imagen}
              />
            </div>
            <h1 className="li-h1">Reestablece tu contraseña</h1>
            <p className="note">Introduce tu dirección de correo electrónico y te enviaremos un enlace de restablecimiento de tu contraseña.</p>
            <h1
              ref={errRef}
              className={errMsg ? "errmsg li-h1-error " : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </h1>
            <form onSubmit={handleSubmit}>
              <div style={{ position: "relative" }}>
                <label
                  ref={labelUserRef}
                  className={`li-label ${state.email ? "active" : ""}`}
                  htmlFor="li-input"
                >
                  Email
                </label>
                <input
                  className="li-input"
                  type="email"
                  id="email"
                  ref={userRef}
                  autoComplete="off"
                  onChange={handleInputChangeUser}
                  value={state.email}
                  required
                />
              </div>
              <button className="li-button">Enviar correo para reestablecer contraseña</button>
            </form>
            <div className="li-div-text">
              <p className="li-p">
                <center>
                <span>
                  <Link to={"/login"}>
                    Volver al inicio de sesión
                  </Link>
                </span>
                </center>
                <p className="li-p">
                <center>
                  ¿Es tu primera vez en Food Overflow?
                  <span>
                    <Link to={"/register"}> Registrate</Link>
                  </span>
                </center>
                </p>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Rec_contrasena;
