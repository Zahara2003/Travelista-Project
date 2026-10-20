import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import logo from "../assets/logo.png"; 
import "./Header.css"; 

const Header = ({ language, setLanguage }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="professional-header">
      <div className="header-container">
        
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img src={logo} alt="Travelista" />
        </Link>

        {/* Navigation Links */}
        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/explore" onClick={() => setMenuOpen(false)}>Explore</Link>
          <Link to="/interactive-map" onClick={() => setMenuOpen(false)}>Interactive Map</Link>
          <Link to="/plan" onClick={() => setMenuOpen(false)}>My Itinerary</Link>
          
          {user && user.role !== "admin" && !isAdmin && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          )}

          {(isAdmin || user?.role === "admin") && (
            <Link to="/admin/dashboard" className="admin-link" onClick={() => setMenuOpen(false)}>
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Actions (Auth) */}
        <div className="header-actions">
          
          {user ? (
            <div className="user-profile-area">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="login-signup-btn">
              Log In / Sign Up
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;