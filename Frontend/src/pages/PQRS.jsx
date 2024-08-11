import React, { useEffect, useRef, useState } from 'react';
import axios from "../api/axios.jsx";
import "./PQRS.css";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function PQRS() {
    const url = import.meta.env.VITE_API_URL;
    const urlFront =  import.meta.env.VITE_FRONT_URL;

    const [selectedReason, setSelectedReason] = useState(null);

    const reasons = [
        { id: 1, title: 'Petición', description: 'Solicitudes o requerimientos que hace un usuario o cliente.', titleClass: "card-title"},
        { id: 2, title: 'Queja', description: 'Manifestaciones de inconformidad por parte del usuario o cliente sobre un servicio o producto.', titleClass: "card-title2" },
        { id: 3, title: 'Reclamo', description: 'Solicitud de corrección o compensación por un servicio o producto que no cumplió con las expectativas o condiciones pactadas.', titleClass: "card-title3" },
        { id: 4, title: 'Sugerencia', description: 'Propuestas o recomendaciones para mejorar los servicios o productos de la organización.', titleClass: "card-title4" },
      ];

    const [state, setState] = useState({
        nombre: "",
        correo: "",
        telefono: "",
        mensaje: ""
    });

    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    const handleInput = (event) => {
        setState({
          ...state,
          [event.target.name]: event.target.value,
        });
    };

    const handleSelectReason = (id) => {
        setSelectedReason(prevSelectedReason => prevSelectedReason === id ? null : id);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Verificar si el campo de correo electrónico es válido
        const isValidEmail = /\S+@\S+\.\S+/.test(state.correo);
          if (!isValidEmail) {
            setErrMsg("Ingrese un correo válido.");
            return;
        }
        const selectedReasonTitle = reasons.find(reason => reason.id === selectedReason)?.title || '';
        if (!selectedReasonTitle){
            setErrMsg("Debe seleccionar una razón para su solicitud.");
            return;
        }
        // Si la validación pasa, puedes enviar el formulario o hacer lo que necesites aquí
        sendPQRS(selectedReasonTitle);
    };

    const sendPQRS = (reasonTitle) => {
        axios
        .post(`${url}/send_pqrs`, {
            tipo: reasonTitle,
            nombre: state.nombre,
            correo: state.correo,
            telefono: state.telefono,
            mensaje: state.mensaje,
        })
        .then((res) => {
            if (res.data.type === "SUCCESS") {
            Swal.fire({
                title: `<strong>${res.data.message}</strong>`,
                icon: "success",
                timer: 4000,
                confirmButtonColor: "#27ae60",
            }).then((result) => {
                if (result.isConfirmed || result.isDenied) {
                    // Navigate to "/pqrs" and refresh the page
                    navigate("/pqrs");
                    window.location.reload();
                }
            });
            } else {
            Swal.fire({
                title: `<strong>${res.data.message}</strong>`,
                icon: "error",
                timer: 4000,
                confirmButtonColor: "#ff0000",
            });
            }
        });
    };

    return (
        <div className="su-container">
            <div className="product-card">
                <div className="product-info">
                    <h1 className="product-name">Preguntas, Quejas, Reclamos y Sugerencias</h1>
                    <p className="product-description2">
                    En Food Overflow, valoramos mucho tu opinión y experiencia. Para eso, hemos creado un formulario donde puedes compartir con nosotros tus peticiones, quejas, reclamos o sugerencias. Si tienes algo más específico que deseas contarnos, también puedes escribirnos directamente a foodoverflow@gmail.com. ¡Estamos comprometidos en responderte lo antes posible!
                    </p>
                    <h1
                    ref={errRef}
                    className={errMsg ? "errmsg li-h1-error " : "offscreen"}
                    aria-live="assertive"
                    >
                    {errMsg}
                    </h1>
                    {/* Reason Cards */}
                    <div className="reasons-container">
                        {reasons.map((reason) => (
                        <div
                            key={reason.id}
                            className={`reason-card ${selectedReason === reason.id ? 'selected' : ''}`}
                            onClick={() => handleSelectReason(reason.id)}
                        >
                            <center>
                            <h2 className={reason.titleClass}>{reason.title}</h2> {/* Dynamic title class */}
                            </center>
                            <p className="product-description">{reason.description}</p>
                        </div>
                        ))}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <p className="product-description2">Nombre</p>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                placeholder="Ingresa tu nombre"
                                required
                                onInput={(e) => {
                                    const value = e.target.value;
                                    // Allow only letters and spaces
                                    const regex = /^[A-Za-z\s]*$/;
                                    if (regex.test(value)) {
                                        handleInput(e);
                                    } else {
                                        e.target.value = value.slice(0, -1); // Remove invalid character
                                    }
                                }}
                            />
                        </div>
                        <div className="input-group">
                            <p className="product-description2">Correo</p>
                            <input
                                type="email"
                                id="correo"
                                name="correo"
                                placeholder="Ingresa tu correo electrónico"
                                required
                                onKeyDown={(e) => {
                                    if (e.key === ' ') e.preventDefault();
                                  }}
                                onChange={handleInput}
                            />
                        </div>
                        <div className="input-group">
                            <p className="product-description2">Teléfono</p>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                placeholder="Ingresa tu teléfono"
                                required
                                onInput={(e) => {
                                    const value = e.target.value;
                                    // Allow only 10 digit numbers
                                    const regex = /^\d{0,10}$/;
                                    if (regex.test(value)) {
                                        handleInput(e);
                                    } else {
                                        e.target.value = value.slice(0, -1); // Remove invalid character
                                    }
                                }}
                                
                            />
                        </div>
                        <div className="input-group">
                            <p className="product-description2">Mensaje</p>
                            <input
                                type="text"
                                id="mensaje"
                                name="mensaje"
                                placeholder="Ingresa el mensaje que nos quieres enviar"
                                required
                                onInput={(e) => {
                                    const value = e.target.value;
                                    // Allow only letters and spaces
                                    const regex = /^[A-Za-z\s]*$/;
                                    if (regex.test(value)) {
                                        handleInput(e);
                                    } else {
                                        e.target.value = value.slice(0, -1); // Remove invalid character
                                    }
                                }}
                            />
                        </div>
                        <button type="submit" className="register-button center-button">
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default PQRS;
