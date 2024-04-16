import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import axios from "../api/axios.jsx";
import './DetallesPublicacion.css';
import { BiComment } from "react-icons/bi";
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
    const [comment, setComment] = useState('');

    const handleChangeComment = (event) => {
		const comment = event.target.value
        setComment(comment);
    };

	const handleChange = (value) => {
        setComment(value);
    };

	const handleInputCommentClick = () => {
		setShowPlaceholder(false)
		setShowButtons(true)
	}

	const handleInputCommentCancel = () => {

		setShowPlaceholder(true)
        setShowButtons(false)
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
						<button className='dp-button-comment'>Comentar</button>
					</div>
				)}
			</div>

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
            <div className='dp-commentContent'>
                <p>Contenido del comentario:</p>
                <div dangerouslySetInnerHTML={{ __html: comment }} />
            </div>
			<div className='dp-hiddenComment'>
                    {comment}
            </div>


            <div className='dp-comments'>
                Comentarios
            </div>
        </div>
    );
  }
  export default DetallesPublicacion;