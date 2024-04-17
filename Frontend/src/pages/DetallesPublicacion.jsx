import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import axios from "../api/axios.jsx";
import './DetallesPublicacion.css';
import { BiComment } from "react-icons/bi";
import Cookies from "universal-cookie";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function DetallesPublicacion() {
    const { id } = useParams();
    const [author, setAuthor] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [numComments, setNumComments] = useState();
    const [comments, setComments] = useState();
    const [score, setScore] = useState();
	const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [showButtons, setShowButtons] = useState(false);
    const [comment, setComment] = useState();
	const [alertVisible, setAlertVisible] = useState(false);

    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

	const ocultarAlerta = () => {
		setAlertVisible(false);
	}

  const handleUpVote = () => {
    // Función para manejar el voto positivo
  };  

  const handleDownVote = () => {
    // Función para manejar el voto negativo
  };

    const handleChangeComment = (event) => {
		const comment = event.target.value
        setComment(comment);
    };

	const handleInputCommentClick = () => {
		setShowPlaceholder(false)
		setShowButtons(true)
	}

    const discartComment = () => {
        setComment("");
        setShowPlaceholder(true)
        setShowButtons(false)
        ocultarAlerta()
    }

	const handleInputCommentCancel = () => {
		if (!comment) {
			setShowPlaceholder(true)
			setShowButtons(false)
		} else {
			setAlertVisible(true)
		}
	}

    useEffect(() => {
        detallesPublicacion(id);
    }, []);

    const detallesPublicacion = async (id) => {
        try {
          const res = await axios.post("http://127.0.0.1:8000/publication/", {
            publication_id: id
          });
          if (res.data.type === "SUCCESS") {
            setAuthor(res.data.username);
            setTitle(res.data.title);
            setDescription(res.data.description);
            setNumComments(res.data.numComments);
            //setComments(res.data.comments);
            setScore(res.data.score);
          } else {
            alert(res.data.message);
          }
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
        }
      };

    const submitComment = async () => {
        try {
          const res = await axios.post("http://127.0.0.1:8000/comment/publication/", {
            post_id: id,
            content: comment,
            jwt: jwt
          });
          if (res.data.type === "SUCCESS") {
            alert(res.data.message)
            setComment("");
            setShowPlaceholder(true)
            setShowButtons(false)
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
                    <button className='vote-button' onClick={handleUpVote}>
                        <HiArrowCircleUp size={30} />
                    </button>
                    {score}
                    <button className='vote-button' onClick={handleDownVote}>
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
				<input 
					placeholder={showPlaceholder ? "Escribe un comentario..." : ""}
					className='dp-input-comment'
					type = 'text'
					value={comment}
					onChange={handleChangeComment}
					onClick={handleInputCommentClick}
				/>
				{showButtons && (
					<div className='dp-makeComment-buttons-cancel-comment'>
						<button className='dp-button-cancel' onClick={handleInputCommentCancel}>Cancelar</button>
						<button className='dp-button-comment' onClick={submitComment}>Comentar</button>
					</div>
				)}
			</div>
            <div className='dp-comments'>
                Comentarios
            </div>
			{alertVisible && (
				<div className='dp-alert-cancel'>
					<div className='dp-alert-cancel-content'>
						<div className='dp-alert-cancel-content-title'>
							<span className='dp-title'>¿Descartar comentario?</span>
							<span className="close" onClick={ocultarAlerta}>&times;</span>
						</div>
						<div className='dp-description'>Tienes un comentario en progreso, ¿estás seguro de que quieres descartarlo?</div>
						<div className='dp-alert-cancel-buttons'>
                            <button className='dp-button-cancel' onClick={ocultarAlerta}>Cancelar</button>
                            <button className='dp-button-discard' onClick={discartComment}>Descartar</button>
						</div>
					</div>
				</div>
			)}
        </div>
    );
  }
  export default DetallesPublicacion;