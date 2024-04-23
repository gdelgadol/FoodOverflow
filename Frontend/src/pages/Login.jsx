import { useRef, useState, useEffect } from "react";
import "./Login.css";
import imagen from "../assets/logo.png";
import eyeOpenIcon from "../assets/ojo.png";
import axios from "../api/axios.jsx";
import Cookies from "universal-cookie";

import { Link, useNavigate } from "react-router-dom";

const Login = () => {

  // Initialize cookies
  const url =  import.meta.env.VITE_API_URL;
  const urlFront =  import.meta.env.VITE_FRONT_URL;

  const login_cookie = new Cookies(null, {path: "/"});

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

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [opacity, setOpacity] = useState(0.5);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

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

  const handleInputChangePwd = (e) => {
    setState({
      ...state,
      password: e.target.value,
    });
    if (e.target.value.trim() !== "") {
      labelPwdRef.current.classList.add("active");
    } else {
      labelPwdRef.current.classList.remove("active");
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
    login();
  };
  
  const navigate = useNavigate();
  const login = () => {
    axios
      .post(`${url}/login/`, {
        email: state.email,
        password: state.password,
      })
      .then((res) => {
        if (res.data.message === "¡Login exitoso!") {
          const jwt_token = res.data.jwt;

          //Creating cookie
          login_cookie.set("auth_token", jwt_token);

          alert("Inicio exitoso!");
          window.location.href = `${urlFront}/`;
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
            <h1 className="li-h1">¡Bienvenido de vuelta!</h1>
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
              <div className="password-container">
                <label
                  ref={labelPwdRef}
                  className={`li-label ${state.password ? "active" : ""}`}
                  htmlFor="li-input"
                >
                  Contraseña
                </label>
                <input
                  className="li-input"
                  type={isPasswordVisible ? "text" : "password"}
                  id="password"
                  onChange={handleInputChangePwd}
                  value={state.password}
                />
                <button
                  type="button"
                  className={`li-eyeButton ${
                    isPasswordVisible ? "active" : ""
                  }`}
                  onClick={togglePasswordVisibility}
                >
                  <img
                    className="li-eye"
                    src={eyeOpenIcon}
                    style={{ opacity }}
                    alt="Show or hide password"
                    aria-label="Show or hide password"
                    onClick={handleClick}
                  />
                </button>
              </div>
              <button className="li-button">Iniciar Sesión</button>
            </form>
            <div className="li-div-text">
              <p className="li-p">
                <span>
                  <Link to={"/recuperar_contrasena"}>
                    ¿Has olvidado tu contraseña?
                  </Link>
                </span>
                <br></br>
                <br></br>
                  ¿Es tu primera vez en Food Overflow?
                  <span>
                    <Link to={"/register"}> Registrate</Link>
                  </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;