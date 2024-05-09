import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { TbChefHatOff } from "react-icons/tb";
import { TbChefHat } from "react-icons/tb";
import axios from "../api/axios.jsx";
import { BiComment } from "react-icons/bi";
import './DetallesReceta.css';
import Cookies from 'universal-cookie';
import Comentario from "../components/Comentario";
import { FaTrashCan } from "react-icons/fa6";
import { IoMdAlert } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";

function DetallesReceta() {
    const { id } = useParams();
    const [author, setAuthor] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [numComments, setNumComments] = useState();
    const [ingredients, setIngredients] = useState([]);
    const [tags, setTags] = useState([]);
    const [score, setScore] = useState();
    const [voted, setVoted] = useState(false); 
    const [lastVote, setLastVote] = useState(0);
    const [comment, setComment] = useState('');
    const [voteStatus, setVoteStatus] = useState(0);
    const [showPlaceholder, setShowPlaceholder] = useState(true);
    const [showButtons, setShowButtons] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [comments, setComments] = useState([]);
    const [reload, setReload] = useState(false);
    const [reportMenuVisible, setReportMenuVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [submittingReport, setSubmittingReport] = useState(false);
    const [username, setUsername] = useState('');
    const [is_admin, set_is_admin] = useState(false);
    const [reports, setReports] = useState([]);
    const [saved, setSaved] = useState(false);

    const url =  import.meta.env.VITE_API_URL;

    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    const ocultarAlerta = () => {
        setAlertVisible(false);
      };
    
    const handleChangeComment = (event) => {
        const comment = event.target.value;
        setComment(comment);
    };
    
    const handleInputCommentClick = () => {
        jwt ? (
          setShowPlaceholder(false),
          setShowButtons(true)
        )
        : alert("Debes iniciar sesión para comentar")
        
    };
    
    const discartComment = () => {
        setComment("");
        setShowPlaceholder(true);
        setShowButtons(false);
        ocultarAlerta();
    };
    
    const handleInputCommentCancel = () => {
        if (!comment) {
          setShowPlaceholder(true);
          setShowButtons(false);
        } else {
          setAlertVisible(true);
        }
    };

    const handleVote = async (voteType) => {
        try {
            // Determinar el voto a enviar al backend
            const voteToSend = voted && voteType === lastVote ? 0 : voteType;
    
            const response = await axios.post(`${url}/vote/recipe/`, {
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
                    //cookies.remove("auth_token");
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
    
    const handle_delete_post = async () => {
        try {
          if(confirm("Esta acción es definitiva ¿Estás seguro de eliminar la publicación?")){
            const res = await axios.post(`${url}/delete_posts/recipe`, {
              post_id: id,
              jwt : jwt
            });
            alert(res.data.message);
            history.back();
          }
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
        }
      };

    useEffect(() => {
        obtenerDetallesReceta(id);
        get_user_data();
    }, [reload]);

    const obtenerDetallesReceta = async (id) => {
        try {
          const res = await axios.post(`${url}/recipe/`, {
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
            setComments(res.data.recipe_comments);
            setLastVote(res.data.vote_type > 0 ? 1 : (res.data.vote_type < 0 ? -1 : 0));
            setVoteStatus(res.data.vote_type);
            setTags(res.data.tagsList);
            setSaved(res.data.is_saved === 1); 
            const userHasVoted = res.data.vote_type !== 0;
            setVoted(userHasVoted);
          } else {
            alert(res.data.message);
          }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    };

    const get_user_data = async () =>{
        try{
          const response = await axios.post(`${url}/get_jwt_info`, {
              jwt: jwt,
          });
          
          if (response.data.type === "SUCCESS"){
            setUsername(response.data.username);
            set_is_admin(response.data.is_admin);
          }

          if(response.data.is_admin){
            const response = await axios.post(`${url}/get_reports/`, {
                jwt: jwt,
                recipe_id : id
            });
    
            if (response.data.type === "SUCCESS"){
              setReports(response.data.messages);
            }
          }
    
        }catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
      }

    const submitComment = async () => {
        try {
          const res = await axios.post(
            `${url}/comment/recipe/`,
            {
              post_id: id,
              content: comment,
              jwt: jwt,
            }
          );
          if (res.data.type === "SUCCESS") {
            alert(res.data.message);
            setComment("");
            setShowPlaceholder(true);
            setShowButtons(false);
            setReload(!reload);
          } else {
            alert(res.data.message);
          }
        } catch (error) {
          console.error("Error al realizar la solicitud:", error);
        }

    };

    const toggleReportMenu = () => {
        setReportMenuVisible(!reportMenuVisible);
        setReportReason(''); 
    };

    const selectReportReason = (event) => {
        setReportReason(event.target.value);
    };

    const submitReport = async () => {
        try {
            setSubmittingReport(true);
            const response = await axios.post(`${url}/report/recipe`, { // Aquí va la URL para reportar receta, entre las comillas
                id: id,
                message: reportReason,
                jwt: jwt
            });
            if (response.data.type === "SUCCESS") {
                alert(response.data.message);
                setReportReason('');
                toggleReportMenu();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        } finally {
            setSubmittingReport(false);
        }
    };

    const submitSave = async () => {
        try {
            const response = await axios.post(`${url}/save/recipe`, {
                post_id: id,
                jwt: jwt
            });
            if (response.data.type === "SUCCESS") {
                setSaved(!saved);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
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


    return (
        <div className='dp-container'>
            {is_admin ? (<div>Este post ha sido reportado por:</div>): (<div></div>)}
            {is_admin ? (reports.map((message) => <li key = {message}>{message}</li>)): (<div></div>)}
            <div className='dp-post'>
            {author == username || is_admin ? (
                <button
                    className="dp-delete-button"
                    title="Eliminar publicación"
                    onClick={handle_delete_post}> 
                    <FaTrashCan />
                </button>) : <div></div>}
                <div className='dp-score'>
                    <button
                        className={`vote-button ${voted && lastVote === 1 ? 'voted' : ''} ${voteStatus === 1 ? 'user-voted' : ''}`}
                        onClick={() => handleVote(1)}
                        title="Estás de acuerdo en que es información útil, relevante o correcta"
                    >
                        <TbChefHat size={30} className={`xd ${voted && lastVote === 1 ? 'voted' : ''} ${voteStatus === 1 ? 'user-voted2' : ''}`} />
                    </button>
                    {score}
                    <button
                        className={`vote-button ${voted && lastVote === -1 ? 'voted' : ''} ${voteStatus === -1 ? 'user-voted' : ''}`}
                        onClick={() => handleVote(-1)}
                        title="Consideras que la información no es útil, relevante o correcta"
                    >
                        <TbChefHatOff size={30} className={`xd ${voted && lastVote === -1 ? 'voted' : ''} ${voteStatus === -1 ? 'user-voted2' : ''}`} />
                    </button>
                    <button
                        className={`save-button ${saved ? 'saved' : ''}`} // Agrega la clase 'saved' cuando 'saved' es true
                        onClick={submitSave}
                        title={saved ? "Eliminar de guardados" : "Guardar publicación"}
                    >
                    <FaBookmark size={25} className="dp-guardar" />
                    </button>
                </div>
                <div className='dp-contenido'>
                    <span className='dp-userName'>{author}</span>
                    <span className='dp-title'>{title}</span>
                    <div className='dp-tags'>
                    <div className='tags-container'>
                        {tags.map((tagId, index) => (
                            <div key={index} className='tag'>{tagsDictionary[tagId]}</div>
                        ))}
                    </div>
                    </div>
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
                    <div className="dp-description" dangerouslySetInnerHTML={{ __html: description }}></div>
                    <div className='dp-contain'>
                    <div className='dp-numComments'>
                        <BiComment />
                        {numComments}
                    </div>
                    <div className="dp-report-button">
                            <button className="dp-bt1" onClick={toggleReportMenu} disabled={submittingReport}>
                                <IoMdAlert size={18} className="alerta"/>
                                {submittingReport ? 'Enviando...' : 'Reportar receta'}
                            </button>
                        </div>
                    </div>
                    {reportMenuVisible && (
                        <div className='dp-aclaracion'>
                                <div className="dp-report-menu">
                                    <select value={reportReason} onChange={selectReportReason}>
                                    <option value="">Selecciona una razón</option>
                                        <option value="Spam">Spam</option>
                                        <option value="Contenido inapropiado">Contenido inapropiado</option>
                                        <option value="Contenido engañoso">Contenido engañoso</option>
                                        <option value="Derechos de autor">Derechos de autor</option>
                                        <option value="Ofensivo">Contenido ofensivo</option>
                                        <option value="Suplantación">Suplantación</option>
                                        <option value="Odio">Contenido con odio</option>
                                        <option value="Contenido Peligroso">Contenido peligroso</option>
                                        <option value="contenido erróneo">Contenido erróneo</option>
                                        <option value="Violación de normas">Violación de normas</option>
                                        <option value="Contenido sexual">Contenido sexual</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    <div>
                                        <button onClick={submitReport} className="dp-report-menu-submit" disabled={!reportReason || submittingReport}>
                                            {submittingReport ? 'Enviando...' : 'Reportar'}
                                        </button>
                                        <button onClick={toggleReportMenu} className="dp-report-menu-cancel" disabled={submittingReport}>
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                                <div className="dp-mensaje">
                                    <h3>Selecciona el motivo por el cual deseas reportar este post. El administrador revisará el reporte y tomará medidas frente al mismo.</h3>
                                    </div>
                            </div>
                            )}
                </div>
            </div>
            <div className='dp-makeComment'>
                <input
                placeholder={showPlaceholder ? "Escribe un comentario..." : ""}
                className="dp-input-comment"
                type="text"
                value={comment}
                onChange={handleChangeComment}
                onClick={handleInputCommentClick}
                />
                {showButtons && (
                <div className="dp-makeComment-buttons-cancel-comment">
                    <button
                    className="dp-button-cancel"
                    onClick={handleInputCommentCancel}
                    >
                    Cancelar
                    </button>
                    <button className="dp-button-comment" onClick={submitComment}>
                    Comentar
                    </button>
                </div>
                )}
            </div>
            <div className='dp-comments'>
                Comentarios
            </div>
            {alertVisible && (
                <div className="dp-alert-cancel">
                    <div className="dp-alert-cancel-content">
                        <div className="dp-alert-cancel-content-title">
                            <span className="dp-title">¿Descartar comentario?</span>
                            <span className="close" onClick={ocultarAlerta}>
                            &times;
                            </span>
                        </div>
                        <div className="dp-description">
                            Tienes un comentario en progreso, ¿estás seguro de que quieres
                            descartarlo?
                        </div>
                        <div className="dp-alert-cancel-buttons">
                            <button className="dp-button-cancel" onClick={ocultarAlerta}>
                                Cancelar
                            </button>
                            <button className="dp-button-discard" onClick={discartComment}>
                                Descartar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {comments.map((comment) => (
                <Comentario
                    key={comment.comment_id}
                    reload={reload}
                    setReload={setReload}
                    post_id={id}
                    jwt={jwt}
                    comment_id={comment.comment_id}
                    comment_content={comment.comment_content}
                    comment_user={comment.comment_user}
                    comment_user_avatar={comment.comment_user_avatar}
                    response_list={comment.response_list}
                    type="recipe"
                    username = {username}
                    is_admin = {is_admin}
                />
                ))
            }
        </div>
    );
}

export default DetallesReceta;