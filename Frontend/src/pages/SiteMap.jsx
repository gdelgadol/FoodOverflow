import React, { useEffect, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { useNavigate } from 'react-router-dom';
import Logo_about_us from '../assets/Logo_about_us.png';
import "./SiteMap.css";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const SiteMap = () => {
  const navigate = useNavigate();
  const [graphWidth, setGraphWidth] = useState(window.innerWidth * 0.8);
  const [graphHeight, setGraphHeight] = useState(window.innerHeight * 0.8);

  useEffect(() => {
    const handleResize = () => {
      setGraphWidth(window.innerWidth * 0.8);
      setGraphHeight(window.innerHeight * 0.8);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const nodes = [
    { id: 'inicio', name: 'Inicio', path: '/' },
    { id: 'forum', name: 'Foro', path: '/forum' },
    { id: 'recuperar_contrasena', name: 'Recuperar Contraseña', path: '/recuperar_contrasena' },
    { id: 'restablecer_contrasena', name: 'Restablecer Contraseña', path: '/restablecer_contrasena/:uid/:token/' },
    { id: 'crear_publicacion', name: 'Crear Publicación', path: '/crear_publicacion' },
    { id: 'profile', name: 'Perfil', path: '/profile' },
    { id: 'change_email', name: 'Cambiar Email', path: '/change_email' },
    { id: 'change_password', name: 'Cambiar Contraseña', path: '/change_password' },
    { id: 'change_user', name: 'Cambiar Usuario', path: '/change_user' },
    { id: 'login', name: 'Iniciar Sesión', path: '/login' },
    { id: 'register', name: 'Registro', path: '/register' },
    { id: 'about', name: 'Acerca de', path: '/about' },
    { id: 'terms', name: 'Términos', path: '/terms' },
    { id: 'acuerdo', name: 'Acuerdo', path: '/acuerdo' },
    { id: 'user', name: 'Usuario', path: '/user/:username' },
    { id: 'saved_posts_user', name: 'Publicaciones Guardadas del Usuario', path: '/saved_posts_user' },
    { id: 'site-map', name: 'Mapa del Sitio', path: '/site-map' }
  ];

  const links = [
    { source: 'inicio', target: 'forum' },
    { source: 'user', target: 'profile' },
    { source: 'forum', target: 'recuperar_contrasena' },
    { source: 'recuperar_contrasena', target: 'restablecer_contrasena' },
    { source: 'profile', target: 'crear_publicacion' },
    { source: 'profile', target: 'change_email' },
    { source: 'profile', target: 'change_password' },
    { source: 'profile', target: 'change_user' },
    { source: 'inicio', target: 'login' },
    { source: 'login', target: 'register' },
    { source: 'inicio', target: 'about' },
    { source: 'inicio', target: 'terms' },
    { source: 'inicio', target: 'acuerdo' },
    { source: 'inicio', target: 'user' },
    { source: 'profile', target: 'saved_posts_user' },
    { source: 'inicio', target: 'site-map' }
  ];
  

  const graphData = {
    nodes,
    links
  };

  const handleNodeClick = (node) => {
    navigate(node.path);
  };

  return (
    <div className='contenedoor'>
      <div className='terms-container'>
        <div className='terms-logo-eslogan'>
          <img
            alt="Logo de Food Overflow"
            src={Logo_about_us}
            className='terms-logo'
          />
          <div className='terms-eslogan'>
            <span className="terms-name-text">Food Overflow</span>
            <h1 className="terms-eslogan-text">Mapa del sitio</h1>
          </div>
        </div>
      </div>
      <center>
      <div className="sitemap-container">
      <div className="sitemap-section">
        <h2>Páginas de Usuario</h2>
        <ul>
          <li><Link to="/profile">Perfil</Link></li>
          <li><Link to="/change_email">Cambiar Email</Link></li>
          <li><Link to="/change_password">Cambiar Contraseña</Link></li>
          <li><Link to="/change_user">Cambiar Usuario</Link></li>
          <li><Link to="/saved_posts_user">Publicaciones Guardadas</Link></li>
        </ul>
      </div>
      <div className="sitemap-section">
        <h2>Páginas Públicas</h2>
        <ul>
        <li><Link to="/forum">Foro</Link></li>
          <li><Link to="/">Inicio web</Link></li>
          <li><Link to="/about">Sobre Nosotros</Link></li>
        </ul>
      </div>
      <div className="sitemap-section">
        <h2>Autenticación</h2>
        <ul>
          <li><Link to="/login">Iniciar Sesión</Link></li>
          <li><Link to="/register">Registrarse</Link></li>
          <li><Link to="/recuperar_contrasena">Recuperar Contraseña</Link></li>
          <li><Link to="/restablecer_contrasena/123/token">Restablecer Contraseña</Link></li>
        </ul>
      </div>
      <div className="sitemap-section">
        <h2>Otros</h2>
        <ul>
          <li><Link to="/support">Apóyanos</Link></li>
          <li><Link to="/terms">Términos y Condiciones</Link></li>
          <li><Link to="/acuerdo">Acuerdo</Link></li>
        </ul>
      </div>
    </div>
    </center>
      <center>
        <div className='graph-container' style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="name"
          nodeAutoColorBy="group"
          onNodeClick={handleNodeClick}
          width={graphWidth}
          height={graphHeight}
          linkColor={() => 'rgba(255, 255, 255, 1)'}
          nodeCanvasObject={(node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const size = ctx.measureText(label);
            const padding = 4;
            const bkgDimensions = [size.width + padding * 2, size.actualBoundingBoxAscent + size.actualBoundingBoxDescent + padding * 2];
            ctx.fillStyle = '#ff5c00'; // Color de fondo de los nodos
            ctx.fillRect(node.x - bkgDimensions[0] / 2, node.y - bkgDimensions[1] / 2, ...bkgDimensions);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(node.x - bkgDimensions[0] / 2, node.y - bkgDimensions[1] / 2, ...bkgDimensions); // Borde del nodo
            ctx.fillStyle = 'black'; // Texto en negro
            ctx.fillText(label, node.x, node.y);
          }}
        enableZoomPanInteraction={false}
        enablePointerInteraction={true}
        d3ForceConfig={{
    link: { distance: 800, strength: 100 }, // Aumenta la distancia y ajusta la fuerza según sea necesario
    charge: { strength: -100, distanceMax: 100 } // Ajusta la fuerza de repulsión y la distancia máxima
  }}
/>
        </div>
      </center>
    </div>
  );
};

export default SiteMap;
