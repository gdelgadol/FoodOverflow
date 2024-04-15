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
    postType: "", // Agregamos el estado para el tipo de publicación
    ingredients: [], // Estado para almacenar los ingredientes de la receta
  });
  
  const handleInput = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleIngredientChange = (index, event) => {
    const newIngredients = [...state.ingredients];
    newIngredients[index][event.target.name] = event.target.value;
    setState({
      ...state,
      ingredients: newIngredients,
    });
  };

  const handleAddIngredient = () => {
    setState({
      ...state,
      ingredients: [...state.ingredients, { name: "", quantity: "" }],
    });
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...state.ingredients];
    newIngredients.splice(index, 1); // Elimina el ingrediente en el índice dado
    setState({
      ...state,
      ingredients: newIngredients,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validaciones necesarias para las publicaciones
    crear_publicacion();
  };
  
  const navigate = useNavigate();
  
  const crear_publicacion = () => {
    if (jwt) { 
      axios
        .post("http://127.0.0.1:8000/crear_publicacion/", {
          title: state.title,
          content: state.content,
          //postType: state.postType, 
          //ingredients: state.ingredients, 
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
    } else {
      alert("Usuario no ha iniciado sesión");
    }
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
                <option value="">Seleccionar opción</option>
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

            {state.postType === "Receta" && (
              <div className="input-group">
                <label htmlFor="postType">Ingredientes</label>
                {state.ingredients.map((ingredient, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre del ingrediente"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, e)}
                    />
                    <input
                      type="text"
                      name="quantity"
                      placeholder="Cantidad del ingrediente"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, e)}
                    />
                    <button className="chao" type="button" onClick={() => handleRemoveIngredient(index)}>
                      Eliminar ingrediente
                    </button>
                  </div>
                ))}
                <br></br>
                <button className="register-button center-button" type="button" onClick={handleAddIngredient}>
                  Agregar otro ingrediente
                </button>
              </div>
            )}

            <div className="input-group">
              <label htmlFor="content">
                {state.postType === "Receta" ? "Descripción receta" : "Contenido"}
              </label>
              <textarea
                id="content"
                name="content"
                placeholder={
                  state.postType === "Receta"
                    ? "Describe la receta"
                    : "Escribe el contenido de tu publicación"
                }
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
