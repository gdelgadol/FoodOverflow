import {useState} from 'react';
import "./Paginacion.css";
import { HiChevronLeft } from "react-icons/hi";
import { HiChevronRight } from "react-icons/hi";

const Paginacion = ({ currentPage, maxPage, setCurrentPage }) => {
  const [input, setInput] = useState(1);

  const nextPage = () => {
    setInput(parseInt(input) + 1);
    setCurrentPage(parseInt(currentPage) + 1);
  };

  const previousPage = () => {
    setInput(parseInt(input) - 1);
    setCurrentPage(parseInt(currentPage) - 1);
  };

  const onKeyDown = (e) => {
    if (e.keyCode == 13) {
      setCurrentPage(parseInt(e.target.value));
      if (
        parseInt(e.target.value < 1) ||
        parseInt(e.target.value) > Math.ceil(maxPage) ||
        isNaN(parseInt(e.target.value))
      ) {
        setCurrentPage(1);
        setInput(1);
      } else {
        setCurrentPage(parseInt(e.target.value));
      }
    }
  };

  const onChange = (e) => {
    setInput(e.target.value);
  };

  return (
    <div className="paginacion">
      <button
        disabled={currentPage === 1 || currentPage < 1}
        onClick={previousPage}
      ><HiChevronLeft size={50} />
      </button>
      <div>
      <input
        onChange={(e) => onChange(e)}
        onKeyDown={(e) => onKeyDown(e)}
        name="page"
        autoComplete="off"
        value={input}
      /></div>
      <p> de {Math.ceil(maxPage)} </p>
      <button
        disabled={
          currentPage === Math.ceil(maxPage) || currentPage > Math.ceil(maxPage)
        }
        onClick={nextPage}
      >
        <HiChevronRight size={50}/>
      </button>
    </div>
  );
};

export default Paginacion;
