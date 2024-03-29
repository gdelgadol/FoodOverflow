import Publicacion from "../components/Publicacion";
import Paginacion from "../components/Paginacion";
import { useEffect, useState } from "react";
import axios from "../api/axios.jsx";
import "./Home.css"
import Cookies from 'universal-cookie';

const Home = () => {

  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(1) // Numero de post por pagina
  const [filtro_1, setFiltro_1] = useState()
  const [filtro_2, setFiltro_2] = useState()

  const maxPage = posts.length / postsPerPage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/forum/");
        if (response.data.type === "SUCCESS") {
          setPosts(response.data.posts);
          console.log("AQUI")
          console.log(response.data);
        } else {
          alert(response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
  
    fetchData();
  }, []);
  
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = posts.slice(firstPostIndex, lastPostIndex);

  // Consultar la cookie creada
  /*const cookies = new Cookies();
  const jwt = cookies.get("auth_token");

  if(jwt){ 
  // Si la cookie existe se hace una petición al back para devolver el username (Depende de qué necesita miramos qué retorna este post)
    axios
        .post("http://127.0.0.1:8000/user_token/", {
          jwt: jwt,
        })
        .then((res) => {
          const username = res.data.username;
          console.log(username);
        });
    }*/
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
            userName={publicacion.userName}
            title={publicacion.title}
            description={publicacion.description}
            numComments={publicacion.numComments}
            score={publicacion.score}
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
