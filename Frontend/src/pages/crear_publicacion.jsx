import { useRef, useState } from "react";
import axios from "axios";
import "./crear_publicacion.css";
import iconoImg from "../assets/logo.png";

import { Link, useNavigate } from "react-router-dom";

function Crear_publicacion() {
  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  
    const [state, setState] = useState({
      /*email: "",
      password: "",
      check_password: "",
      username: "",*/

      //configurar desde el backend
    });
  
    const handleInput = (event) => {
      setState({
        ...state,
        [event.target.name]: event.target.value,
      });
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
        //Validaciones necesarias para las publicaciones
      
      crear_publicacion();
    };
  
    const navigate = useNavigate();
  
    const crear_publicacion = () => {
      axios
        .post("http://127.0.0.1:8000/signup/", { //configurar el backend para crear la publicación
        /*
        email: state.email,
        username: state.username,
        password: state.password,
        check_password: state.check_password,
        */
        
        //configurar desde el backend
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
          <div className="form-container"> 
            <div className="publication-form"> 
              <h1>Crear publicación</h1>
              <h1
                ref={errRef}
                className={errMsg ? "errmsg li-h1-error " : "offscreen"}
                aria-live="assertive"
              >
                {errMsg}
              </h1>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="postType">¿Qué quieres publicar?</label>
                  <select
                    id="postType"
                    name="postType"
                    value={state.postType}
                    onChange={handleInput}
                  >
                    <option value="Receta">Receta</option>
                    <option value="Publicación">Pregunta</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="title">Título</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Ingresa el título de tu publicación"
                    value={state.title}
                    onChange={handleInput}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="content">Contenido</label>
                  <textarea
                    id="content"
                    name="content"
                    placeholder="Escribe el contenido de tu publicación"
                    value={state.content}
                    onChange={handleInput}
                    style={{ height: "150px" }}
                  />
                </div>
                <button type="submit" className="register-button center-button">
                  Publicar
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    
export default Crear_publicacion;