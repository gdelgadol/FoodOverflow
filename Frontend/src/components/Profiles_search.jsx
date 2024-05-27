import { Link } from "react-router-dom";
import "./Profiles_search.css";

export default function Profile({ username, description, avatar, recipes, publications }){
    console.log(username)
    return(
        <Link to={`../../user/${username}`}>
            <div className="profile_content">
                <img src = {avatar} className="profile_avatar"></img>
                <div className="profile_data_container">
                    <span className="profile_username">{username}</span>
                    <br></br>
                    {description ? <span className="profile_description">{description}</span> :<></>}
                    <div className="up-info-separator"></div>
                    <div className='up-info-statistics'>
                        <div className='up-info-statistics-data'>
                            <div className='profile-info-statistics-number'>{publications}</div>
                            <div className='profile-info-statistics-text'>Publicaciones</div>
                        </div>
                        <div className='up-info-statistics-data'>
                            <div className='profile-info-statistics-number'>{recipes}</div>
                            <div className='profile-info-statistics-text'>Recetas</div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}