import './Publicacion.css';
import {HiArrowCircleDown, HiArrowCircleUp} from "react-icons/hi";
import { LuChefHat  } from "react-icons/lu";
import { GiCook, GiDespair, GiCookingGlove } from "react-icons/gi";
import { BiComment } from "react-icons/bi";
import { Link } from 'react-router-dom';
import { GiShrug } from "react-icons/gi";

export default function Publicacion ({id_post, userName, profile_avatar, title, description, numComments, score, type, tags}) {
    if (type === 'publications' || type === 'publication'){
        type = "publication"
    } else {
        type = "recipe"
    }

    const tagsDictionary = {
        1: "Vegetariano",
        2: "Vegano",
        3: "Sin gluten",
        4: "Bajo en carbohidratos",
        5: "Alta en proteínas",
        6: "Postre",
        7: "Desayuno",
        8: "Almuerzo",
        9: "Cena",
        10: "Aperitivo"
    };

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
                    {tags && tags.length > 0 && (
                        <div className='dp-tags'>
                            <div className='tags-container'>
                                {tags.map((tagId, index) => (
                                    <div key={index} className='tag2'>{tagsDictionary[tagId]}</div>
                                ))}
                            </div>
                        </div>
                    )}
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