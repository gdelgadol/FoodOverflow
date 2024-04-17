import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import axios from "../api/axios.jsx";
import { BiComment } from "react-icons/bi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './DetallesReceta.css';
import Cookies from "universal-cookie";
import Cookies from 'universal-cookie';

function DetallesReceta() {
    const { id } = useParams();
    const [author, setAuthor] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [numComments, setNumComments] = useState();
    const [ingredients, setIngredients] = useState([]);
    const [score, setScore] = useState();
    const [voted, setVoted] = useState(false); // Estado para rastrear si el usuario ha votado
    const [lastVote, setLastVote] = useState(0); // Estado para rastrear el último voto emitido por el usuario
    const [comment, setComment] = useState('');
    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    const handleChange = (value) => {
        setComment(value);
    };

    const handleVote = async (voteType) => {
        try {
            // Si el usuario ya emitió un voto y hace clic nuevamente en el mismo botón, enviar un voto con vote_type = 0 para eliminar el voto
            const voteToSend = voted && voteType === lastVote ? 0 : voteType;
            const response = await axios.post("http://127.0.0.1:8000/vote/recipe/", {
                post_id: id,
                jwt: jwt,
                vote_type: voteToSend
            });
    
            // Verificar si el voto se procesó correctamente en el backend
            if (response.data.type === "SUCCESS") {
                // Actualizar el estado local y marcar como votado si el usuario emitió un voto
                setVoted(voteToSend !== 0);
                setLastVote(voteToSend);
    
                // Calcular el nuevo puntaje localmente
                let newScore = score;
                if (voteToSend === 1) {
                    newScore = voted ? score : score + 1;
                } else if (voteToSend === -1) {
                    newScore = voted ? score : score - 1;
                } else {
                    // Si el voto enviado es 0, el usuario está eliminando su voto
                    // Actualizar el puntaje solo si el usuario había votado antes
                    if (voted) {
                        newScore += lastVote === 1 ? -1 : 1;
                    }
                }
    
                // Actualizar el estado local del puntaje
                setScore(newScore);
            } else {
                alert(response.data.message); // Manejar errores del backend
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
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
            // Inicializar lastVote según el puntaje actual
            setLastVote(res.data.score > 0 ? 1 : (res.data.score < 0 ? -1 : 0));
            // Verificar si el usuario ha votado
            const userHasVoted = res.data.score !== 0;
            setVoted(userHasVoted);
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
                <button className={`vote-button ${voted && lastVote === 1 ? 'voted' : ''}`} onClick={() => handleVote(1)}>
                    <HiArrowCircleUp size={30} />
                </button>
                {score}
                <button className={`vote-button ${voted && lastVote === -1 ? 'voted' : ''}`} onClick={() => handleVote(-1)}>
                    <HiArrowCircleDown size={30} />
                </button>
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
