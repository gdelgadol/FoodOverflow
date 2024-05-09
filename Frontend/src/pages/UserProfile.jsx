import './UserProfile.css'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import UserPostsView from '../components/UserPostsView.jsx';
import { FaBookmark } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function UserProfile () {
    const { username } = useParams()
    const url =  import.meta.env.VITE_API_URL;
    const cookies = new Cookies();
    const jwt = cookies.get("auth_token");

    const [userInfo, setUserInfo] = useState({
        username: '',
        description: '',
        profile_publications: '',
        commented_publications: '',
        voted_publications: '',
        profile_recipes: '',
        commented_recipes: '',
        voted_recipes: '',
        avatar: ''
    })

    const [userInfo2, setUserInfo2] = useState({
        username2: '',
    })

    useEffect(() => {
        axios.post(`${url}/get_user/${username}`, {
            jwt: jwt,
        })
        .then((res) => {
            setUserInfo({
                username: res.data.username,
                username2: res.data.username,
                description: res.data.description,
                profile_publications: res.data.profile_publications,
                commented_publications: res.data.commented_publications,
                voted_publications: res.data.voted_publications,
                profile_recipes: res.data.profile_recipes,
                commented_recipes: res.data.commented_recipes,
                voted_recipes: res.data.voted_recipes,
                avatar: res.data.avatar
            })
        })
        .catch((error) => {
            console.error("Error al obtener datos del usuario:", error);
        })
    }, [])

    useEffect(() => {
        axios.post(`${url}/get_user/profile`, {
            jwt: jwt,
        })
        .then((res) => {
            setUserInfo2({
                username2: res.data.username,
            })
        })
        .catch((error) => {
            console.error("Error al obtener datos del usuario:", error);
        })
    }, [])

    const currentUser = cookies.get("username");
    console.log(userInfo2.username2);

    return (
        <div className='up-container'>
            <div className='up-info'>
                <img
                className='up-info-img'
                src={userInfo.avatar} alt='user-img' />
                <h1 className='up-info-name'>{userInfo.username}</h1>
                <div className='up-info-description'>{userInfo.description}</div>
                <div className='up-info-separator'></div>
                <div className='up-info-statistics'>
                    <div className='up-info-statistics-data'>
                        <div className='up-info-statistics-number'>{userInfo.profile_publications}</div>
                        <div className='up-info-statistics-text'>Publicaciones</div>
                    </div>
                    <div className='up-info-statistics-data'>
                        <div className='up-info-statistics-number'>{userInfo.profile_recipes}</div>
                        <div className='up-info-statistics-text'>Recetas</div>
                    </div>
                    <div className='up-info-statistics-data'>
                        <div className='up-info-statistics-number'>{userInfo.commented_publications + userInfo.commented_recipes}</div>
                        <div className='up-info-statistics-text'>Comentarios</div>
                    </div>
                </div>
                <div className='up-info-statistics'>
                    <div className='up-info-statistics-data'>
                        <div className='up-info-statistics-number'>{userInfo.voted_publications + userInfo.voted_recipes}</div>
                        <div className='up-info-statistics-text'>Votos</div>
                    </div>
                </div>
                {userInfo2.username2 === userInfo.username && (
                    <Link to={`/saved_posts_user`}>
                        <button className='savedPosts-button'>
                            <FaBookmark size={16} className='book'/>
                            Posts guardados
                        </button>
                    </Link>
                )}
            </div>
            <UserPostsView></UserPostsView>
        </div>
    )
}
