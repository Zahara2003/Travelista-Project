import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./PlaceDetails.css";

// Assets imports
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
import greenVillaImg from "../assets/greenvilla.png";

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddedToPlan, setIsAddedToPlan] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([
    { id: 1, name: "Fathima Zahara", rating: 5, comment: "Very peaceful and clean environment! Must visit place." },
    { id: 2, name: "Mohamed Rilwan", rating: 4, comment: "Great experience with family. Loved the scenery." }
  ]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await axios.get(`${API}/places/${id}`);
        setPlace(response.data);

        // Check if current place is already in active planner
        const activePlan = JSON.parse(localStorage.getItem("activePlannerPlaces") || "[]");
        const exists = activePlan.some((p) => p._id === id || p._id === response.data._id);
        setIsAddedToPlan(exists);

      } catch (error) {
        console.error("Error fetching place details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaceDetails();
  }, [id, API]);

  // Flexible image mapping helper
  const getPlaceImage = (placeName) => {
    if (!placeName) return null;

    if (placeName.includes("Food Champ")) {
      return foodChampImg;
    }

    switch (placeName.trim()) {
      case "Akkaraipattu Beach": return akpBeachImg;
      case "Kanchikudichchiaru Tank": return kanchikudichchiaruImg;
      case "Sri Siththy Vinayager Temple": return sriSiththiVinayagarImg;
      case "Oluvil Harbour": return harbourImg;
      case "Oluvil Lighthouse": return lighthouseImg;
      case "South Eastern University":
      case "South Eastern University (SEUSL), Oluvil": return seusImg;
      case "Nintavur Beach": return nintavurBeachImg;
      case "Green Villa Guest House": return greenVillaImg;
      case "Thompukandam Village Resort": return greenVillaImg;
      case "Mr Chai": return mrChaiImg;
      case "Jummah Grand Mosque, Akkaraipattu": return grandMosqueImg;
      case "Methodist Church, Akkaraipattu": return methodistChurchImg;
      case "Water park": return waterparkImg;
      default: return null;
    }
  };

  // Toggle Favorite Handler
  const toggleFavorite = () => {
    if (!user) { alert("Please log in to save favorites."); navigate("/login"); return; }
    setIsFavorite(!isFavorite);
  };

  // Share Page Link Handler
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Place link copied to clipboard!");
  };

  // Toggle Add / Remove from Active Plan
  const toggleAddToPlan = () => {
    if (!place) return;

    let activePlan = JSON.parse(localStorage.getItem("activePlannerPlaces") || "[]");
    const exists = activePlan.some((p) => p._id === place._id);

    if (exists) {
      activePlan = activePlan.filter((p) => p._id !== place._id);
      setIsAddedToPlan(false);
      alert(`${place.name} removed from your itinerary plan.`);
    } else {
      if (activePlan.length >= 5) {
        alert("You can select up to 5 places in your itinerary.");
        return;
      }
      activePlan.push(place);
      setIsAddedToPlan(true);
      alert(`${place.name} added to your itinerary plan!`);
    }

    localStorage.setItem("activePlannerPlaces", JSON.stringify(activePlan));
  };

  const openGoogleMaps = () => {
    if (place?.name) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}`, "_blank");
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const reviewObj = {
      id: Date.now(),
      name: user?.name || "Traveler",
      rating: Number(newRating),
      comment: newComment,
      placeId: id
    };

    const updatedReviews = [reviewObj, ...reviews];
    setReviews(updatedReviews);
    setNewComment("");

    if (user?.email) {
      const userReviewsKey = `userReviews_${user.email}`;
      const existingUserReviews = JSON.parse(localStorage.getItem(userReviewsKey) || "[]");
      const newSavedReviews = [reviewObj, ...existingUserReviews];
      localStorage.setItem(userReviewsKey, JSON.stringify(newSavedReviews));
    }

    alert("Review submitted successfully!");
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!place) return <div className="loader">Place not found!</div>;

  const currentPlaceImage = getPlaceImage(place.name) || place.imageURL || place.images?.[0] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

  // Fallback travel tips if database does not have it for old places
  const displayTravelTips = place.travelTips && place.travelTips.trim() !== "" 
    ? place.travelTips 
    : "Best time to visit is during early morning or late afternoon. Please keep the environment clean, respect local community guidelines, and carry drinking water.";

  return (
    <div className="pd-overlay-background">
      <div className="pd-modal-container">
        
        {/* Header Close/Back Button */}
        <div className="pd-header-bar">
          <span className="pd-distance-badge">📍 {place.distanceFromAkkaraipattu || "0"} km from Akkaraipattu town</span>
          <button className="pd-close-btn" onClick={() => navigate(-1)}>✕</button>
        </div>

        {/* Hero Image Section */}
        <div style={{ position: "relative", width: "100%", height: "280px", overflow: "hidden", backgroundColor: "#1a1a1a", display: "flex", justifyContent: "center", alignItems: "center" }}>
          
          {/* Blur background */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${currentPlaceImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(15px) brightness(0.6)",
            transform: "scale(1.2)",
            zIndex: 1
          }} />

          {/* Main foreground image */}
          <img 
            src={currentPlaceImage} 
            alt={place.name} 
            style={{ position: "relative", zIndex: 2, maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
          />
        </div>

        <div className="pd-content-body">
          {/* Title and Fully Functional Action Buttons */}
          <div className="pd-title-row">
            <div>
              <h1 className="pd-title">{place.name}</h1>
              <div className="pd-rating-row">
                <span className="pd-star">★ 4.9</span>
                <span className="pd-reviews">({reviews.length} reviews)</span>
                <span className="pd-entry-tag">{place.entryFee === 0 ? "Free Entry" : `Rs. ${place.entryFee}`}</span>
              </div>
            </div>
            
            {/* Functional Buttons */}
            <div className="pd-action-buttons" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button className="pd-icon-btn" onClick={toggleFavorite} title="Favorite" style={{ cursor: "pointer" }}>
                {isFavorite ? "❤️" : "🤍"}
              </button>
              
              <button className="pd-icon-btn" onClick={handleShare} title="Share Link" style={{ cursor: "pointer" }}>
                🔗
              </button>
              
              <button 
                className="pd-add-plan-btn" 
                onClick={toggleAddToPlan}
                style={{ 
                  backgroundColor: isAddedToPlan ? "#2e241c" : "#c1440e", 
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {isAddedToPlan ? "✓ Added to Plan" : "+ Add to Plan"}
              </button>
            </div>
          </div>

          <hr className="pd-divider" />

          {/* About Section */}
          <div className="pd-about-section">
            <h4>ABOUT THIS DESTINATION</h4>
            <p>{place.description}</p>
          </div>

          {/* Info Grid */}
          <div className="pd-info-grid">
            <div className="pd-info-box">
              <span>🕒 Operating Hours</span>
              <strong>{place.operatingHours || "Open 24 Hours"}</strong>
            </div>
            <div className="pd-info-box">
              <span>📍 GPS Coordinates</span>
              <strong>{place.latitude ? `${place.latitude}° N` : "7.2230° N"}, {place.longitude ? `${place.longitude}° E` : "81.8418° E"}</strong>
            </div>
          </div>

          {/* Navigation Banner */}
          <div className="pd-navigate-banner">
            <div className="pd-nav-text">
              <span className="pd-nav-icon">🧭</span>
              <div>
                <strong>Navigate to {place.name}</strong>
                <p>Get live GPS turn-by-turn driving, cycling, or walking directions.</p>
              </div>
            </div>
            <button className="pd-google-btn" onClick={openGoogleMaps}>Open in Google Maps ↗</button>
          </div>

          {/* Travel Tips Section (Displays database tips or smart fallback for old places) */}
          <div style={{ marginTop: "20px", background: "#fff3ec", border: "1px solid #f4c2ae", padding: "16px 20px", borderRadius: "12px" }}>
            <h4 style={{ margin: "0 0 6px 0", color: "#c1440e", fontSize: "14px", fontWeight: "700" }}>
              🧳 TRAVEL TIPS & ADVICE
            </h4>
            <p style={{ margin: 0, color: "#4a3f35", fontSize: "13px", lineHeight: "1.5" }}>
              {displayTravelTips}
            </p>
          </div>

          {/* Facilities */}
          <div className="pd-facilities-section" style={{ marginTop: "20px" }}>
            <h4>FACILITIES & AMENITIES</h4>
            <div className="pd-facility-tags">
              {place.facilities && place.facilities.length > 0 ? (
                place.facilities.map((facility, index) => (
                  <span key={index}>✔️ {facility}</span>
                ))
              ) : (
                <span>✔️ Parking & Rest Areas</span>
              )}
            </div>
          </div>

          <hr className="pd-divider" />

          {/* User Reviews Section */}
          <div className="pd-reviews-section" style={{ marginTop: "30px" }}>
            <h4>USER REVIEWS & EXPERIENCES</h4>
            
            {/* Add Review Form */}
            <form onSubmit={handleReviewSubmit} style={{ background: "#fdfbf7", padding: "20px", borderRadius: "10px", border: "1px solid #e3dccd", marginBottom: "20px" }}>
              <h5 style={{ margin: "0 0 10px 0", color: "#2e241c" }}>Write a Review</h5>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ fontSize: "13px", color: "#8a7b6c", marginRight: "10px" }}>Rating:</label>
                <select value={newRating} onChange={(e) => setNewRating(e.target.value)} style={{ padding: "5px", borderRadius: "5px", border: "1px solid #e3dccd" }}>
                  <option value="5">★★★★★ (5/5)</option>
                  <option value="4">★★★★☆ (4/5)</option>
                  <option value="3">★★★☆☆ (3/5)</option>
                  <option value="2">★★☆☆☆ (2/5)</option>
                  <option value="1">★☆☆☆☆ (1/5)</option>
                </select>
              </div>
              <textarea 
                rows="3" 
                placeholder="Share your thoughts about this place..." 
                value={newComment} 
                onChange={(e) => setNewComment(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #e3dccd", resize: "vertical", marginBottom: "10px" }}
                required
              />
              <button type="submit" style={{ background: "#c1440e", color: "white", border: "none", padding: "8px 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer" }}>
                Post Review
              </button>
            </form>

            {/* Display Reviews List */}
            <div className="reviews-list" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {reviews.map((rev) => (
                <div key={rev.id} style={{ background: "#ffffff", padding: "15px", borderRadius: "8px", border: "1px solid #e3dccd" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <strong style={{ color: "#2e241c", fontSize: "14px" }}>{rev.name}</strong>
                    <span style={{ color: "#c1440e", fontSize: "14px" }}>{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                  </div>
                  <p style={{ margin: 0, color: "#4a3f35", fontSize: "14px" }}>{rev.comment}</p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceDetails;