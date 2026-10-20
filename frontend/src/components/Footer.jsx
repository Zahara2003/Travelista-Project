import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.png";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="professional-footer">
      <div className="footer-main-container">
        
        {/* 1. Brand Section */}
        <div className="footer-brand-section">
          <Link to="/">
            <img src={logo} alt="Travelista" className="footer-logo" />
          </Link>
          <p className="footer-description">
            Crafting memorable journeys and helping you discover the beauty of Akkaraipattu, one destination at a time.
          </p>
          <div className="social-icons">
            <a href="#" className="social-circle">📘</a>
            <a href="#" className="social-circle">📸</a>
            <a href="#" className="social-circle">🐦</a>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div className="footer-links-group">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/explore">Explore Places</Link></li>
            <li><Link to="/plan">My Itinerary</Link></li>
            <li><Link to="/login">Login / Register</Link></li>
          </ul>
        </div>

        {/* 3. Support & Policies */}
        <div className="footer-links-group">
          <h4>Support</h4>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Support</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* 4. Newsletter */}
        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <p>Subscribe to our newsletter for the latest travel updates and hidden gems.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="newsletter-btn">Subscribe</button>
          </form>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-content">
          <p>© {new Date().getFullYear()} Travelista. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Sitemap</a>
            <span className="dot-separator">•</span>
            <a href="#">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;