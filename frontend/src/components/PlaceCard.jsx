import React from 'react';
import { Link } from "react-router-dom";

const PlaceCard = ({ place }) => {
  // place டேட்டா வரவில்லையென்றால் error வராமல் இருக்க செக் செய்கிறோம்
  if (!place) return null; 

  return (
    <div className="place-card">
      <div className="place-image-wrapper">
        <img
          src={
            place.images?.[0] ||
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
          }
          alt={place.name || "Place"}
          className="place-image"
        />
        <span className="place-category">
          {place.category || "General"}
        </span>
      </div>

      <div className="place-card-content">
        <h3>{place.name}</h3>

        <div className="place-meta">
          <span>📍 {place.distanceFromAkkaraipattu || 0} km</span>
          <span>⭐ {place.rating || "4.5"}</span>
        </div>

        <p className="place-short-description">
          {place.description
            ? place.description.substring(0, 100) + "..."
            : "Discover this beautiful destination in Akkaraipattu."}
        </p>

        <div className="place-footer">
          <span className="fee">
            🎟️ {place.entryFee === 0 || !place.entryFee ? "Free" : `Rs. ${place.entryFee}`}
          </span>

          <Link to={`/place/${place._id}`} className="view-details-btn">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;