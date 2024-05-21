import React, { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from "../api/axios.jsx";
import "./SupportUs.css";

function SupportUs() {
    const url = import.meta.env.VITE_API_URL;
    const [preferenceId, setPreferenceId] = useState(null);
    const [donationAmount, setDonationAmount] = useState(''); // Inicializado como cadena vacía

    initMercadoPago('APP_USR-6221fd0d-567a-473a-87ea-59d65a82ef03', {
        locale: 'es-CO',
    });

    const handleBuy = async () => {
        const amount = Number(donationAmount);
        if (amount < 5000) {
            alert('El monto mínimo de donación es $5000 COP.');
            return;
        }

        try {
            const productData = {
                title: 'Donación Food Overflow',
                quantity: 1,
                unit_price: amount
            };

            const response = await axios.post(`${url}/create_preference/`, productData);

            if (response.data.id) {
                setPreferenceId(response.data.id);
            }
        } catch (error) {
            console.error('Error al crear la preferencia:', error);
        }
    };

    const customization = {
        visual: {
            buttonBackground: 'black',
            borderRadius: '10px',
        },

        texts: {
            action: 'pay',
            valueProp: '',
        },
       }

    return (
        <div className="su-container">
            <div className="product-card">
                <div className="product-info">
                    <h1 className="product-name">Donación Food Overflow</h1>
                    <p className="product-description">
                    En Food Overflow, nos enorgullece ofrecer un espacio dinámico y colaborativo donde los amantes de la cocina pueden compartir su pasión, explorar nuevas recetas y aprender unos de otros. Nuestra comunidad, compuesta por diferentes tipos de personas, es sin duda, nuestra mayor motivación para seguir avanzando con este proyecto.
                    </p>
                    <p className="product-description">
                    Sin embargo, mantener esta plataforma en funcionamiento no es tarea fácil. Aunque nos esforzamos por ofrecer nuestros servicios de forma gratuita para todos, también dependemos de ingresos para cubrir los costos de mantenimiento del sitio, el desarrollo de nuevas características y la expansión de nuestra comunidad. Es por eso que las donaciones de nuestros usuarios son vitales para nuestro éxito continuo.
                    </p>
                    <p className="product-description">
                    Cada contribución que recibimos nos ayuda a seguir mejorando y creciendo, asegurando que podamos continuar ofreciendo un espacio enriquecedor y acogedor para todos los amantes de la cocina. Apreciamos profundamente el apoyo de nuestra comunidad y estamos comprometidos a seguir sirviéndoles con excelencia en los años venideros. Si deseas apoyarnos, ¡te lo agradecemos de todo corazón!
                    </p>
                    <p className="product-description">
                    El monto minimo es de $5000 pesos Colombianos, tenemos disponibles todos los medios de pago (Tarjetas de crédito, débito, Nequi, Daviplata, PSE y efectivo) y puedes hacerlo a continuación:
                    </p>
                    <div className='content-pago'>
                    <center>
                    <div className='pago'>
                    <p className='valor'>$</p>
                    <input
                        type="number"
                        className="donation-input"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        min="5000"
                        placeholder="El monto mínimo es $5000 COP"
                    />
                    <p className='valor2'>COP</p>
                    </div>
                    </center>
                    <center>
                    <button className="buy-button" onClick={handleBuy}>Generar link para donar</button>
                    <div className='mp'>
                    {preferenceId && <Wallet initialization={{ preferenceId: preferenceId, redirectMode: 'blank'}} customization={customization} />}
                    </div>
                    </center>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SupportUs;
