import Publicacion from "../components/Publicacion";
import Paginacion from "../components/Paginacion";
import { useEffect, useState } from "react";
import axios from "../api/axios.jsx";
import "./Home.css"
import Cookies from 'universal-cookie';

const Home = () => {

  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10); // Numero de post por pagina
  const [filtro_1, setFiltro_1] = useState("Recientes");
  const [filtro_2, setFiltro_2] = useState("Todas");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = "http://127.0.0.1:8000/forum/";
        if (filtro_2 === "Recetas") {
          url = "http://127.0.0.1:8000/recipes/";
        }
        const response = await axios.get(url);
        if (response.data.type === "SUCCESS") {
          setPosts(response.data.posts);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
  
    fetchData();
  }, [filtro_2]); // Se ejecuta nuevamente cuando el filtro_2 cambia

  const maxPage = posts.length / postsPerPage;

  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);

  return (
    <div className="posts-container">
      <div className="hm-filtro">
        <div className="hm-filtro-container">
          Ordenar por
          <select className="hm-filtro-select" onChange={(e) => setFiltro_1(e.target.value)}>
            <option value="Recientes">Recientes</option>
            <option value="Más votados">Más votados</option>
          </select>
          <select className="hm-filtro-select" onChange={(e) => setFiltro_2(e.target.value)}>
            <option value="Todas">Todas</option>
            <option value="Preguntas">Preguntas</option>
            <option value="Recetas">Recetas</option>
          </select>
        </div>
        <div className='hm-separator'></div>
      </div>
      {
        currentPosts.map((publicacion, index) => (
          <Publicacion
            key={index}
            id_post={publicacion.id}
            userName={publicacion.userName}
            title={publicacion.title}
            description={publicacion.description}
            numComments={publicacion.numComments}
            score={publicacion.score}
            // Mostrar la descripción solo si la publicación es una receta
            //recipeDescription={filtro_2 === "Recetas" ? posts.descriptions : null}
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

export default Home;
