import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Publicacion from './Publicacion';
import Paginacion from './Paginacion';
import { useParams } from 'react-router-dom';
import '../pages/Home.css';
import '../pages/Results_search.css';
import Cookies from 'universal-cookie';

const Busqueda = () => {
  const { tags } = useParams(); // Obtenemos los tags de la URL
  const [posts, setPosts] = useState([]);
  const [contador, setContador] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10); // Número de publicaciones por página
  const [isLoading, setIsLoading] = useState(false);
  const [filtro_1, setFiltro_1] = useState("Recientes")
  const [filtro_2, setFiltro_2] = useState("recipe")
  const url = import.meta.env.VITE_API_URL;

  const maxPage = posts.length / postsPerPage

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(`${url}/${filtro_2}/filter/`, {
          tagsList: tags.split(',').map(tag => parseInt(tag)), // Convertimos los tags de string a array de números enteros
        });
        console.log(tags.split(',').map(tag => parseInt(tag)));
        if (response.data.type === 'SUCCESS') {
          const sortedPosts = response.data.posts.sort((a, b) => b.id - a.id);
          setPosts(sortedPosts);
          setContador(response.data.number_posts);
        } else {
          alert(response.data.message);
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
    // Ordenar las publicaciones según el filtro seleccionado por el usuario
    if (filtro_1 === "Más votados") {
      setPosts([...posts.sort((a, b) => b.score - a.score)]);
    } else if (filtro_1 === "Recientes") {
      setPosts([...posts.sort((a, b) => b.id - a.id)]);
    }else if (filtro_1 === "Más interacción") {
      setPosts([...posts.sort((a, b) => b.numComments - a.numComments)]);
    }
  }, [filtro_1]);
  
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="posts-container">
      {isLoading && (
        <div className="hm-modal">
        </div>
      )}
      <div className="hm-filtro">
        <div className="hm-filtro-container">
          Ordenar por
          <select className="hm-filtro-select" onChange={(e) => setFiltro_1(e.target.value)}>
            <option value="Recientes">Recientes</option>
            <option value="Más votados">Más votados</option>
            <option value="Más interacción">Más interacción</option>
          </select>
          <select className="hm-filtro-select" onChange={(e) => setFiltro_2(e.target.value)}>
            <option value="recipe">Recetas</option>
            <option value="publication">Publicaciones</option>
          </select>
        </div>
        <div className='hm-separator'></div>
      </div>
      {currentPosts.map((publicacion, index) => (
        <Publicacion
        key={index}
        id_post={publicacion.id}
        userName={publicacion.userName}
        profile_avatar={publicacion.profile_avatar}
        title={publicacion.title}
        description={publicacion.description}
        numComments={publicacion.numComments}
        score={publicacion.score}
        tags={publicacion.tagsList}
        type={filtro_2}
        />
      ))}
      <Paginacion
        currentPage={currentPage}
        maxPage={maxPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default Busqueda;