import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Homepage.css";

// உங்களது assets ஃபோல்டரில் உள்ள படங்களை import செய்தல்
import heroImage from "../assets/heder.png"; 
import aboutImage1 from "../assets/beach.png"; 
import aboutImage2 from "../assets/clt.png"; 

const Homepage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("/explore"); 
    }
  };

  return (
    <div className="homepage-container">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        {/* பின்னணிப் படம் */}
        <img 
          src={heroImage} 
          alt="Akkaraipattu Header" 
          className="hero-video" 
        />

        <div className="hero-overlay"></div>

        <div className="hero-content">
          {/* புதிதாகச் சேர்க்கப்பட்ட Cursive Text */}
          <span className="hero-cursive">Travelista</span>
          
          <h1>Discover the Hidden Gems of Akkaraipattu</h1>
          <p>Your ultimate guide to the most beautiful destinations, culture, and nature.</p>
          
          <form className="hero-search-box" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Explore Now</button>
          </form>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-text fade-in-left">
            <span className="about-subtitle">WELCOME TO TRAVELISTA</span>
            <h2>Experience the perfect blend of Nature & Culture</h2>
            <p>
              Akkaraipattu is a vibrant town in the Eastern Province of Sri Lanka, known for its pristine beaches, rich agricultural lands, and diverse cultural heritage. Whether you are looking for a peaceful retreat by the sea, a cultural journey through ancient sites, or a taste of authentic local cuisine, we have it all.
            </p>
            <Link to="/explore" className="primary-action-btn">
              Start Exploring <span>→</span>
            </Link>
          </div>
          
          <div className="about-images fade-in-right">
            <img 
              src={aboutImage1} 
              alt="About Beach View" 
              className="about-img img-1" 
            />
            <img 
              src={aboutImage2} 
              alt="About Cultural View" 
              className="about-img img-2" 
            />
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHTS / FEATURES SECTION */}
      <section className="features-section">
        <div className="feature-card bounce-up">
          <div className="feature-icon">🌊</div>
          <h3>Beautiful Beaches</h3>
          <p>Relax on the golden sands and enjoy the gentle waves of the eastern coast.</p>
        </div>
        
        <div className="feature-card bounce-up" style={{ animationDelay: "0.2s" }}>
          <div className="feature-icon">🕌</div>
          <h3>Rich Heritage</h3>
          <p>Explore historic monuments and diverse religious landmarks around the city.</p>
        </div>
        
        <div className="feature-card bounce-up" style={{ animationDelay: "0.4s" }}>
          <div className="feature-icon">🍛</div>
          <h3>Local Cuisine</h3>
          <p>Taste the authentic, spicy, and flavorful dishes unique to the region.</p>
        </div>
      </section>

    </div>
  );
};

export default Homepage;