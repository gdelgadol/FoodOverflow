import FbImg from "../assets/logofb.png";
import IgImg from "../assets/logoig.png";
import TwImg from "../assets/logotw.png";
import React, { useState } from 'react';
import "./Footer.css"; 

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="copyright">
          &copy; 2024 FoodOverflow
        </div>
        <a href="/terms">Términos y condiciones</a>
        <div>foodoverflow02@gmail.com</div>
        <div className="social-links">
          {/* Redes FoodOverflow */}
          <a href="https://www.facebook.com">
            <img
            src={FbImg}
            alt="Facebook"
            style={{ width: "38px", height: "37px" }}
            />
          </a>
          <a href="https://twitter.com/FoodOverflow02">
            <img
            src={TwImg}
            alt="Instagram"
            style={{ width: "39px", height: "40px" }}
            />
          </a>
          <a href="https://www.instagram.com/food_overflow02/">
            <img
            src={IgImg}
            alt="Instagram"
            style={{ width: "39px", height: "40px" }}
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
