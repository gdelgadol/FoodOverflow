import React from 'react';
import { useParams } from 'react-router-dom'; // Asumiendo que estás utilizando React Router

function Activate() {
  const { uid, token } = useParams(); // Obtener los parámetros de la URL

  return (
    <div>
      <p>Usuario: {uid}</p>
      <p>Token: {token}</p>
    </div>
  );
}

export default Activate;