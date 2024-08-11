import React, { useState, useEffect } from "react";
import "./Questions.css";

const faqData = [
  {
    question: "1. ¿Puedo ver recetas, valoraciones y comentarios sin iniciar sesión?",
    answer: "¡Sí! En FoodOverflow, puedes explorar todas las recetas, leer valoraciones y ver comentarios sin necesidad de iniciar sesión. Queremos que descubras deliciosas recetas sin complicaciones."
  },
  {
    question: "2. ¿Hay un límite para crear recetas o realizar preguntas?",
    answer: "¡No hay límite! Puedes crear tantas recetas y realizar tantas preguntas como desees. La creatividad y la curiosidad son bienvenidas en FoodOverflow."
  },
  {
    question: "3. ¿Qué hago si veo una publicación inapropiada?",
    answer: "Si te encuentras con una publicación inapropiada, puedes reportarla fácilmente haciendo clic en el botón 'Reportar Publicación'. Ayúdanos a mantener la comunidad segura y amigable."
  },
  {
    question: "4. ¿Puedo filtrar las recetas y publicaciones según valoraciones y fecha?",
    answer: "¡Por supuesto! Puedes filtrar las recetas y publicaciones según sus valoraciones o por las más recientes, para encontrar lo que realmente te interesa."
  },
  {
    question: "5. ¿Puedo guardar una receta que me ha llamado la atención?",
    answer: "¡Sí! Si encuentras una receta que te encanta, puedes guardarla en tu perfil para revisarla más tarde. ¡Nunca te perderás de una buena receta!"
  },
  {
    question: "6. ¿Cómo reporto un comentario inapropiado?",
    answer: "Si ves un comentario inapropiado, también puedes reportarlo. Solo haz clic en el botón de 'Reportar Comentario' para que podamos revisarlo."
  },
  {
    question: "7. ¿Qué hago si cometí un error en mis datos personales?",
    answer: "No te preocupes, puedes corregir cualquier error en la sección de 'Configuración de la Cuenta'. Simplemente haz clic en el ícono de tu perfil para acceder a las configuraciones."
  },
  {
    question: "8. ¿Puedo borrar mi cuenta?",
    answer: "Si decides que quieres borrar tu cuenta, puedes hacerlo en la sección de 'Configuración de la Cuenta'. Queremos que tengas el control total sobre tu experiencia en FoodOverflow."
  }
];

function Questions() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 900);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 900);
      if (window.innerWidth >= 900) {
        setActiveIndex(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClick = (index) => {
    if (!isDesktop) {
      setActiveIndex(activeIndex === index ? null : index);
    }
  };

  return (
    <div className="faq-container">
      <h1 style={{ fontSize: "30px", fontWeight: "650" }}> Preguntas Frecuentes</h1>
      <div className="faq-list">
        {faqData.map((item, index) => (
          <div key={index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
            <div className="faq-question" onClick={() => handleClick(index)}>
              {item.question}
            </div>
            <div className="faq-answer">
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questions;
