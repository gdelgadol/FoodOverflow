import './Publicacion.css';
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import { LuChefHat  } from "react-icons/lu";
import { GiCook, GiDespair, GiCookingGlove } from "react-icons/gi";
import { BiComment } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { GiShrug } from "react-icons/gi";

export default function Publicacion ({id_post, userName, profile_avatar, title, description, numComments, score, type}) {
    if (type === 'publications'){
        type = "publication"
    } else {
        type = "recipe"
    }
    return (
        <div>
            <Link to={`/${type}/${id_post}`} className='publicacion'>
                <div className='score'>
                {score > 0 &&
                    <GiCook size={30} />
                }
                {score < 0 &&
                    <GiDespair size={30} />
                }
                {score == 0 &&
                    <GiShrug size={30}/>
                }
                    {score}
                    
                </div>
                <div className='contenido'>
                    <Link to={`/user/${userName}`}>
                        <div className='publication-username'>
                            <img src={profile_avatar} className='publicaion-profileAvatar' alt='profile_avatar' />
                            <span className='userName'>{userName}</span>
                        </div>
                    </Link>
                    <span className='title'>{title}</span>
                    <div className="description" dangerouslySetInnerHTML={{ __html: description }}></div>
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