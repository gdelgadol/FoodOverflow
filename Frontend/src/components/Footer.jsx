import FbImg from "../assets/logofb.png";
import IgImg from "../assets/logoig.png";
import TwImg from "../assets/logotw.png";
import React, { useState } from 'react';
import "./Footer.css"; 
import { Link } from "react-router-dom";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="info">
        <div className="copyright">
          &copy; 2024 FoodOverflow
        </div>
        <Link to={"/terms"} style={{ color: '#b7b7b7' }}>Términos y condiciones</Link>
        <Link to={"/acuerdo"} style={{ color: '#b7b7b7' }}>Acuerdo de privacidad</Link>
        <div>foodoverflow02@gmail.com</div>
        </div>
        <div className="social-links">
          {/* Redes FoodOverflow */}
          <a href="https://twitter.com/FoodOverflow02">
            <FaXTwitter color="white" size={23}/>
          </a>
          <a href="https://www.tiktok.com/@food_overflow">
              <FaTiktok color="white" size={23}/>
          </a>
          <a href="https://www.instagram.com/food_overflow02/">
              <FaInstagram color="white" size={23}/>
          </a>
        </div>
      </div>

    </footer>
  );
}

export default Footer;
