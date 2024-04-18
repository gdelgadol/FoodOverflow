import { useState } from "react";
import "./Comentario.css";

export default function Comentario({ comment_id, comment_content, comment_user, response_list }) {
    const [showResponses, setShowResponses] = useState(false);
    const [inputReply, setInputReply] = useState(false);

    const toggleResponses = () => {
        setShowResponses(!showResponses);
    };

    const togleReply = () => {
        setInputReply(!inputReply);
    }

    return (
        <div className='comentario'>
            <div className='comentario-content'>
                <span className="comentario-content-user">{comment_user}</span>
                <span className='comentario-content-text'>{comment_content}</span>
                <div>
                    <button onClick={togleReply}>Responder</button>
                </div>
                {inputReply && (
                    <div className="comentario-reply">
                    <input
                      placeholder="Agrega una respuesta..."
                      className="dp-input-comment"
                      type="text"
                    />
                    <div className="dp-makeComment-buttons-cancel-comment">
                        <button
                          className="dp-button-cancel"
                          onClick={togleReply}
                        >
                          Cancelar
                        </button>
                        <button className="dp-button-comment">
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
                    <div key={index} className='comentario-content'>
                        <span className="comentario-content-user">{response.response_user}</span>
                        <span className='comentario-content-text'>{response.response_content}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
