import { useState } from "react";
import axios from "../api/axios.jsx";
import Cookies from "universal-cookie";
import "./Comentario.css";

export default function Comentario({ jwt, reload, setReload, post_id, comment_id, comment_content, comment_user, comment_user_avatar, response_list, type, is_publication, username, is_admin }) {
    const [showResponses, setShowResponses] = useState(false);
    const [inputReply, setInputReply] = useState(false);
    const [response, setResponse] = useState('');
    const [submittingReport, setSubmittingReport] = useState(false);
    const [reportMenuVisible, setReportMenuVisible] = useState(false);
    const [reportReason, setReportReason] = useState('');

    const url = import.meta.env.VITE_API_URL;
    const cookies = new Cookies();

    // Funciones para manejar el menú de reporte en las respuestas
    const [reportMenuResponseVisible, setReportMenuResponseVisible] = useState({});

    const toggleReportMenuResponse = (responseIndex) => {
        setReportMenuResponseVisible(prevState => ({
            ...prevState,
            [responseIndex]: !prevState[responseIndex]
        }));
    };

    const selectReportReasonResponse = (event, responseIndex) => {
        setReportMenuResponseVisible(prevState => ({
            ...prevState,
            [responseIndex]: event.target.value
        }));
    };

    const reportCommentResponse = async (responseIndex) => {
        try {
            setSubmittingReport(true);
            const response = await axios.post(`${url}/report/${type}_comment`, {
                id: response_list[responseIndex].response_id,
                message: reportMenuResponseVisible[responseIndex],
                jwt: jwt
            });
            if (response.data.type === "SUCCESS") {
                alert(response.data.message);
                // Cerrar el menú de reporte después de un reporte exitoso
                toggleReportMenuResponse(responseIndex);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        } finally {
            setSubmittingReport(false);
        }
    };

    const toggleResponses = () => {
        setShowResponses(!showResponses);
    };

    const toggleReply = () => {
        setInputReply(!inputReply);
    };

    const sendResponse = async () => {
        try {
            const res = await axios.post(`${url}/comment/${type}/response/`, {
                post_id: post_id,
                comment_id: comment_id,
                content: response,
                jwt: jwt
            });
            if (res.data.type === "SUCCESS") {
                alert(res.data.message);
                setResponse('');
                setInputReply(false);
                setReload(!reload);
            } else {
                alert(res.data.message);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    };

    const handleChangeResponse = (event) => {
        const reply = event.target.value;
        setResponse(reply);
    };

    const handle_delete_comment = async (id, type) => {
        try {
          if(confirm(`Esta acción es definitiva ¿Estás seguro de eliminar ${type}?`)){
            var identifier = '';
            is_publication ? identifier = 'publication' : identifier = 'recipe';
            const res = await axios.post(`${url}/delete_comment/${identifier}`, {
              comment_id: id,
              jwt : jwt
            });
            alert(res.data.message);
            setReload(!reload);
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

    const reportComment = async () => {
        try {
            setSubmittingReport(true);
            const response = await axios.post(`${url}/report/${type}_comment`, {
                id: comment_id,
                message: reportReason,
                jwt: jwt
            });
            if (response.data.type === "SUCCESS") {
                alert(response.data.message);
                // Cerrar el menú de reporte después de un reporte exitoso
                toggleReportMenu();
                setReload(!reload);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        } finally {
            setSubmittingReport(false);
        }
    };

    const renderContent = (content) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return content.replace(urlRegex, (url) => (
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        ));
    };

    return (
        <div className='comentario'>
            <div className='comentario-avatar'>
                <img src={comment_user_avatar} className="comentario-content-avatar" alt="avatar" />
            </div>
            <div className='comentario-content'>
                <span className="comentario-content-user">{comment_user}</span>
                <span className='comentario-content-text' dangerouslySetInnerHTML={{ __html: renderContent(comment_content) }} />
                <div>
                    <button className="commentario-reply-button" onClick={jwt ? toggleReply : () => alert("Debes iniciar sesión para responder al comentario")}>
                        Responder
                    </button>
                    <button className="commentario-report-button" onClick={toggleReportMenu} disabled={submittingReport}>
                        {submittingReport ? 'Enviando...' : 'Reportar'}
                    </button>
                    { comment_user == username || is_admin ?(
                    <button className="commentario-delete-button" onClick = {() => handle_delete_comment(comment_id, 'el comentario')}>
                        Eliminar
                    </button>) : <div></div> }
                </div>
                {inputReply && (
                    <div className="comentario-reply">
                        <input
                            placeholder="Agrega una respuesta..."
                            className="dp-input-comment"
                            type="text"
                            onChange={handleChangeResponse}
                            value={response}
                        />
                        <div className="dp-makeComment-buttons-cancel-comment">
                            <button
                                className="dp-button-cancel"
                                onClick={toggleReply}
                            >
                                Cancelar
                            </button>
                            <button className="dp-button-comment" onClick={sendResponse}>
                                Comentar
                            </button>
                        </div>
                    </div>
                )}
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
                                <button onClick={reportComment} className="dp-report-menu-submit" disabled={!reportReason || submittingReport}>
                                    {submittingReport ? 'Enviando...' : 'Reportar'}
                                </button>
                                <button onClick={toggleReportMenu} className="dp-report-menu-cancel" disabled={submittingReport}>
                                    Cancelar
                                </button>
                            </div>
                        </div>
                        <div className="dp-mensaje">
                            <h3>Selecciona el motivo por el cual deseas reportar este comentario. El administrador revisará el reporte y tomará medidas frente al mismo.</h3>
                        </div>
                    </div>
                )}
                {response_list.length > 0 && (
                    <div>
                        <button className="responses-button" onClick={toggleResponses}>
                            {showResponses ? "Ocultar respuestas" : `Mostrar ${response_list.length} respuestas`}
                        </button>
                    </div>
                )}
                {showResponses && response_list.map((response, index) => (
                    <div key={index} className='comentario'>
                        <div className='comentario-avatar'>
                            <img src={response.response_user_avatar} className="comentario-content-avatar" alt="avatar" />
                        </div>
                        <div className='comentario-content'>
                            <span className="comentario-content-user">{response.response_user}</span>
                            <span className='comentario-content-text' dangerouslySetInnerHTML={{ __html: renderContent(response.response_content) }} />
                            <div>
                                <button className="commentario-report-button" onClick={() => toggleReportMenuResponse(index)} disabled={submittingReport}>
                                    {submittingReport ? 'Enviando...' : 'Reportar'}
                                </button>
                                { response.response_user == username || is_admin ?(
                                <button className="commentario-delete-button" onClick={() => handle_delete_comment(response.response_id,'la respuesta')}>
                                    Eliminar
                                </button>) : <div></div> }
                            </div>
                            {reportMenuResponseVisible[index] && (
                                <div className='dp-aclaracion'>
                                    <div className="dp-report-menu">
                                        <select value={reportMenuResponseVisible[index]} onChange={(event) => selectReportReasonResponse(event, index)}>
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
                                            <button onClick={() => reportCommentResponse(index)} className="dp-report-menu-submit" disabled={!reportMenuResponseVisible[index] || submittingReport}>
                                                {submittingReport ? 'Enviando...' : 'Reportar'}
                                            </button>
                                            <button onClick={() => toggleReportMenuResponse(index)} className="dp-report-menu-cancel" disabled={submittingReport}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </div>
                                    <div className="dp-mensaje">
                                        <h3>Selecciona el motivo por el cual deseas reportar este comentario. El administrador revisará el reporte y tomará medidas frente al mismo.</h3>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
