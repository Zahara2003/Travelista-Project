import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Explore.css";

// Assets image imports
import akpBeachImg from "../assets/Akpbeach.png";
import foodChampImg from "../assets/foodchamp.png";
import grandMosqueImg from "../assets/grandmosqe.png";
import harbourImg from "../assets/harbour.png";
import kanchikudichchiaruImg from "../assets/KanchikudichchiaruTank.png";
import lighthouseImg from "../assets/lighthouse.png";
import methodistChurchImg from "../assets/MethodistChurch.png";
import mrChaiImg from "../assets/mrchai.png";
import nintavurBeachImg from "../assets/ninthavurbeach.png";
import seusImg from "../assets/SEUS.png";
import sriSiththiVinayagarImg from "../assets/SriSiththiVinayagarTemple.png";
import waterparkImg from "../assets/waterpark.png";

const Explore = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get(`${API}/places`);
        setPlaces(response.data);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [API]);

  // Dynamic image mapping with flexible name matching
  const getPlaceImage = (placeName) => {
    if (!placeName) return null;

    // Handle Food Champ variations (e.g. Food Champ,Oluvil or Food Champ (Oluvil))
    if (placeName.includes("Food Champ")) {
      return foodChampImg;
    }

    switch (placeName.trim()) {
      case "Akkaraipattu Beach":
        return akpBeachImg;
      case "Kanchikudichchiaru Tank":
        return kanchikudichchiaruImg;
      case "Sri Siththy Vinayager Temple":
        return sriSiththiVinayagarImg;
      case "Oluvil Harbour":
        return harbourImg;
      case "Oluvil Lighthouse":
        return lighthouseImg;
      case "South Eastern University":
      case "South Eastern University (SEUSL), Oluvil":
        return seusImg;
      case "Nintavur Beach":
        return nintavurBeachImg;
      case "Mr Chai":
        return mrChaiImg;
      case "Jummah Grand Mosque, Akkaraipattu":
        return grandMosqueImg;
      case "Methodist Church, Akkaraipattu":
        return methodistChurchImg;
      case "Water park":
        return waterparkImg;
      default:
        return null;
    }
  };

  // Get unique categories from places list
  const categories = ["All", ...new Set(places.map((place) => place.category).filter(Boolean))];

  // Filter places based on search term and category
  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.category?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = activeCategory === "All" || place.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="explore-loading">
        <div className="spinner"></div>
        <p>Discovering destinations...</p>
      </div>
    );
  }

  return (
    <div className="explore-wrapper">
      {/* Hero Banner Section */}
      <div className="explore-hero">
        <div className="explore-hero-content">
          <h1>Explore Akkaraipattu</h1>
          <p>Discover amazing places, cultural sites, and beautiful destinations tailored just for you.</p>

          <div className="search-bar-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="explore-search-input"
            />
          </div>
        </div>
      </div>

      <div className="explore-container">
        {/* Dynamic Category Filters */}
        <div className="category-filters">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`category-btn ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Places Grid */}
        <div className="places-grid">
          {filteredPlaces.length > 0 ? (
            filteredPlaces.map((place) => (
              <div key={place._id} className="place-card">
                <div className="place-card-img-wrapper">
                  <img
                    src={getPlaceImage(place.name) || place.imageURL || place.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"}
                    alt={place.name}
                    className="place-card-img"
                  />
                  <span className="place-category-badge">{place.category}</span>
                </div>

                <div className="place-card-content">
                  <h3>{place.name}</h3>
                  <p>{place.description ? place.description.substring(0, 75) + "..." : "Explore this beautiful destination."}</p>

                  <div className="place-card-footer">
                    <span className="distance-info">
                      📍 {place.distanceFromAkkaraipattu || place.distance || "0"} km away
                    </span>
                    <Link to={`/place/${place._id}`} className="view-details-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-places-found">
              <span className="empty-icon">🏜️</span>
              <h3>No destinations found</h3>
              <p>Try adjusting your search or filter criteria.</p>
              <button className="clear-btn" onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;