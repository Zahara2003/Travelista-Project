import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="professional-footer">
      <div className="footer-main-container">
        
        <div className="footer-brand-section">
          <Link to="/">
            <img src={logo} alt="Travelista" className="footer-logo" />
          </Link>
          <p className="footer-description">
            Local Tourist Day-Visit Planner and Information System for Akkaraipattu, Eastern Province, Sri Lanka. Designed to help you explore the beauty of Akkaraipattu within a 25 km radius.
          </p>
          <div className="social-icons">
            <a href="#" className="social-circle">📘</a>
            <a href="#" className="social-circle">📸</a>
            <a href="#" className="social-circle">🐦</a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Explore Places</Link></li>
            <li><Link to="/plan">My Itinerary</Link></li>
            <li><Link to="/login">Login / Register</Link></li>
          </ul>
        </div>

        <div className="footer-hotlines">
          <h4>Emergency Hotlines</h4>
          <ul>
            <li><span>Tourism Police:</span> <strong>1912</strong></li>
            <li><span>Free Ambulance:</span> <strong>1990</strong></li>
            <li><span>Akkaraipattu Hospital:</span> <strong>+94 67 227 7222</strong></li>
            <li><span>Akkaraipattu Police:</span> <strong>+94 67 227 7223</strong></li>
          </ul>
        </div>

      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} Travelista. Academic Project - University of Moratuwa (ITE2953).</p>
          <div className="footer-bottom-links">
            <a href="#sitemap">Sitemap</a>
            <span className="dot-separator">•</span>
            <a href="#security">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;