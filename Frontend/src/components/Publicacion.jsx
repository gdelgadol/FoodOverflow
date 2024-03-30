import './Publicacion.css';
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import { BiComment } from "react-icons/bi";
import { Link } from 'react-router-dom';

export default function Publicacion ({id_post, userName, title, description, numComments, score}) {

    return (
        <div>
            <Link to={`/post/${id_post}`} className='publicacion'>
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
            </Link>
            <div className='separatorPost'></div>
        </div>
    )

}