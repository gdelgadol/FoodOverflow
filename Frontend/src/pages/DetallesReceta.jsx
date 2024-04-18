import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import axios from "../api/axios.jsx";
import { BiComment } from "react-icons/bi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './DetallesReceta.css';
import Cookies from "universal-cookie";

function DetallesReceta() {
    const { id } = useParams();
    const [author, setAuthor] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [numComments, setNumComments] = useState();
    const [ingredients, setIngredients] = useState([]);
    const [score, setScore] = useState();

    const [comment, setComment] = useState('');

    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    const handleChange = (value) => {
        setComment(value);
    };

    useEffect(() => {
        obtenerDetallesReceta(id);
    }, []);

    const obtenerDetallesReceta = async (id) => {
        try {
          const res = await axios.post("http://127.0.0.1:8000/recipe/", {
            recipe_id: id,
            jwt : jwt
          });
          if (res.data.type === "SUCCESS") {
            setAuthor(res.data.username);
            setTitle(res.data.title);
            setDescription(res.data.description);
            setNumComments(res.data.numComments);
            setIngredients(res.data.ingredients.split("_"));
            setScore(res.data.score);
          } else {
            alert(res.data.message);
          }
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
        }
    };

    return (
        <div className='dp-container'>
            <div className='dp-post'>
                <div className='dp-score'>
                    <HiArrowCircleDown size={30} />
                    {score}
                    <HiArrowCircleUp size={30} />
                </div>
                <div className='dp-contenido'>
                    <span className='dp-userName'>{author}</span>
                    <span className='dp-title'>{title}</span>
                    {ingredients.length > 0 && (
                        <div className='dp-ingredients'>
                            <h4>Ingredientes:</h4>
                            <ul>
                                {ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="dp-description">{description}</div>
                    <div className='dp-numComments'>
                        <BiComment />
                        {numComments}
                    </div>
                </div>
            </div>
            <div className='dp-makeComment'>
                <ReactQuill
                    theme="snow"
                    value={comment}
                    onChange={handleChange}
                    className='dp-inputComment'
                    placeholder="Escribe un comentario..."
                    modules={{
                        toolbar: [
                          [{ 'header': '1'}, {'header': '2'}],
                          ['bold', 'italic'],
                          ['link', 'image'],
                          ['clean'],
                        ],
                    }}
                />
                <button className='dp-submitComment'>Comentar</button>
            </div>
            <div className='dp-comments'>
                Comentarios
            </div>
        </div>
    );
}

export default DetallesReceta;
