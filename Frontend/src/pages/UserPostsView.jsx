import Publicacion from "../components/Publicacion";
import Paginacion from "../components/Paginacion";
import { useEffect, useState } from "react";
import axios from "../api/axios.jsx";
import "./Home.css"
import Cookies from 'universal-cookie';

const UserPostsView = () => {

  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(10) // Numero de post por pagina
  const [filtro_1, setFiltro_1] = useState("Recientes")
  const [filtro_2, setFiltro_2] = useState("recipes")
  const [isLoading, setIsLoading] = useState(false)

  const cookies = new Cookies();
  const jwt = cookies.get("auth_token");

  const maxPage = posts.length / postsPerPage

  useEffect(() => {
    const fetchData = async () => {
      try {
        //setIsLoading(true)
        const response = await axios.post(`http://127.0.0.1:8000/user/${filtro_2}/`, {
		jwt : jwt
	});
        if (response.data.type === "SUCCESS") {
          const sortedPosts = response.data.posts.sort((a, b) => a.id - b.id);
          setPosts(sortedPosts);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 0);
      }
    };
  
    fetchData();
  }, [filtro_2]);
  
  useEffect(() => {
    // Ordenar las publicaciones según el filtro seleccionado por el usuario
    if (filtro_1 === "Más votados") {
      setPosts([...posts.sort((a, b) => b.score - a.score)]);
    } else if (filtro_1 === "Recientes") {
      setPosts([...posts.sort((a, b) => a.id - b.id)]);
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
          </select>
          <select className="hm-filtro-select" onChange={(e) => setFiltro_2(e.target.value)}>
            <option value="recipes">Recetas</option>
            <option value="publications">Publicaciones</option>
          </select>
        </div>
        <div className='hm-separator'></div>
      </div>
      {
        currentPosts
        .map((publicacion, index) => (
          <Publicacion
            key={index}
            id_post={publicacion.id}
            userName={publicacion.userName}
            title={publicacion.title}
            description={publicacion.description}
            numComments={publicacion.numComments}
            score={publicacion.score}
            type={filtro_2}
          />
        ))
      }
      <Paginacion 
        currentPage={currentPage}
        maxPage={maxPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default UserPostsView;
