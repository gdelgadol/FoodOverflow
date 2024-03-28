import './Publicacion.css';
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import { BiComment } from "react-icons/bi";

export default function Publicacion ({userName, title, description, numComments, score}) {

    return (
        <div className='publicacion'>
            <div className='score'>
                <HiArrowCircleDown size={30} />
                {score}
                <HiArrowCircleUp size={30} />
            </div>
            <div className='contenido'>
                <span className='userName'>{userName}</span>
                <span className='title'>{title}</span>
                <div className="description">{description}</div>
                <div className='comments'>
                    <BiComment />
                    {numComments}
                </div>
            </div>
        </div>
    )

}