import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import Busqueda from '../components/Busqueda.jsx';
import './Results_search.css';

function ResultsSearch() {
    const { tags } = useParams(); // Obtener los parámetros de la URL

    const tagsDictionary = [
        { label: 'Vegetariano', value: 1 },
        { label: 'Vegano', value: 2 },
        { label: 'Sin gluten', value: 3 },
        { label: 'Bajo en carbohidratos', value: 4 },
        { label: 'Alta en proteínas', value: 5 },
        { label: 'Postre', value: 6 },
        { label: 'Desayuno', value: 7 },
        { label: 'Almuerzo', value: 8 },
        { label: 'Cena', value: 9 },
        { label: 'Aperitivo', value: 10 }
    ];

    // Función para obtener los nombres de los tags
    const getTagNames = () => {
        if (!tags) return []; // Si no hay parámetros, retornar array vacío
        const tagValues = tags.split(',').map(Number); // Convertir los valores en un array de números
        return tagValues.map(value => {
            const tag = tagsDictionary.find(tag => tag.value === value);
            return tag ? tag.label : null;
        }).filter(Boolean); // Filtrar los valores indefinidos
    };

    const tagNames = getTagNames();

    return (
        <div className='up-container'>
            <div className='terms-container'>
                <div className='terms-logo-eslogan'>
                    <div className='terms-eslogan'>
                        <span className="terms-name-text2">Resultados de la busqueda</span>
                        <h1 className="terms-eslogan-text2">
                            Se encontraron X publicaciones con los tags: <strong>{tagNames.join(', ')}</strong>
                        </h1>
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
