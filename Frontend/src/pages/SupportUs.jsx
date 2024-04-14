import Logo_about_us from '../assets/Logo_about_us.png';
import "./SupportUs.css";
import logo_nequi from "../assets/nequi.png";
import logo_paypal from "../assets/paypal.png";
import qr from "../assets/qr.png";
import React, { useState } from 'react';

function SupportUs() {
    const [qrVisible, setQrVisible] = useState(false)
    const mostrarQr = () => {
        setQrVisible(true)
    }
    const ocultarQr = () => {
        setQrVisible(false)
    }
    return (
        <div className="su-container">
            <div className="su-logo-container">
                <img
                    alt="Logo de Food Overflow"
                    src={Logo_about_us}
                    className='su-logo-food'
                />
                <h1 className='su-logo-text'>Puedes apoyar a la comunidad Food Overflow
                    con una donación</h1>
            </div>
            <div className='su-pagos-container'>
                <button className='su-pago-button'>
                    <div className='su-pago'>
                    <img
                    alt="Logo de Paypal"
                    src={logo_paypal}
                    className='su-logo'
                    />
                    </div>
                </button>
                <button className='su-pago-button' onClick={mostrarQr}>
                    <div className='su-pago'>
                    <img
                    alt="Logo de Nequi"
                    src={logo_nequi}
                    className='su-logo'
                    />
                    </div>
                </button>
            </div>
            {qrVisible && (
                <div className="modal" onClick={ocultarQr}>
                    <div className="modal-content">
                        <img src={qr} alt="QR Code" />
                        <span className="close" onClick={ocultarQr}>&times;</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SupportUs