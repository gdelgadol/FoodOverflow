import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "../api/axios.jsx";
import Cookies from 'universal-cookie';
import './Results_search.css';
import SavedPosts from '../components/SavedPosts.jsx';
import { Link } from 'react-router-dom';

function UserSavedPosts() {

    return (
        <div className='up-container'>
            <div className='terms-container'>
                <div className='terms-logo-eslogan'>
                    <div className='terms-eslogan'>
                        <span className="terms-name-text2">Posts guardados</span>
                        <h1 className="terms-eslogan-text2">
                            Tus posts guardados en Food Overflow
                        </h1>
                    </div>
                </div>
                <br></br>
                <SavedPosts></SavedPosts>
                <br></br>
            </div>
        </div>
    )
}

export default UserSavedPosts;
