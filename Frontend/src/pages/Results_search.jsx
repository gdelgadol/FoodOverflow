import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import './Results_search.css';
import Busqueda from '../components/Busqueda.jsx';

function ResultsSearch() {
    const { tags } = useParams(); // Obtener los tags de la URL
    const [posts, setPosts] = useState([]);
    const [contador, setContador] = useState(0);
    const [contador2, setContador2] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10); // Número de publicaciones por página
    const [isLoading, setIsLoading] = useState(false);
    const [filtro_1, setFiltro_1] = useState("Recientes");
    const [filtro_2, setFiltro_2] = useState("recipe");
    const url = import.meta.env.VITE_API_URL;

    const maxPage = posts.length / postsPerPage;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.post(`${url}/publication/filter/`, {
                    tagsList: tags.split(',').map(tag => parseInt(tag)), // Convertir los tags de string a array de números enteros
                });
                console.log(tags.split(',').map(tag => parseInt(tag)));
                if (response.data.type === 'SUCCESS') {
                    //const sortedPosts = response.data.posts.sort((a, b) => b.id - a.id);
                    //setPosts(sortedPosts);
                    setContador2(response.data.number_posts2);
                    //console.log(response.data.number_posts);
                } else {
                    //alert(response.data.message);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 0);
            }
        };

        fetchData();
    }, [filtro_2, tags]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.post(`${url}/recipe/filter/`, {
                    tagsList: tags.split(',').map(tag => parseInt(tag)), // Convertir los tags de string a array de números enteros
                });
                console.log(tags.split(',').map(tag => parseInt(tag)));
                if (response.data.type === 'SUCCESS') {
                    //const sortedPosts = response.data.posts.sort((a, b) => b.id - a.id);
                    //setPosts(sortedPosts);
                    setContador(response.data.number_posts);
                    //console.log(response.data.number_posts);
                } else {
                    //alert(response.data.message);
                }
            } catch (error) {
                console.error('Error al obtener datos:', error);
            } finally {
                setTimeout(() => {
                    setIsLoading(false);
                }, 0);
            }
        };

        fetchData();
    }, [filtro_2, tags]);



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
        if (!tags) return []; 
        const tagValues = tags.split(',').map(Number); 
        return tagValues.map(value => {
            const tag = tagsDictionary.find(tag => tag.value === value);
            return tag ? tag.label : null;
        }).filter(Boolean); 
    };

    const tagNames = getTagNames();

    return (
        <div className='up-container'>
            <div className='terms-container'>
                <div className='terms-logo-eslogan'>
                    <div className='terms-eslogan'>
                        <span className="terms-name-text2">Resultados de la busqueda</span>
                        <br></br>
                        <h1 className="terms-eslogan-text2">
                            Se encontró <strong>{contador} receta(s) </strong> con los tags: <strong>{tagNames.join(', ')}</strong>
                        </h1>
                        <h1 className="terms-eslogan-text2">
                            Se encontró <strong>{contador2} pregunta(s) </strong> con los tags: <strong>{tagNames.join(', ')}</strong>
                        </h1>
                    </div>
                </div>
                <br></br>
                <Busqueda></Busqueda>
                <br></br>
            </div>
        </div>
    );
}

export default ResultsSearch;