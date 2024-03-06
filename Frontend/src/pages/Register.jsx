import { useState } from 'react';
import axios from 'axios';
import './Register.css';
import iconoImg from "../assets/logo.png";

/* Toda esta función es generada por chat gpt, para ver como conectamos eso con el back*/
function Register() {

  const [state, setState] = useState({
    email: "",
    password: "",
    check_password: "",
    username: ""
  });

  const handleInput = (event) => {
      
    setState({
      ...state,
      [event.target.name]: event.target.value
     });

  }

  const handleSubmit = (event) => {
    event.preventDefault();

    register();
  };

  const register = () => {
    axios
      .post("http://127.0.0.1:8000/signup/", {
        email: state.email,
        username: state.username,
        password: state.password,
        check_password: state.check_password
      })
      .then((res) => {
        if (res.data.message === "¡Usuario creado con éxito!") {
          console.log(state.email,state.username,state.password);
        } else {
          console.log(state.email);
        }
      });
  };

  return (
    <div className="register">
      <div className="form">
        <div className="icon">
        <img src={iconoImg} alt="Icono de la página" style={{ width: '45px', height: '50px' }} />
        </div>
        <h1>Únete a Food Overflow hoy</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" placeholder="Ingresa tu email" required onChange={handleInput}/>
          </div>
          <div className="input-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input type="text" id="username" name="username" placeholder="Crea tu nombre de usuario" required onChange={handleInput}/>
          </div>
          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" placeholder="Crea tu contraseña" required onChange={handleInput}/>
          </div>
          <div className="input-group">
            <label htmlFor="confirm">Confirmar contraseña</label>
            <input type="password" id="check_password" name="check_password" placeholder="Confirma tu contraseña" required onChange={handleInput}/>
          </div>
          <p className="note">Debe contener 8+ caracteres, incluyendo al menos 1 letra y 1 número.</p>
          <br></br>
          <button type="submit" className="register-button center-button">Registrarse</button>
        </form>
        <p className="loginRegister">Al hacer clic en Registrarse, aceptas nuestro <a href="#">Acuerdo del usuario</a> y confirmas que has entendido la Política de privacidad.</p>
        <p className="loginRegister">¿Ya tienes una cuenta? <a href="#">Inicia sesión</a></p>
      </div>
    </div>
  );
}

export default Register;