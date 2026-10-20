import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Import images for timeline cards display
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

const Dashboard = () => {
  const { user } = useAuth();

  // Get user specific saved itineraries key
  const userEmail = user?.email || "";
  const savedKey = userEmail ? `savedItineraries_${userEmail}` : "savedItineraries";
  
  // Retrieve saved itineraries list
  const savedTrips = JSON.parse(localStorage.getItem(savedKey) || localStorage.getItem("savedItineraries") || "[]");

  // Get user written reviews
  const reviewsKey = userEmail ? `userReviews_${userEmail}` : "userReviews";
  const userReviews = JSON.parse(localStorage.getItem(reviewsKey) || "[]");

  // Image mapping helper function
  const getPlaceImage = (placeName) => {
    switch (placeName) {
      case "Akkaraipattu Beach": return akpBeachImg;
      case "Kanchikudichchiaru Tank": return kanchikudichchiaruImg;
      case "Sri Siththy Vinayager Temple": return sriSiththiVinayagarImg;
      case "Oluvil Harbour": return harbourImg;
      case "Oluvil Lighthouse": return lighthouseImg;
      case "South Eastern University": return seusImg;
      case "Nintavur Beach": return nintavurBeachImg;
      case "Green Villa Guest House": return greenVillaImg;
      case "Thompukandam Village Resort": return greenVillaImg;
      case "Food Champ (Oluvil)": return foodChampImg;
      case "Mr Chai": return mrChaiImg;
      case "Jummah Grand Mosque, Akkaraipattu": return grandMosqueImg;
      case "Methodist Church, Akkaraipattu": return methodistChurchImg;
      case "Water park": return waterparkImg;
      default: return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    }
  };

  return (
    <main className="dashboard-page" style={{ backgroundColor: "#faf8f5", minHeight: "100vh", padding: "30px 40px", fontFamily: "sans-serif", color: "#2e241c" }}>
      <div className="dashboard-container" style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Welcome Section */}
        <section className="dashboard-welcome" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "white", padding: "25px 30px", borderRadius: "18px", border: "1px solid #e3dccd", marginBottom: "25px" }}>
          <div>
            <span className="section-label" style={{ color: "#c1440e", fontWeight: "bold", fontSize: "11px", letterSpacing: "1px" }}>
              TOURIST DASHBOARD
            </span>
            <h1 style={{ margin: "5px 0", fontSize: "26px", fontWeight: "800" }}>
              Welcome, {user?.name || "Guest"} 👋
            </h1>
            <p style={{ margin: 0, color: "#8a7b6c", fontSize: "14px" }}>
              Manage your saved trips and explore new destinations in Akkaraipattu.
            </p>
          </div>
          <Link to="/plan" className="primary-btn" style={{ padding: "12px 22px", background: "#c1440e", color: "white", borderRadius: "12px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>
            + Plan New Trip
          </Link>
        </section>

        {/* Dashboard Statistics Cards */}
        <div className="dashboard-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "35px" }}>
          <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "16px", border: "1px solid #e3dccd", textAlign: "center" }}>
            <span style={{ fontSize: "24px" }}>🗓️</span>
            <strong style={{ display: "block", fontSize: "22px", margin: "8px 0 4px 0", color: "#2e241c" }}>
              {savedTrips.length}
            </strong>
            <p style={{ margin: 0, color: "#8a7b6c", fontSize: "13px" }}>Saved Itineraries</p>
          </div>

          <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "16px", border: "1px solid #e3dccd", textAlign: "center" }}>
            <span style={{ fontSize: "24px" }}>📍</span>
            <strong style={{ display: "block", fontSize: "22px", margin: "8px 0 4px 0", color: "#2e241c" }}>
              {savedTrips.reduce((acc, trip) => acc + (trip.places?.length || 0), 0)}
            </strong>
            <p style={{ margin: 0, color: "#8a7b6c", fontSize: "13px" }}>Total Places Bookmarked</p>
          </div>

          <div className="stat-card" style={{ background: "white", padding: "20px", borderRadius: "16px", border: "1px solid #e3dccd", textAlign: "center" }}>
            <span style={{ fontSize: "24px" }}>⭐</span>
            <strong style={{ display: "block", fontSize: "22px", margin: "8px 0 4px 0", color: "#2e241c" }}>{userReviews.length}</strong>
            <p style={{ margin: 0, color: "#8a7b6c", fontSize: "13px" }}>Reviews Written</p>
          </div>
        </div>

        {/* Saved Itineraries Timeline Section */}
        <section className="dashboard-section">
          <div className="section-heading" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "22px", fontWeight: "800", margin: 0 }}>My Saved Itineraries</h2>
            <p style={{ color: "#8a7b6c", fontSize: "13px", margin: "4px 0 0 0" }}>Your personal one-day travel plans saved for future visits.</p>
          </div>

          {savedTrips.length === 0 ? (
            <div className="empty-dashboard" style={{ background: "white", padding: "50px", borderRadius: "18px", textAlign: "center", border: "1px dashed #e3dccd" }}>
              <div style={{ fontSize: "36px", marginBottom: "10px" }}>🧳</div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "18px" }}>No itinerary saved yet</h3>
              <p style={{ color: "#8a7b6c", fontSize: "13px", marginBottom: "20px" }}>Start exploring and create your first one-day itinerary.</p>
              <Link to="/plan" className="primary-btn" style={{ padding: "10px 20px", background: "#c1440e", color: "white", borderRadius: "10px", textDecoration: "none", fontWeight: "bold", fontSize: "13px" }}>
                Start Planning
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
              {savedTrips.map((trip, tripIndex) => (
                <div key={trip.id || tripIndex} style={{ background: "white", padding: "25px", borderRadius: "20px", border: "1px solid #e3dccd", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
                  
                  {/* Trip Header info */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f0ebe1", paddingBottom: "15px", marginBottom: "20px" }}>
                    <div>
                      <span style={{ background: "#fff3ec", color: "#c1440e", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: "bold", border: "1px solid #f4c2ae" }}>
                        TRIP #{savedTrips.length - tripIndex}
                      </span>
                      <h3 style={{ margin: "8px 0 2px 0", fontSize: "20px", fontWeight: "800" }}>Scheduled for {trip.date || "Today"}</h3>
                      <span style={{ fontSize: "12px", color: "#8a7b6c" }}>Starting from Akkaraipattu Reference Origin</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "12px", color: "#8a7b6c", display: "block" }}>Total Distance: <strong>{trip.totalDistance || 0} km</strong></span>
                      <span style={{ fontSize: "14px", color: "#c1440e", fontWeight: "bold" }}>Total Fee: Rs. {trip.totalFee || 0}</span>
                    </div>
                  </div>

                  {/* Detailed Timeline Cards View matching user screenshot */}
                  <div style={{ position: "relative", paddingLeft: "35px" }}>
                    <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "3px", backgroundColor: "#f4c2ae", zIndex: 1 }} />

                    {trip.places?.map((place, index) => (
                      <div key={place._id || index} style={{ position: "relative", marginBottom: "20px", zIndex: 2 }}>
                        
                        {/* Stop Number Badge */}
                        <div style={{ position: "absolute", left: "-35px", top: "0", width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#c1440e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "13px" }}>
                          {index + 1}
                        </div>

                        {/* Detailed Place Card */}
                        <div style={{ background: "#faf8f5", padding: "18px", borderRadius: "16px", border: "1px solid #e3dccd", display: "flex", gap: "18px", alignItems: "center" }}>
                          <img
                            src={getPlaceImage(place.name)}
                            alt={place.name}
                            style={{ width: "130px", height: "100px", borderRadius: "10px", objectFit: "cover", flexShrink: 0 }}
                          />
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                <span style={{ background: "#fff3ec", color: "#c1440e", padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "bold", border: "1px solid #f4c2ae" }}>
                                  STOP {index + 1}
                                </span>
                                <h4 style={{ margin: "5px 0 2px 0", fontSize: "16px", fontWeight: "800", color: "#2e241c" }}>{place.name}</h4>
                              </div>
                              <button
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " Akkaraipattu")}`, "_blank")}
                                style={{ padding: "6px 12px", border: "1px solid #e3dccd", background: "white", borderRadius: "8px", cursor: "pointer", fontSize: "11px", fontWeight: "bold" }}
                              >
                                DIRECTIONS ↗
                              </button>
                            </div>

                            <p style={{ margin: "6px 0 10px 0", fontSize: "12px", color: "#666", lineHeight: "1.3" }}>
                              {place.description || "A wonderful destination near Akkaraipattu offering an amazing day tour experience."}
                            </p>

                            <div style={{ display: "flex", gap: "20px", fontSize: "11px", color: "#8a7b6c", background: "white", padding: "8px 12px", borderRadius: "8px", border: "1px solid #efece6" }}>
                              <span>📍 <strong>Distance:</strong> {place.distanceFromAkkaraipattu} km</span>
                              <span>🎟️ <strong>Fee:</strong> {place.entryFee === 0 ? "Free Entry" : `Rs. ${place.entryFee}`}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Dashboard;