import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import Busqueda from '../components/Busqueda.jsx';

function ResultsSearch() {

    return (
        <div className='up-container'>
                    <div className='terms-container'>
            <div className='terms-logo-eslogan'>
                <div className='terms-eslogan'>
                    <span className="terms-name-text">Resultados de la busqueda</span>
                    <h1 className="terms-eslogan-text">Se encontraron X publicaciones</h1>
                </div>
            </div>
            <br></br>
            <Busqueda></Busqueda>
            <br></br>
        </div>
        </div>
    )

}

export default ResultsSearch;
