import { useRef, useState } from "react";
import axios from "axios";
import "./crear_publicacion.css";
import Cookies from "universal-cookie";
import iconoImg from "../assets/logo.png";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Quill from 'quill';
import ImageCompress from 'quill-image-compress';
import Swal from 'sweetalert2';
import { Link, useNavigate } from "react-router-dom";
import tagsDictionary from "../../labels.json";

Quill.register('modules/imageCompress', ImageCompress);

function Crear_publicacion() {
  const cookies = new Cookies();
  const jwt = cookies.get("auth_token");

  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();
  const url = import.meta.env.VITE_API_URL;

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
      content: value,
    });
  };

  const handleInput = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value,
    });
  };

  const handleIngredientChange = (index, event) => {
    const { name, value } = event.target;

    // Validación para el nombre del ingrediente
    if (name === "name" && value.includes("_")) {
      setErrMsg("El nombre del ingrediente no puede contener el carácter '_'");
      errRef.current.focus();
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
      return;
    }

    // Validación solo para el campo de cantidad
    if (name === "quantity" && state.ingredients[index].units !== "Al gusto") {
      if (!/^(\d*\.?\d*|\d*\/\d*)$/.test(value)) {
        setErrMsg("Solo puedes ingresar valores numéricos en la cantidad");
        errRef.current.focus();
        setTimeout(() => {
          setErrMsg("");
        }, 3000);
        return;
      }
    }

    const newIngredients = [...state.ingredients];
    newIngredients[index][name] = value;

    // Limpiar el campo de cantidad al seleccionar "Al gusto"
    if (name === "units" && value === "Al gusto") {
      newIngredients[index].quantity = "";
    }

    setState({
      ...state,
      ingredients: newIngredients,
    });
  };

  const handleAddIngredient = () => {
    setState({
      ...state,
      ingredients: [...state.ingredients, { name: "", quantity: "", units: "" }],
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

    if (state.postType === "Receta") {

      if (state.ingredients.length  < 1){
        setErrMsg("Debes agregar al menos un ingrediente");
        errRef.current.focus();
        return;
      }
      if (content.replace(/<[^>]*>/g, '').trim().length < 1) {
        setErrMsg("Debes agregar una descripción");
        errRef.current.focus();
        return;
      }
      crear_receta();
    } else {
      if (content.replace(/<[^>]*>/g, '').trim().length < 1) {
        setErrMsg("Debes agregar una descripción");
        errRef.current.focus();
        return;
      }
      crear_publicacion();
    }
  };

  const navigate = useNavigate();

  const crear_publicacion = () => {
    if (jwt) {
      axios
        .post(`${url}/crear_publicacion/`, {
          title: state.title,
          content: content.replace(/<p>\s*<\/p>|<p><br\s*\/?>\s*<\/p>/g, ''),
          tags_list: state.tags,
          jwt: jwt,
        })
        .then((res) => {
          if (res.data.type === "SUCCESS") {
            Swal.fire({
              title: `<strong>${res.data.message}</strong>`,
              icon: "success",
              timer: 4000,
              confirmButtonColor: "#27ae60",
            });
            navigate("/forum");
          } else {
            Swal.fire({
              title: `<strong>${res.data.message}</strong>`,
              icon: "success",
              timer: 4000,
              confirmButtonColor: "#ff0000",
            });
          }
        });
    } else {
      Swal.fire({
        title: "<strong>El usuario no ha iniciado sesión.</strong>",
        icon: "error",
        timer: 4000,
        confirmButtonColor: "#ff0000",
      });
    }
  };

  const crear_receta = () => {
    if (jwt) {
      const ingredientsString = state.ingredients
        .map((ingredient) => `${ingredient.name}: ${ingredient.quantity} ${ingredient.units}`)
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
            Swal.fire({
              title: `<strong>${res.data.message}</strong>`,
              icon: "success",
              timer: 4000,
              confirmButtonColor: "#27ae60",
            });
            navigate("/forum");
          } else {
            Swal.fire({
              title: `<strong>${res.data.message}</strong>`,
              icon: "error",
              timer: 4000,
              confirmButtonColor: "#ff0000",
            });
          }
        });
    } else {
      Swal.fire({
        title: "<strong>El usuario no ha iniciado sesión</strong>",
        icon: "error",
        timer: 4000,
        confirmButtonColor: "#ff0000",
      });
    }
  };

  const availableTags = Object.keys(tagsDictionary).filter(tag => !state.tags.includes(tag));

  const unitOptions = [
    "unidades",
    "gramos",
    "miligramos",
    "litros",
    "mililitros",
    "cucharadas soperas",
    "cucharaditas",
    "onzas",
    "libras",
    "tazas",
    "piezas",
    "rebanadas",
    "hojas",
    "ramas",
    "dientes",
    "tiras",
    "pizcas",
    "Al gusto"
  ];

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
          <label htmlFor="postType">¿Qué quieres publicar hoy?</label>
          <select
            id="postType"
            name="postType"
            value={state.postType}
            onChange={handleInput}
          >
            <option value="">Selecciona una opción</option>
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
                placeholder={state.postType === "Receta"
                ? "Ingresa un título para tu receta." : "Ingresa un título para tu publicación."}
                value={state.title}
                onChange={handleInput}
                required
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
                <option value="" disabled>Selecciona las etiquetas que mejor vayan con tu post</option>
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
                      color = "red"
                    >
                      x
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
                      required
                    />
                    {ingredient.units !== "Al gusto" && (
                      <input
                        type="text"
                        name="quantity"
                        placeholder="Cantidad del ingrediente"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, e)}
                        required
                      />
                    )}
                    <select
                      name="units"
                      value={ingredient.units}
                      className="select-unit"
                      onChange={(e) => handleIngredientChange(index, e)}
                      required
                    >
                      <option value="" disabled>Seleccionar unidad</option>
                      {unitOptions.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
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
                  Agregar un ingrediente
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
                  placeholder="Cuéntanos más sobre tu post..."
                  modules={{
                    toolbar: [
                      [{ 'header': '1'}, {'header': '2'}],
                      ['bold', 'italic'],
                      ['link', 'image'],
                      ['clean'],
                    ],
                    imageCompress: {
                      quality: 0.5, // Adjust quality as needed
                      maxWidth: 400, // Maximum width of compressed image
                      maxHeight: 400, // Maximum height of compressed image
                      imageType: 'image/jpeg' // Compressed image type
                    }
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
