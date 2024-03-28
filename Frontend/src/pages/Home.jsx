import Cookies from 'universal-cookie';
import axios from "../api/axios.jsx";

const Home = () => {
  // Consultar la cookie creada
  const cookies = new Cookies();
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
    };

  return (
    <>
      <h1>Bienvenido Username (No supe como sacarlo a este entorno :v)</h1>
    </>
  );
};
export default Home;
