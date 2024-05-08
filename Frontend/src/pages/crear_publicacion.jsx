import { useRef, useState } from "react";
import axios from "axios";
import "./crear_publicacion.css";
import Cookies from "universal-cookie";
import iconoImg from "../assets/logo.png";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import { Link, useNavigate } from "react-router-dom";

function Crear_publicacion() {
  const cookies = new Cookies();
  const jwt = cookies.get("auth_token");

  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const url =  import.meta.env.VITE_API_URL;

  const [content, setContent] = useState("");
  const [state, setState] = useState({
    title: "",
    content: "",
    postType: "",
    tags: [],
    ingredients: [],
  });

  const handleCommentInput = (value) => {
    setContent(value);
    setState({
      ...state,
      [content]: content,
    });
  };

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
    newIngredients.splice(index, 1);
    setState({
      ...state,
      ingredients: newIngredients,
    });
  };

  const handleAddTag = (event) => {
    const selectedTag = event.target.value;
    if (!state.tags.includes(selectedTag)) {
      setState({
        ...state,
        tags: [...state.tags, selectedTag],
      });
    }
  };

  const handleRemoveTag = (index) => {
    const newTags = [...state.tags];
    newTags.splice(index, 1);
    setState({
      ...state,
      tags: newTags,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const tagsAsNumbers = state.tags.map(tag => parseInt(tag, 10));
    setState({
      ...state,
      tags: tagsAsNumbers,
    });
    console.log(state);
    if (state.postType === "Receta") {
      crear_receta();
    } else {
      crear_publicacion();
    }
  };

  const navigate = useNavigate();

  const crear_publicacion = () => {
    if (jwt) {
      axios
        .post(`${url}/crear_publicacion/`, {
          title: state.title,
          content: content,
          tags_list: state.tags,
          jwt: jwt,
        })
        .then((res) => {
          if (res.data.type === "SUCCESS") {
            alert(res.data.message);
            navigate("/forum");
          } else {
            alert(res.data.message);
          }
        });
    } else {
      alert("Usuario no ha iniciado sesión");
    }
  };

  const crear_receta = () => {
    if (jwt) {
      const ingredientsString = state.ingredients
        .map((ingredient) => `${ingredient.name}: ${ingredient.quantity}`)
        .join("_");
      axios
        .post(`${url}/crear_recipe/`, {
          title: state.title,
          ingredients: ingredientsString,
          instructions: content,
          tags_list: state.tags,
          jwt: jwt,
        })
        .then((res) => {
          if (res.data.type === "SUCCESS") {
            alert(res.data.message);
            navigate("/forum");
          } else {
            alert(res.data.message);
          }
        });
    } else {
      alert("Usuario no ha iniciado sesión");
    }
  };

  const tagsDictionary = {
    1: "Vegetariano",
    2: "Vegano",
    3: "Sin gluten",
    4: "Bajo en carbohidratos",
    5: "Alta en proteínas",
    6: "Postre",
    7: "Desayuno",
    8: "Almuerzo",
    9: "Cena",
    10: "Aperitivo"
  };

  const availableTags = Object.keys(tagsDictionary).filter(tag => !state.tags.includes(tag));

  return (
    <div className="form-container">
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
        {state.postType && (
          <>
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
              <label htmlFor="tags">Tags</label>
              <select
                id="tags"
                name="tags"
                value=""
                onChange={handleAddTag}
              >
                <option value="" disabled>Seleccionar tags</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>
                    {tagsDictionary[tag]}
                  </option>
                ))}
              </select>
              <div className="tags-container">
                {state.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tagsDictionary[tag]}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                    >
                      X
                    </button>
                  </span>
                ))}
              </div>
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
                    <button
                      className="chao"
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      Eliminar ingrediente
                    </button>
                  </div>
                ))}
                <br />
                <button
                  className="register-button center-button"
                  type="button"
                  onClick={handleAddIngredient}
                >
                  Agregar otro ingrediente
                </button>
              </div>
            )}
            <div className="input-group">
              <label htmlFor="content">
                {state.postType === "Receta"
                  ? "Descripción receta"
                  : "Contenido"}
              </label>
              <div className='dp-makeComment2'>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={handleCommentInput}
                  className='dp-inputComment'
                  placeholder="Escribe el contenido de la receta"
                  modules={{
                    toolbar: [
                      [{ 'header': '1'}, {'header': '2'}],
                      ['bold', 'italic'],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                />
              </div>
            </div>
          </>
        )}
        {state.postType && (
          <button type="submit" className="register-button center-button">
            Publicar
          </button>
        )}
      </form>
    </div>
  );
}

export default Crear_publicacion;
