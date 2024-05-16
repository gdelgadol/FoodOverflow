import './Encabezado.css';
import iconoImg from '../assets/logo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Importamos useNavigate
import Cookies from 'universal-cookie';
import Creatable from 'react-select/creatable';
import React, { useState, useEffect } from 'react';
import "./Encabezado.css";
import axios from "../api/axios.jsx";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import Swal from 'sweetalert2';
import tagsDictionaryLoaded from "../../labels.json";

function Encabezado() {
  const [userInfo, setUserInfo] = useState({
    username: '',
    avatar: ''
  })
  const [notificaciones, setNotificaciones] = useState([])
  const [notificationClicked, setNotificationClicked] = useState(false);
  
  const cookies = new Cookies();
  const jwt = cookies.get('auth_token');
  const navigate = useNavigate(); // Usamos useNavigate para la navegación

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUsuarioOpen, setMenuUsuarioOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const urlFront = import.meta.env.VITE_FRONT_URL;
  const url = import.meta.env.VITE_API_URL;
  const [menuNotificacionOpen, setMenuNotificacionOpen] = useState(false);
  const location = useLocation(); // Usamos useLocation para obtener la ruta actual

  // useEffect(() => {
  //   // Limpiar las etiquetas seleccionadas cuando la ruta cambie
  //   setSelectedTags([]);
  // }, [location.pathname]); // Ejecutar el efecto cuando la ruta cambie


  const toggleMenu = () => {
    if (menuUsuarioOpen) {setMenuUsuarioOpen(false)}
    if (menuNotificacionOpen) {setMenuNotificacionOpen(false)}
    setMenuOpen(!menuOpen);
  };

  const toggleMenuUsuario = () => {
    if (menuOpen) {setMenuOpen(false)}
    if (menuNotificacionOpen) {setMenuNotificacionOpen(false)}
    setMenuUsuarioOpen(!menuUsuarioOpen);
  };

  const toggleMenuNotificacion = () => {
    setNotificationClicked(!notificationClicked);
    if (menuUsuarioOpen) {setMenuUsuarioOpen(false)}
    if (menuOpen) {setMenuOpen(false)}
    setMenuNotificacionOpen(!menuNotificacionOpen);
  }

  const handleLogout = () => {
    cookies.remove('auth_token', { path: '/' });
    setTimeout(() => {
      window.location.href = `${urlFront}/login`;
    }, 500);
  };

  const tagsDictionary = [];
  for(let key in tagsDictionaryLoaded){
    tagsDictionary.push({label : tagsDictionaryLoaded[key], value: parseInt(key)})
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '25vw',
      borderColor: '#ccc',
      '&:focus': {
        borderColor: '#ff5c00',
      },
    }),

    placeholder: (provided, state) => ({
      ...provided,
      marginLeft: '10px',
    }),
  };

  const submitSearch = async () => {
    try {
      const selectedValues = selectedTags.map(tag => tag.value);
      if(selectedValues.length === 0) {
        // Mostrar la página de resultados con cero tags y cero resultados
        //alert("Debes introducir al menos un tag para buscar")
        Swal.fire({
          title: "<strong> Debes introducir al menos un tag para buscar </strong>",
          icon: "error",
          timer: 4000,
          confirmButtonColor: "#ff0000",
        });
        navigate(`/forum`)
        //return navigate('/results_search/0');
      } else { 
      const tagsParam = selectedValues.join(',');
      navigate(`/results_search/${tagsParam}`); // Navegamos a la ruta de búsqueda con los tags en la URL
      //window.location.reload(); // Recargar la página para mostrar los resultados
      }
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  const BorrarNotificacion = (notification_id) => {
    setNotificaciones(prevNotificaciones => prevNotificaciones.filter(notification => notification.notification_id !== notification_id));
    axios.post(`${url}/notifications/delete/`, {
      jwt: jwt,
      notification_id: notification_id,
    })
   .then((res) => {
      console.log(res.data.message);
   })
   .catch((error) => {
      console.error("Error al borrar notificación:", error);
    })
  }

  useEffect(() => {
    if (jwt) {
      axios.post(`${url}/get_user/profile`, {
        jwt: jwt,
      })
      .then((res) => {
        setUserInfo({
            username: res.data.username,
            avatar: res.data.avatar
        })
      })
      .catch((error) => {
        console.error("Error al obtener datos del usuario:", error);
      })
    }
  }, []);

  useEffect(() => {
    const fetchNotifications = () => {
      if (jwt) {
        axios.post(`${url}/notifications/`, {
          jwt: jwt,
        })
        .then((res) => {
          setNotificaciones(res.data.notifications);
          //console.log(res.data.notifications);
        })
        .catch((error) => {
          console.error("Error al obtener datos del usuario:", error);
        });
      }
    };
  
    // Llamar a la función inicialmente y luego repetirla cada 30 segundos
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
  
    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [jwt, url]);
  

  return (
    <div className="header">
      <button className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </button>
      <Link to={"/forum"}>
      <div className="icon-header">
        <img
          src={iconoImg}
          alt="Icono de la página"
          style={{ width: "37px", height: "43px" }}
        />
        <div className="logo">FoodOverflow</div>
      </div>
      </Link>
      <div className="search">
        <Creatable
          className="search-select"
          placeholder="Buscar"
          options={tagsDictionary}
          isMulti
          value={selectedTags}
          onChange={selectedOptions => setSelectedTags(selectedOptions)}
          styles={customStyles}
        />
        <button className="search-button" onClick={submitSearch}>
          <strong>Buscar</strong>
        </button>
      </div>
      <div className="menu">
        <div className="menu-info">
        <Link to={"/"}>
        <button className="menu-button">
          <span className="spanHeader">Inicio</span>
        </button>
        </Link>
        <Link to={"/forum"}>
        <button className="menu-button">
          <span className="spanHeader">Foro</span>
        </button>
        </Link>
        <Link to={"/about"}>
        <button className="menu-button">
        <span className="spanHeader">Sobre nosotros</span>
        </button>
        </Link>
        <Link to={"/support"}>
        <button className="menu-button">
          <span className="spanHeader">Apóyanos</span>
        </button>
        </Link>
        <div className="separator"></div>
        </div>
        {jwt ? (
          <>
            <Link to={"/crear_publicacion"}>
              <button className="menu-button-publicar">
                <strong>Publicar</strong> 
              </button>
            </Link>
            <button className='menu-button-notification'  onClick={toggleMenuNotificacion}>
              {notificationClicked ? <IoMdNotifications size={35} /> : <IoMdNotificationsOutline size={35} />}
              {notificaciones.length > 0 && (
                <span className="notification-badge">{notificaciones.length}</span>
              )}
            </button>
            <button className="menu-button-userAvatar" onClick={toggleMenuUsuario}>
              <img
                className='menu-userAvatar'
                src={userInfo.avatar} alt='user-img' />
            </button>
          </>
        ) : (
          <>
            <Link to={'/login'}>
              <button className="menu-button2">
                <strong>Iniciar sesión</strong>
              </button>
            </Link>
            <Link to={'/register'}>
              <button className="menu-button3">
                <strong>Registrarse</strong>
              </button>
            </Link>
          </>
        )}
      </div>

      {menuUsuarioOpen && (
        <div className="menu-usuario">
          <Link to={"/user/profile"}>
            <button className='menu-button-profile' onClick={toggleMenuUsuario}>
            <div className='menu-username-avatar'>
              <img
                className='menu-userAvatar'
                src={userInfo.avatar} alt='user-img' />
              <div style={{display: "flex", flexDirection: "column"}}>
                <span className='spanHeader'>Ver mi perfil</span>
                <span style={{fontSize: "13px", fontWeight: "400"}}>{userInfo.username}</span>
              </div>
            </div>
          </button>
          </Link>
          <Link to={"/profile"}>
          <button className="menu-button-user" onClick={toggleMenuUsuario}>
            <span className="spanHeader">Configuración de la cuenta</span>
          </button>
          </Link>
          <div className="separator-user-menu"></div>
          <button className="menu-button-user" onClick={handleLogout}>
            <span className="spanHeader">Cerrar sesión</span>
          </button>
        </div>
      )}

      {menuOpen && (
        <div className="menu-dropdown">
          <Link to={'/'}>
            <button className="menu-button">
              <center>
                <strong>Inicio</strong>
              </center>
            </button>
          </Link>
          <Link to={'forum'}>
            <button className="menu-button">
              <center>
                <strong>Foro</strong>
              </center>
            </button>
          </Link>
          <Link to={'/About'}>
            <button className="menu-button">
              <center>
                <strong>Sobre nosotros</strong>
              </center>
            </button>
          </Link>
          <Link to={'/support'}>
            <button className="menu-button">
              <center>
                <strong>Apóyanos</strong>
              </center>
            </button>
          </Link>
          <center>
          <div className="search-drop-menu">
          <Creatable
          className="search-select"
          placeholder="Buscar"
          options={tagsDictionary}
          isMulti
          value={selectedTags}
          onChange={selectedOptions => setSelectedTags(selectedOptions)}
          styles={customStyles}
          />
          <button className="search-button" onClick={submitSearch}>
            <strong>Buscar</strong>
          </button>
        </div>
        </center>
        </div>
      )}
      {/* Menú de notificaciones */}
      {menuNotificacionOpen && (
        <>
          {menuNotificacionOpen && (
            <div className="menu-notificacion">
              {notificaciones.length > 0 ? (
                notificaciones.map((notification) => (
                  <Link key={notification.notification_id} to={`${notification.url}`}>
                    <button className="menu-button-notification" onClick={() => BorrarNotificacion(notification.notification_id)}>
                      <span className="span-notification">{notification.message}</span>
                    </button>
                  </Link>
                ))
              ) : (
                <div className="menu-button-notification">
                  <span className="spanHeader">No tienes notificaciones</span>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Encabezado;
