import { useState, useEffect } from "react";
import "./Comentario.css";
import axios from "../api/axios.jsx";
import Cookies from "universal-cookie";

export default function Comentario({ jwt, reload, setReload, post_id, comment_id, comment_content, comment_user, comment_user_avatar, response_list, type }) {
    const [showResponses, setShowResponses] = useState(false);
    const [inputReply, setInputReply] = useState(false);
    const [response, setResponse] = useState('');

    const url =  import.meta.env.VITE_API_URL;

    const toggleResponses = () => {
        setShowResponses(!showResponses);
    };

    const togleReply = () => {
        setInputReply(!inputReply);
    }

    const sendResponse = async () => {
        try {
            const res = await axios.post(`${url}/comment/${type}/response/`, {
                post_id: post_id,
                comment_id: comment_id,
                content: response,
                jwt: jwt
            })
            if (res.data.type === "SUCCESS") {
                alert(res.data.message)
                setResponse('')
                setInputReply(false)
                setReload(!reload);
            } else {
                alert(res.data.message)
            }
        } catch (error) {
            console.error("Error al realizar la solicitud:", error);
        }
    }

    const handleChangeResponse = (event) => {
        const reply = event.target.value;
        setResponse(reply);
      };

    const avisoIniciarSesion = () => {
        alert("Debes iniciar sesión para reponder al comentario");
    }

    const renderContent = (content) => {
        // Expresión regular para detectar URLs en el texto
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        // Reemplaza las URLs encontradas por un enlace clickeable
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
                    <button className="commentario-reply-button" onClick={jwt ? togleReply : avisoIniciarSesion}>Responder</button>
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
                          onClick={togleReply}
                        >
                          Cancelar
                        </button>
                        <button className="dp-button-comment" onClick={sendResponse}>
                          Comentar
                        </button>
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
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
