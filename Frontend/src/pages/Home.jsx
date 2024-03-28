import Publicacion from "../components/Publicacion";
import Paginacion from "../components/Paginacion";
import { useEffect, useState } from "react";
import axios from "../api/axios.jsx";

const publicaciones = [
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'Llevo tiempo queriendo preparar una labor tan especial.',
    numComments: 8,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'Llevo tiempo queriendo preparar una labor tan especial.',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'Llevo tiempo queriendo preparar una labor tan especial.',
    numComments: 8,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'Llevo tiempo queriendo preparar una labor tan especial.',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'Llevo tiempo queriendo preparar una labor tan especial.',
    numComments: 8,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'Llevo tiempo queriendo preparar una labor tan especial.',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  },
  {
    userName: 'juan',
    title: 'Prueba',
    description: 'mvslkvskvnslkvnvsvns',
    numComments: 25000,
    score: 10
  }
]


const Home = () => {

  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [postsPerPage, setPostsPerPage] = useState(1) // Numero de post por pagina

  const maxPage = publicaciones.length / postsPerPage

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/home/");
        if (response.data.message === "SUCCESS") {
          setPosts(response.data);
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
  const currentPosts = publicaciones.slice(firstPostIndex, lastPostIndex);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
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
