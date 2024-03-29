import Publicacion from "../components/Publicacion";
import Paginacion from "../components/Paginacion";
import { useEffect, useState } from "react";
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';

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
  const [postsPerPage, setPostsPerPage] = useState(10) // Numero de post por pagina

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
