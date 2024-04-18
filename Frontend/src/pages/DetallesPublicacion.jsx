import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import axios from "../api/axios.jsx";
import { BiComment } from "react-icons/bi";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './DetallesPublicacion.css';
import Cookies from 'universal-cookie';

function DetallesPublicacion() {
    const { id } = useParams();
    const [author, setAuthor] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [numComments, setNumComments] = useState();
    const [score, setScore] = useState();
    const [voted, setVoted] = useState(false);
    const [lastVote, setLastVote] = useState(0);
    const [comment, setComment] = useState('');
    const [voteStatus, setVoteStatus] = useState(0);

    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    const handleChange = (value) => {
        setComment(value);
    };

    const handleVote = async (voteType) => {
        try {
            // Determinar el voto a enviar al backend
            const voteToSend = voted && voteType === lastVote ? 0 : voteType;
    
            const response = await axios.post("http://127.0.0.1:8000/vote/publication/", {
                post_id: id,
                jwt: jwt,
                vote_type: voteToSend
            });
    
            if (response.data.type === "SUCCESS") {
                // Si el voto enviado es 0, el usuario está eliminando su voto
                if (voteToSend === 0) {
                    setVoted(false);
                    setLastVote(0);
                    setVoteStatus(0);
                    // Si el voto eliminado era positivo, se resta 1 al score, si era negativo, se suma 1
                    setScore(score - (lastVote === 1 ? 1 : (lastVote === -1 ? -1 : 0)));
                } else {
                    // Si el usuario ya había votado y ahora cambia su voto, se suma o resta 2 al score según corresponda
                    const scoreChange = voted ? (voteToSend === 1 ? 2 : -2) : (voteToSend === 1 ? 1 : -1);
                    setVoted(true);
                    setLastVote(voteToSend);
                    setVoteStatus(voteToSend);
                    setScore(score + scoreChange);
                }
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    };
    

    useEffect(() => {
        obtenerDetallesPublicacion(id);
    }, []);

    const obtenerDetallesPublicacion = async (id) => {
        try {
            const res = await axios.post("http://127.0.0.1:8000/publication/", {
                publication_id: id,
                jwt: jwt
            });

            if (res.data.type === "SUCCESS") {
                setAuthor(res.data.username);
                setTitle(res.data.title);
                setDescription(res.data.description);
                setNumComments(res.data.numComments);
                setScore(res.data.score);
                setLastVote(res.data.vote_type > 0 ? 1 : (res.data.vote_type < 0 ? -1 : 0));
                setVoteStatus(res.data.vote_type);
                const userHasVoted = res.data.vote_type !== 0;
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
                    <button className={`vote-button ${voted && lastVote === 1 ? 'voted' : ''} ${voteStatus === 1 ? 'user-voted' : ''}`} onClick={() => handleVote(1)}>
                        <HiArrowCircleUp size={30} />
                    </button>
                    {score}
                    <button className={`vote-button ${voted && lastVote === -1 ? 'voted' : ''} ${voteStatus === -1 ? 'user-voted' : ''}`} onClick={() => handleVote(-1)}>
                        <HiArrowCircleDown size={30} />
                    </button>
                </div>
                <div className='dp-contenido'>
                    <span className='dp-userName'>{author}</span>
                    <span className='dp-title'>{title}</span>
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

export default DetallesPublicacion;
