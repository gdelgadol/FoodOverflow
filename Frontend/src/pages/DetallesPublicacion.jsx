import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { HiArrowCircleDown, HiArrowCircleUp } from "react-icons/hi";
import axios from "../api/axios.jsx";
import { BiComment } from "react-icons/bi";
import { FaTrashCan } from "react-icons/fa6";
import "./DetallesPublicacion.css";
import Cookies from "universal-cookie";
import Comentario from "../components/Comentario";
import { IoMdAlert } from "react-icons/io";
import { FaBookmark } from "react-icons/fa";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";
import tagsDictionary from "../../labels.json";

function DetallesPublicacion() {
  const { id } = useParams();
  const [author, setAuthor] = useState();
  const [avatar, setAvatar] = useState();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [numComments, setNumComments] = useState();
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [score, setScore] = useState();
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [voted, setVoted] = useState(false);
  const [lastVote, setLastVote] = useState(0);
  const [comment, setComment] = useState('');
  const [voteStatus, setVoteStatus] = useState(0);
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
    : Swal.fire({
      title: "<strong>Error</strong>",
      text: "Debes iniciar sesión para comentar.",
      icon: "error",
      timer: 4000,
      confirmButtonColor: "#ff0000",
    });
    
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

        const response = await axios.post(`${url}/vote/publication/`, {
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
          Swal.fire({
            title: `<strong>${response.data.message}</strong>`,
            icon: "error",
            timer: 4000,
            confirmButtonColor: "#ff0000",
          }); 
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
};

  const handle_delete_post = async () => {
    try {
      Swal.fire({
        title: "<strong>¿Estás seguro de eliminar la publicación?</strong>",
        text: "Esta acción es definitiva y una vez eliminada, no se puede recuperar.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, estoy seguro"
      }).then((result) => {
          if (result.isConfirmed) {
            axios.post(`${url}/delete_posts/publication`, {
                  post_id: id,
                  jwt: jwt
              }).then((res) => {
                  Swal.fire({
                      title: `<strong>${res.data.message}</strong>`,
                      icon: "success",
                      timer: 4000,
                      confirmButtonColor: "#27ae60",
                  });
                  history.back();
              }).catch((error) => {
                  Swal.fire({
                      title: "<strong>Error</strong>",
                      text: "Hubo un error al eliminar la publicación.",
                      icon: "error",
                      timer: 4000,
                      confirmButtonColor: "#ff0000",
                  });
              });
          }
      });
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  useEffect(() => {
    obtenerDetallesPublicacion(id);
    get_user_data();
  }, [reload]);

  const obtenerDetallesPublicacion = async (id) => {
    try {
      const res = await axios.post(`${url}/publication/`, {
        publication_id: id,
        jwt: jwt,
      });
      if (res.data.type === "SUCCESS") {
        setAuthor(res.data.username);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setNumComments(res.data.numComments);
        setComments(res.data.publication_comments);
        setScore(res.data.score);
        setLastVote(res.data.vote_type > 0 ? 1 : (res.data.vote_type < 0 ? -1 : 0));
        setVoteStatus(res.data.vote_type);
        setTags(res.data.tagsList);
        setSaved(res.data.is_saved); 
        setAvatar(res.data.profile_avatar);
        const userHasVoted = res.data.vote_type !== 0;
        setVoted(userHasVoted);
      } else {
        Swal.fire({
          title: `<strong>${res.data.message}</strong>`,
          icon: "error",
          timer: 4000,
          confirmButtonColor: "#ff0000",
        });
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
            publication_id : id
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
        `${url}/comment/publication/`,
        {
          post_id: id,
          content: comment,
          jwt: jwt,
        }
      );
      if (res.data.type === "SUCCESS") {
        Swal.fire({
          title: `<strong>${res.data.message}</strong>`,
          icon: "success",
          timer: 4000,
          confirmButtonColor: "#27ae60",
        });
        setComment("");
        setShowPlaceholder(true);
        setShowButtons(false);
        setReload(!reload);
      } else {
        Swal.fire({
          title: `<strong>${res.data.message}</strong>`,
          icon: "error",
          timer: 4000,
          confirmButtonColor: "#ff0000",
        });
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const ignore_report = async (id) => {
    try {
        const response = await axios.post(`${url}/notifications/delete/`, { // Aquí va la URL para reportar receta, entre las comillas
            notification_id : id,
            ignore_report : true,
            jwt: jwt
        });
        console.log(response.data.message);
        setReload(!reload);
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    }
}

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
        const response = await axios.post(`${url}/report/publication`, { // Aquí va la URL para reportar publicacion, entre las comillas
            id: id,
            message: reportReason,
            jwt: jwt
        });
        if (response.data.type === "SUCCESS") {
          Swal.fire({
            title: `<strong>${response.data.message}</strong>`,
            icon: "success",
            timer: 4000,
            confirmButtonColor: "#27ae60",
          });
            setReportReason('');
            toggleReportMenu();
            setReload(!reload);
        } else {
          Swal.fire({
            title: `<strong>${response.data.message}</strong>`,
            icon: "error",
            timer: 4000,
            confirmButtonColor: "#ff0000",
          });
        }
    } catch (error) {
        console.error("Error al realizar la solicitud:", error);
    } finally {
        setSubmittingReport(false);
    }
};

const submitSave = async () => {
  try {
      const response = await axios.post(`${url}/save/publication`, {
          post_id: id,
          jwt: jwt
      });
      if (response.data.type === "SUCCESS") {
          setSaved(!saved);
      } else {
        Swal.fire({
          title: `<strong>${response.data.message}</strong>`,
          icon: "error",
          timer: 4000,
          confirmButtonColor: "#ff0000",
        });
      }
  } catch (error) {
      console.error("Error al realizar la solicitud:", error);
  }
};



  return (
    <div className="dp-container">
      {is_admin && reports.length ? (<div>Este post ha sido reportado por:</div>): (<></>)}
      {is_admin ? (reports.map((report) => <li key = {report.id}>{report.message} <button onClick = {() => ignore_report(report.id)}>Ignorar reporte</button></li>)): (<></>)}
      <div className="dp-post">
      {author == username || is_admin ? (
        <button
            className="dp-delete-button"
            onClick= {handle_delete_post}
            custom_title="Eliminar publicación"
            > 
            <FaTrashCan />
        </button>) : <></>}
        <div className="dp-score">
          <button
            className={`vote-button ${voted && lastVote === 1 ? 'voted' : ''} ${voteStatus === 1 ? 'user-voted' : ''}`}
            onClick={() => handleVote(1)}
            custom_title="Estás de acuerdo en que es información útil, relevante o correcta"
          >
            <HiArrowCircleUp size={30} className={`xd ${voted && lastVote === 1 ? 'voted' : ''} ${voteStatus === 1 ? 'user-voted2' : ''}`} />
          </button>
          {score}
          <button
            className={`vote-button ${voted && lastVote === -1 ? 'voted' : ''} ${voteStatus === -1 ? 'user-voted' : ''}`}
            onClick = {() => handleVote(-1)}
            custom_title="Consideras que la información no es útil, relevante o correcta"
          >
            <HiArrowCircleDown size={30} className={`xd ${voted && lastVote === -1 ? 'voted' : ''} ${voteStatus === -1 ? 'user-voted2' : ''}`}/>
          </button>
          <button
              className={`save-button ${saved ? 'saved' : ''}`} // Agrega la clase 'saved' cuando 'saved' es true
              onClick={submitSave}
              custom_title={saved ? "Eliminar de guardados" : "Guardar publicación"}
          >
              <FaBookmark size={25} className="dp-guardar" />
          </button>
        </div>
        <div className="dp-contenido">
          <Link to = {`/user/${author}`} relative = "/">
            <div className="dp-profile-info">
              <img src={avatar} className='dp-userAvatar' alt='profile_avatar' />
              <span className="dp-userName">{author}</span>
            </div>
          </Link>
          <span className="dp-title">{title}</span>
          {tags && tags.length > 0 && (
            <div className='dp-tags'>
              <div className='tags-container'>
                {tags.map((tagId, index) => (
                  <Link to ={`/results_search/buscar_tags=${tagId}`}>
                    <div key={index} className='tag2' custom-color={tagsDictionary[tagId][1]} clickeable = 'true'>{tagsDictionary[tagId][0]}</div>
                  </Link>
                ))}
              </div>
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
                                {submittingReport ? 'Enviando...' : 'Reportar publicación'}
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
                                        <option value="Terrorismo">Terrorismo</option>
                                        <option value="Estafa">Estafa piramidal</option>
                                        <option value="Odio">Contenido con odio</option>
                                        <option value="Contenido Peligroso">Contenido peligroso</option>
                                        <option value="Contenido erróneo">Contenido erróneo</option>
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
      <div className="dp-makeComment">
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
      <div className="dp-comments">Comentarios</div>
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
          jwt={jwt}
          reload={reload}
          setReload={setReload}
          post_id={id}
          comment_id={comment.comment_id}
          comment_content={comment.comment_content}
          comment_user={comment.comment_user}
          comment_user_avatar={comment.comment_user_avatar}
          response_list={comment.response_list}
          type="publication"
          username = {username}
          is_admin = {is_admin}
          is_publication = {true}
        />
        ))
      }
    </div>
  );
}
export default DetallesPublicacion;
