import { useEffect, useState } from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import './Results_search.css';
import Busqueda from '../components/Busqueda.jsx';
import Profile from '../components/Profiles_search.jsx';
import tagsDictionaryLoaded from "../../labels.json";

function ResultsSearch() {
    const { tags } = useParams(); // Obtener los tags de la URL
    const [posts, setPosts] = useState([]);
    const [searchItem, setSearchItem] = useState();
    const [searchContent, setContent] = useState();
    const [contador, setContador] = useState(0);
    const [contador2, setContador2] = useState(0);
    const [profiles, setProfiles] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10); // Número de publicaciones por página
    const [isLoading, setIsLoading] = useState(false);
    const [filtro_1, setFiltro_1] = useState("Recientes");
    const [filtro_2, setFiltro_2] = useState("recipe");
    const url = import.meta.env.VITE_API_URL;

    const navigate = useNavigate();

    const maxPage = posts.length / postsPerPage;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const search = tags.split("=")[0];
                setSearchItem(search);
                const content = tags.slice(search.length+1);
                setContent(content);

                var response = {};

                if(search === "buscar_tags"){
                    response = await axios.post(`${url}/publication/filter/`, {
                        tagsList: content.split(',').map(tag => parseInt(tag)), // Convertir los tags de string a array de números enteros
                    });
                    if (response.data.type === 'SUCCESS') {
                        setContador2(response.data.number_posts2);
                    } 
                }else if(search === "buscar_posts"){
                    response = await axios.post(`${url}/publications/`, {
                        search : content,
                    });
                    if (response.data.type === 'SUCCESS') {
                        setContador2(response.data.number_posts2);
                    } 
                }else if(search === "buscar_perfiles"){
                    response = await axios.post(`${url}/search_users/`, {
                        search : content,
                    });
                    if (response.data.type === 'SUCCESS') {
                        setContador(response.data.num_results);
                        setProfiles(response.data.profiles);
                        console.log(profiles, response.data.profiles);
                    } 
                }else{
                    navigate('/*');
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
                const search = tags.split("=")[0];
                setSearchItem(search);
                const content = tags.slice(search.length+1);
                setContent(content);

                var response = {};
                if(search === "buscar_tags"){
                    response = await axios.post(`${url}/recipe/filter/`, {
                        tagsList: content.split(',').map(tag => parseInt(tag)), // Convertir los tags de string a array de números enteros
                    });
                    if (response.data.type === 'SUCCESS') {
                        setContador(response.data.number_posts);
                    }
                }else if(search === "buscar_posts"){
                    response = await axios.post(`${url}/recipes/`, {
                        search: content, // Convertir los tags de string a array de números enteros
                    });
                    if (response.data.type === 'SUCCESS') {
                        setContador(response.data.number_posts);
                    }
                }else if(search === "buscar_perfiles"){
                    response = await axios.post(`${url}/search_users/`, {
                        search : content,
                    });
                    if (response.data.type === 'SUCCESS') {
                        setContador(response.data.num_results);
                        setProfiles(response.data.profiles);
                    } 
                }else{
                    navigate('/*');
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



    const tagsDictionary = [];
    for(let key in tagsDictionaryLoaded){
        tagsDictionary.push({label : tagsDictionaryLoaded[key], value: parseInt(key)})
    }

    // Función para obtener los nombres de los tags
    const getTagNames = () => {
        const search = tags.split("=")[0];
        const content = tags.slice(search.length+1);
        if (!content) return []; 
        const tagValues = content.split(',').map(Number); 
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
                        {searchItem === "buscar_perfiles" ? 
                        <h1 className="terms-eslogan-text2">
                            Se encontraron <strong>{contador} {contador ===1? 'perfil' : 'perfiles'}</strong> cuyo nombre de usuario o descripción contienen: <strong>{searchContent}</strong>
                        </h1>:
                        <h1 className="terms-eslogan-text2">
                            Se encontraron <strong>{contador} {contador ===1? 'receta' : 'recetas'} </strong> y <strong>{contador2} {contador2 ===1? 'publicación' : 'publicaciones'}</strong>
                        </h1>}
                        {searchItem === "buscar_tags" ?
                        <h1 className="terms-eslogan-text2">
                            con los tags: <strong>{tagNames.join(', ')}</strong>
                        </h1>: <></>}
                        {searchItem === "buscar_posts" ?
                        <h1 className="terms-eslogan-text2">
                            cuyo título contiene: <strong>{searchContent}</strong>
                        </h1> : <></>}
                    </div>
                </div>
                <br></br>
                {searchItem !== "buscar_perfiles" ? <Busqueda></Busqueda> : 
                profiles.map((profile) => (
                    <Profile 
                    username={profile.username}
                    description={profile.description}
                    avatar={profile.avatar}
                    recipes={profile.recipes}
                    publications={profile.publications}
                    ></Profile>
                    ))
                }
                <br></br>
            </div>
        </div>
    );
}

export default ResultsSearch;