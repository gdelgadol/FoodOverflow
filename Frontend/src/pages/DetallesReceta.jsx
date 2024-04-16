// DetallesReceta.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import axios from "../api/axios.jsx";
import { BiComment } from "react-icons/bi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './DetallesReceta.css';

function DetallesReceta() {
    const { id } = useParams();
    const [author, setAuthor] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [numComments, setNumComments] = useState();
    const [ingredients, setIngredients] = useState([]);
    const [score, setScore] = useState();

    const [comment, setComment] = useState('');

    const handleChange = (value) => {
        setComment(value);
    };

    useEffect(() => {
        obtenerDetallesReceta(id);
    }, []);

    const obtenerDetallesReceta = async (id) => {
        try {
          const res = await axios.post("http://127.0.0.1:8000/recipe/", {
            recipe_id: id
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
        <div className='dr-container'>
            <div className='dr-post'>
                <div className='dr-score'>
                    <HiArrowCircleDown size={30} />
                    {score}
                    <HiArrowCircleUp size={30} />
                </div>
                <div className='dr-contenido'>
                    <span className='dr-userName'>{author}</span>
                    <span className='dr-title'>{title}</span>
                    <div className="dr-description">{description}</div>
                    {ingredients.length > 0 && (
                        <div className='dr-ingredients'>
                            <h4>Ingredientes:</h4>
                            <ul>
                                {ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className='dr-numComments'>
                        <BiComment />
                        {numComments}
                    </div>
                </div>
            </div>
            <div className='dr-makeComment'>
                <ReactQuill
                    theme="snow"
                    value={comment}
                    onChange={handleChange}
                    className='dr-inputComment'
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
                <button className='dr-submitComment'>Comentar</button>
            </div>
            <div className='dr-comments'>
                Comentarios
            </div>
        </div>
    );
}

export default DetallesReceta;
