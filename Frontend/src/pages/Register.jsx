import { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Register.css";
import iconoImg from "../assets/logo.png";
import Swal from 'sweetalert2';
import { Link, useNavigate } from "react-router-dom";

/* Toda esta función es generada por chat gpt, para ver como conectamos eso con el back*/
function Register() {
  const [errMsg, setErrMsg] = useState("");
  const [avatars, setAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const errRef = useRef();

  const [state, setState] = useState({
    email: "",
    password: "",
    description: "",
    check_password: "",
    username: "",
  });
  const url =  import.meta.env.VITE_API_URL;

  const handleInput = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Verificar que la descripción no consista únicamente de espacios
    const descriptionTrimmed = state.description.trim();
    const descriptionToSend = descriptionTrimmed === '' ? null : descriptionTrimmed;

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

    // Verificar si el campo de correo electrónico es válido
    const isValidEmail = /\S+@\S+\.\S+/.test(state.email);
      if (!isValidEmail) {
        setErrMsg("Ingrese un correo válido.");
        return;
        }

    // Si la validación pasa, puedes enviar el formulario o hacer lo que necesites aquí
    console.log("Contraseña válida");
    register(descriptionToSend);
  };

  const navigate = useNavigate();

  const register = (description) => {
    axios
      .post(`${url}/signup/`, {
        email: state.email,
        username: state.username,
        description: description,
        avatar_id: selectedAvatar,
        password: state.password,
        check_password: state.check_password,
      })
      .then((res) => {
        if (res.data.type === "SUCCESS") {
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
        } else {
          Swal.fire({
            title: `<strong>${res.data.message}</strong>`,
            icon: "error",
            timer: 4000,
            confirmButtonColor: "#ff0000",
          });
        }
      });
  };

  useEffect(() => {
    axios.post(`${url}/get_avatars`, {
    })
    .then((res) => {
      setAvatars(res.data.avatars);
      console.log(res.data.avatars);
    })
    .catch((err) => {
      console.error("Error al obtener los avatares:", err);
    })
  }, [])

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
        <h1 className="rt-h1">Únete a Food Overflow hoy</h1>
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
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
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
              onKeyDown={(e) => {
                if (e.key === ' ') e.preventDefault();
              }}
              onChange={handleInput}
            />
          </div>
          <div className="input-group">
            <label htmlFor="description">Descripción (Opcional)</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Ingresa una descripción sobre ti"
              onChange={handleInput}
            />
          </div>
          <div className="avatar-container">
            <p>Selecciona un avatar: (Opcional)</p>
            <div className="avatars">
              {avatars.map(avatar => (
                <img
                  key={avatar.avatar_id}
                  src={avatar.avatar_url}
                  alt="Avatar"
                  className={selectedAvatar === avatar.avatar_id ? "selected" : ""}
                  onClick={() => setSelectedAvatar(avatar.avatar_id)}
                />
              ))}
            </div>
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
          ¿Ya tienes una cuenta? <Link to={"/login"}>Inicia sesión</Link>
        </p>
        </center>
      </div>
    </div>
  );
}

export default Register;
