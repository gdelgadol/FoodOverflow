import React, { useState } from 'react';
import axios from 'axios';
import './Encabezado.css';
import iconoImg from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import Cookies from 'universal-cookie';
import Creatable from 'react-select/creatable';

function Encabezado() {
  const cookies = new Cookies();
  const jwt = cookies.get('auth_token');
  const navigate = useNavigate(); // Usamos useNavigate para la navegación

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuUsuarioOpen, setMenuUsuarioOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const urlFront = import.meta.env.VITE_FRONT_URL;
  const url = import.meta.env.VITE_API_URL;

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleMenuUsuario = () => {
    setMenuUsuarioOpen(!menuUsuarioOpen);
  };

  const handleLogout = () => {
    cookies.remove('auth_token', { path: '/' });
    setTimeout(() => {
      window.location.href = `${urlFront}/login`;
    }, 500);
  };

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
      const tagsParam = selectedValues.join(',');
      navigate(`/results_search/${tagsParam}`); // Navegamos a la ruta de búsqueda con los tags en la URL
    } catch (error) {
      console.error('Error al realizar la búsqueda:', error);
    }
  };

  return (
    <div className="header">
      <button className="menu-toggle" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </button>
      <Link to={'/'}>
        <div className="icon-header">
          <img
            src={iconoImg}
            alt="Icono de la página"
            style={{ width: '37px', height: '43px' }}
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
          <Link to={'/'}>
            <button className="menu-button">
              <span className="spanHeader">Inicio</span>
            </button>
          </Link>
          <Link to={'/about'}>
            <button className="menu-button">
              <span className="spanHeader">Sobre nosotros</span>
            </button>
          </Link>
          <Link to={'/support'}>
            <button className="menu-button">
              <span className="spanHeader">Apóyanos</span>
            </button>
          </Link>
          <div className="separator"></div>
        </div>
        {jwt ? (
          <>
            <Link to={'/crear_publicacion'}>
              <button className="menu-button2">
                <strong>Publicar</strong>
              </button>
            </Link>
            <button className="menu-button3" onClick={toggleMenuUsuario}>
              <strong>Usuario</strong>
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
          <Link to={'/profile'}>
            <button className="menu-button-user" onClick={toggleMenuUsuario}>
              <span className="spanHeader">Configuración de la cuenta</span>
            </button>
          </Link>
          <Link to={'/user/profile'}>
            <button className="menu-button-user" onClick={toggleMenuUsuario}>
              <span className="spanHeader">Mi perfil</span>
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
          <Link to={'/About'}>
            <button className="menu-button">
              <center>
                <strong>Sobre nosotros</strong>
              </center>
            </button>
          </Link>
          <Link to={'/Apoyanos'}>
            <button className="menu-button">
              <center>
                <strong>Apóyanos</strong>
              </center>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Encabezado;
