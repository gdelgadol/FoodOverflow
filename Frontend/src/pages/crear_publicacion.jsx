import { useRef, useState } from "react";
import axios from "axios";
import "./crear_publicacion.css";
import Cookies from "universal-cookie";
import iconoImg from "../assets/logo.png";

import { Link, useNavigate } from "react-router-dom";

function Crear_publicacion() {
  // Initialize cookies
  const cookies = new Cookies();
  const jwt = cookies.get("auth_token");

  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  
    const [state, setState] = useState({
      title: "",
      content: "",
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
      if(jwt){ 
        axios
          .post("http://127.0.0.1:8000/crear_publicacion/", {
            title: state.title,
            content: state.content,
            jwt: jwt,
        })
        .then((res) => {
          if (res.data.type === "SUCCESS") {
            alert(res.data.message);
            navigate("/");
          } else {
            alert(res.data.message);
          }
        });
      }
      else{
        alert("Usuario no ha iniciado sesión");
      }
    }

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
                {/* <div className="input-group">
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
                </div> */}
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