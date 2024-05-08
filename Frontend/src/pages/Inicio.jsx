import React, { useEffect, useState, useRef } from "react";
import { useRect } from "react-use-rect";
import './Inicio.css'
import iconoBlanco from "../assets/logo-blanco.png";
import { Link } from "react-router-dom";

const mock = ["crear", "preguntar", "comentar", "valorar"];

const SlideText = ({ source }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [rect, setRect] = useState(null);
  const [rectRef] = useRect(setRect);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentItemIndex((index) =>
        index === source.length - 1 ? 0 : index + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [currentItemIndex, source]);

  return (
    <div
      style={{
        display: "inline-flex",
        overflow: "hidden",
        position: "relative",
        width: `${rect?.width}px`,
        transition: "all 0.5s ease-in-out",
      }}
    >
      <span style={{ visibility: "hidden" }}>{source[currentItemIndex]}</span>
      {source.map((text, index) => (
        <span
          key={index}
          ref={currentItemIndex === index ? rectRef : null}
          style={{
            position: "absolute",
            top: (rect?.height ?? 0) * 2,
            transform: `translateY(${
              currentItemIndex === index ? `-${(rect?.height ?? 0) * 2}px` : 0
            })`,
            transition: "all 1s ease-in-out",
            color: "#ff7525",
            fontWeight: "bold",
          }}
        >
          {text}
        </span>
      ))}
    </div>
  );
};

const Inicio = () => {
  return (
    <div className="in-container">
      <div className="in-message">
        <div>
          <img
            alt="Logo de Food Overflow"
            src={iconoBlanco}
            className="in-logo-food"
          />
        </div>
        <div className="in-text">
          <span className="in-name">
            Food Overflow
          </span>
          <br />
          Un foro donde puedes <SlideText source={mock} /> recetas y
          <br />
          <span>
            disfrutar del mundo de la comida.
          </span>
        </div>
      </div>
      <div className="in-unete">
        <Link to={'/register'}>
          <button className="in-unete-button">Únete a la comunidad</button>
        </Link>
        <div style={{color: "white"}}>
          o
          <Link to={'/forum'}>
          <button className="in-buscar">explora el foro</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
