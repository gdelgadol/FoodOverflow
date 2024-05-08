import React, { useEffect, useState, useRef } from "react";
import { useRect } from "react-use-rect";
import './Inicio.css'

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
            color: "orangered"
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
    <div style={{ color: "Black", fontSize: "2rem" }}>
      En FoodOverflow puedes <SlideText source={mock} /> recetas y disfrutar
      del mundo de la comida
    </div>
  );
};

export default Inicio;
