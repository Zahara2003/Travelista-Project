import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Asset imports
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

// Leaflet map marker configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Home Location Coordinates (Akkaraipattu Reference Origin)
const homeLocation = [7.2193, 81.8450];

// Custom Home Location Marker (🏠)
const homeIcon = L.divIcon({
  className: "home-marker",
  html: `<div style="font-size: 16px; background: #2e241c; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white; font-weight: bold;">🏠</div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

// Custom Stop Marker (Numbered Badges)
const createMarkerIcon = (number) => L.divIcon({
  className: "custom-map-marker",
  html: `<div style="background: #c1440e; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 13px; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">${number}</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const CreateItinerary = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [places, setPlaces] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const userEmail = user?.email || "guest@travelista.lk";

  // Fetch destination places from API & sync active planner places
  useEffect(() => {
    axios
      .get(`${API}/places`)
      .then((res) => {
        setPlaces(res.data);
        
        // Load active planner places saved from PlaceDetails page
        const activePlan = JSON.parse(localStorage.getItem("activePlannerPlaces") || "[]");
        if (activePlan.length > 0) {
          setSelectedPlaces(activePlan);
        }
      })
      .catch(console.error);
  }, [API]);

  // Image mapping helper
  const getPlaceImage = (placeName) => {
    if (!placeName) return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    if (placeName.includes("Food Champ")) return foodChampImg;

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
      default: return "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";
    }
  };

  // Toggle place selection and sync with localStorage
  const togglePlace = (place) => {
    const exists = selectedPlaces.some((p) => p._id === place._id);
    let updated;
    if (exists) {
      updated = selectedPlaces.filter((p) => p._id !== place._id);
    } else {
      if (selectedPlaces.length >= 5) {
        alert("You can select a maximum of 5 places per itinerary.");
        return;
      }
      updated = [...selectedPlaces, place];
    }
    setSelectedPlaces(updated);
    localStorage.setItem("activePlannerPlaces", JSON.stringify(updated));
  };

  // Sort places by distance
  const sortedPlaces = [...selectedPlaces].sort((a, b) => 
    (a.distanceFromAkkaraipattu || 0) - (b.distanceFromAkkaraipattu || 0)
  );

  // FIXED: Filter places using both Search input AND Active Category selection
  const filteredPlaces = places.filter((place) => {
    const matchesSearch = place.name?.toLowerCase().includes(search.toLowerCase());
    
    if (activeCategory === "All") {
      return matchesSearch;
    }

    const placeCat = (place.category || "").toLowerCase();
    const activeCat = activeCategory.toLowerCase();

    // Matching categories (handling partial match like 'Religious Sites' for 'Religious')
    const matchesCategory = 
      placeCat === activeCat || 
      placeCat.includes(activeCat) || 
      activeCat.includes(placeCat);

    return matchesSearch && matchesCategory;
  });

  // Totals calculations
  const totalDistance = sortedPlaces.reduce((sum, p) => sum + Number(p.distanceFromAkkaraipattu || 0), 0).toFixed(1);
  const totalFee = sortedPlaces.reduce((sum, p) => sum + Number(p.entryFee || 0), 0);

  // Open Google Maps navigation link
  const handleOpenGoogleMaps = () => {
    if (sortedPlaces.length === 0) return;
    const names = sortedPlaces.map(p => encodeURIComponent(p.name + ", Akkaraipattu")).join("/");
    window.open(`https://www.google.com/maps/dir/Akkaraipattu/${names}`, "_blank");
  };

  // Save itinerary handler for multiple trips with date
  const saveItinerary = () => {
    if (!user) {
      alert("Please log in or register to save this itinerary for future use.");
      navigate("/login");
      return;
    }

    const storageKey = `savedItineraries_${userEmail}`;

    const newTrip = {
      id: Date.now(),
      date: new Date().toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      places: sortedPlaces,
      totalFee,
      totalDistance
    };

    const existingTrips = JSON.parse(localStorage.getItem(storageKey) || "[]");
    const updatedTrips = [newTrip, ...existingTrips];

    localStorage.setItem(storageKey, JSON.stringify(updatedTrips));
    localStorage.setItem("savedItineraries", JSON.stringify(updatedTrips)); 
    
    alert("Itinerary saved successfully to your dashboard!");
    navigate("/dashboard");
  };

  // Print PDF handler
  const downloadPDF = () => {
    window.print();
  };

  // Route Coordinates connecting starting Home Location to selected stops
  const routeCoordinates = [
    homeLocation,
    ...sortedPlaces.filter(p => p.latitude && p.longitude).map(p => [Number(p.latitude), Number(p.longitude)])
  ];

  // Category Buttons aligning with actual DB categories
  const categoryList = ["All", "Beaches", "Parks", "Religious Sites", "Landmarks", "Rooms", "Restaurants"];

  return (
    <div className="itinerary-page-container" style={{ backgroundColor: "#faf8f5", minHeight: "100vh", padding: "20px 40px", fontFamily: "sans-serif", color: "#2e241c" }}>
      
      {/* Print PDF styles */}
      <style>
        {`
          @media print {
            nav, header, .no-print, .builder-top-section {
              display: none !important;
            }

            .printable-itinerary-section {
              display: block !important;
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              box-shadow: none !important;
              background: white !important;
            }

            body, .itinerary-page-container {
              background: white !important;
              padding: 0 !important;
            }

            .timeline-item {
              page-break-inside: avoid;
            }
          }
        `}
      </style>

      {/* Top Builder Section */}
      <div className="builder-top-section" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "20px", marginBottom: "35px" }}>
        
        {/* Left selector panel */}
        <div style={{ background: "white", padding: "20px", borderRadius: "16px", border: "1px solid #e3dccd", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <div>
              <span style={{ fontSize: "10px", color: "#8a7b6c", fontWeight: "bold" }}>Akkaraipattu, Sri Lanka</span>
              <h2 style={{ margin: "2px 0 0 0", fontSize: "18px", fontWeight: "800" }}>Pick Day Places</h2>
            </div>
            <div style={{ background: "#fff3ec", border: "1px solid #f4c2ae", padding: "6px 12px", borderRadius: "20px", textAlign: "center" }}>
              <span style={{ fontSize: "12px", fontWeight: "bold", color: "#c1440e" }}>{selectedPlaces.length}/5</span>
              <span style={{ fontSize: "10px", color: "#8a7b6c", display: "block" }}>Stops Selected</span>
            </div>
          </div>

          {/* Search box */}
          <input
            type="text"
            placeholder="Search spots, beach, food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "10px 14px", borderRadius: "10px", border: "1px solid #e3dccd", outline: "none", fontSize: "13px", marginBottom: "12px", boxSizing: "border-box" }}
          />

          {/* Category filter pills - Updated to match DB Schema Categories */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "15px", flexWrap: "wrap" }}>
            {categoryList.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "5px 12px",
                  borderRadius: "15px",
                  border: "none",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: activeCategory === cat ? "#c1440e" : "#f0ebe1",
                  color: activeCategory === cat ? "white" : "#666",
                  transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Place cards list */}
          <div style={{ maxHeight: "380px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "4px" }}>
            {filteredPlaces.length === 0 ? (
              <div style={{ textAlign: "center", padding: "30px 10px", color: "#8a7b6c", fontSize: "13px" }}>
                No places found for <strong>"{activeCategory}"</strong>
              </div>
            ) : (
              filteredPlaces.map((place) => {
                const isSelected = selectedPlaces.some((p) => p._id === place._id);
                return (
                  <div
                    key={place._id}
                    onClick={() => togglePlace(place)}
                    style={{
                      display: "flex",
                      gap: "12px",
                      padding: "8px",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #c1440e" : "1px solid #eee",
                      backgroundColor: isSelected ? "#fffaf7" : "#fff",
                      cursor: "pointer",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={getPlaceImage(place.name)}
                      alt={place.name}
                      style={{ width: "65px", height: "65px", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <div style={{ flexGrow: 1, overflow: "hidden" }}>
                      <span style={{ fontSize: "10px", color: "#c1440e", fontWeight: "bold" }}>
                        {place.category || "Spot"}
                      </span>
                      <h4 style={{ margin: "2px 0", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {place.name}
                      </h4>
                      <span style={{ fontSize: "11px", color: "#8a7b6c" }}>
                        {place.distanceFromAkkaraipattu} km • {place.entryFee === 0 ? "Free" : `Rs. ${place.entryFee}`}
                      </span>
                    </div>
                    <button
                      style={{
                        backgroundColor: isSelected ? "#c1440e" : "#f0ebe1",
                        color: isSelected ? "white" : "#333",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "11px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      {isSelected ? "✓ Added" : "+ Add"}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right map visualizer */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #e3dccd", overflow: "hidden", height: "540px", position: "relative" }}>
          <MapContainer center={homeLocation} zoom={12} style={{ width: "100%", height: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            
            {/* Home Location Marker */}
            <Marker position={homeLocation} icon={homeIcon}>
              <Popup><strong>Start Point</strong><br />Home Origin (Akkaraipattu)</Popup>
            </Marker>

            {/* Selected Places Markers */}
            {sortedPlaces.map((place, index) => (
              place.latitude && place.longitude && (
                <Marker key={place._id || index} position={[Number(place.latitude), Number(place.longitude)]} icon={createMarkerIcon(index + 1)}>
                  <Popup><strong>Stop {index + 1}: {place.name}</strong></Popup>
                </Marker>
              )
            ))}

            {/* Polyline from Home location through stops */}
            {routeCoordinates.length > 1 && (
              <Polyline positions={routeCoordinates} color="#c1440e" weight={4} dashArray="6, 8" />
            )}
          </MapContainer>
          <div style={{ position: "absolute", bottom: "15px", left: "15px", background: "rgba(255,255,255,0.95)", padding: "8px 16px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", zIndex: 1000 }}>
            🏠 Starting from Home Origin • {sortedPlaces.length} Stops Active
          </div>
        </div>
      </div>

      {/* Generated Itinerary and Timeline Section */}
      {sortedPlaces.length > 0 && (
        <div className="printable-itinerary-section" style={{ background: "white", padding: "30px", borderRadius: "20px", border: "1px solid #e3dccd", boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
          
          {/* Header actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#c1440e", fontWeight: "800", letterSpacing: "1px" }}>● GENERATED ONE-DAY ITINERARY</span>
              <h1 style={{ margin: "4px 0", fontSize: "28px", fontWeight: "800" }}>My Akkaraipattu Day Tour</h1>
              <p style={{ margin: 0, fontSize: "13px", color: "#8a7b6c" }}>Scheduled for Today • Starting from Home Origin</p>
            </div>
            
            {/* Control buttons */}
            <div className="no-print" style={{ display: "flex", gap: "10px" }}>
              <button onClick={saveItinerary} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #f4c2ae", background: "#fff3ec", color: "#c1440e", cursor: "pointer", fontWeight: "700", fontSize: "13px" }}>
                💾 Save Itinerary
              </button>
              <button onClick={downloadPDF} style={{ padding: "10px 18px", borderRadius: "10px", border: "1px solid #e3dccd", background: "white", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                📄 Export PDF
              </button>
              <button onClick={handleOpenGoogleMaps} style={{ padding: "10px 18px", borderRadius: "10px", border: "none", background: "#2e241c", color: "white", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}>
                ↗ Share / Open Maps
              </button>
            </div>
          </div>

          {/* Quick stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1.5fr", gap: "20px", background: "#faf8f5", padding: "20px", borderRadius: "14px", marginBottom: "30px", border: "1px solid #f0ebe1" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#8a7b6c", fontWeight: "bold" }}>TOTAL STOPS</span>
              <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#2e241c" }}>{sortedPlaces.length} Places</h3>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#8a7b6c", fontWeight: "bold" }}>ESTIMATED TRAVEL</span>
              <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#2e241c" }}>{totalDistance} km</h3>
            </div>
            <div>
              <span style={{ fontSize: "11px", color: "#8a7b6c", fontWeight: "bold" }}>TOTAL FEES</span>
              <h3 style={{ margin: "4px 0 0 0", fontSize: "20px", color: "#c1440e" }}>Rs. {totalFee}</h3>
            </div>
            <div className="no-print" style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
              <button onClick={handleOpenGoogleMaps} style={{ padding: "12px 20px", background: "#2e241c", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", fontSize: "13px", cursor: "pointer" }}>
                🧭 OPEN FULL ROUTE IN GOOGLE MAPS
              </button>
            </div>
          </div>

          {/* Vertical timeline */}
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>Day Visit Timeline & Guidance</h3>

          <div style={{ position: "relative", paddingLeft: "35px" }}>
            <div style={{ position: "absolute", left: "15px", top: "10px", bottom: "10px", width: "3px", backgroundColor: "#f4c2ae", zIndex: 1 }} />

            {/* Start Point Item */}
            <div className="timeline-item" style={{ position: "relative", marginBottom: "20px", zIndex: 2 }}>
              <div style={{ position: "absolute", left: "-35px", top: "0", width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#2e241c", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "12px" }}>
                🏠
              </div>
              <div style={{ background: "#faf8f5", padding: "10px 16px", borderRadius: "10px", border: "1px solid #e3dccd" }}>
                <strong style={{ fontSize: "13px", color: "#2e241c" }}>Trip Departure Origin</strong> — <span style={{ fontSize: "12px", color: "#8a7b6c" }}>Akkaraipattu Home Reference</span>
              </div>
            </div>

            {sortedPlaces.map((place, index) => (
              <div key={place._id || index} className="timeline-item" style={{ position: "relative", marginBottom: "25px", zIndex: 2 }}>
                
                {/* Number badge */}
                <div style={{ position: "absolute", left: "-35px", top: "0", width: "28px", height: "28px", borderRadius: "50%", backgroundColor: "#c1440e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "13px" }}>
                  {index + 1}
                </div>

                {/* Place detail card */}
                <div style={{ background: "white", padding: "20px", borderRadius: "16px", border: "1px solid #e3dccd", display: "flex", gap: "20px", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
                  <img
                    src={getPlaceImage(place.name)}
                    alt={place.name}
                    style={{ width: "160px", height: "120px", borderRadius: "12px", objectFit: "cover" }}
                  />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ background: "#fff3ec", color: "#c1440e", padding: "3px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: "bold", border: "1px solid #f4c2ae" }}>
                          STOP {index + 1}
                        </span>
                        <h3 style={{ margin: "6px 0 2px 0", fontSize: "18px", fontWeight: "800" }}>{place.name}</h3>
                      </div>
                      <button
                        className="no-print"
                        onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + " Akkaraipattu")}`, "_blank")}
                        style={{ padding: "6px 14px", border: "1px solid #e3dccd", background: "#faf8f5", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                      >
                        DIRECTIONS ↗
                      </button>
                    </div>

                    <p style={{ margin: "8px 0 12px 0", fontSize: "13px", color: "#666", lineHeight: "1.4" }}>
                      {place.description || "A scenic attraction near Akkaraipattu offering a memorable visiting experience for day travelers."}
                    </p>

                    {/* Travel Tips Box inside Timeline Card */}
                    {(place.travelTips || "Best time to visit is during early morning or late afternoon. Please keep the environment clean and carry drinking water.") && (
                      <div style={{ marginBottom: "12px", background: "#fff3ec", border: "1px solid #f4c2ae", padding: "10px 14px", borderRadius: "8px" }}>
                        <strong style={{ color: "#c1440e", fontSize: "11px", display: "block", marginBottom: "2px" }}>🧳 TRAVEL TIPS & ADVICE</strong>
                        <p style={{ margin: 0, color: "#4a3f35", fontSize: "12px", lineHeight: "1.4" }}>
                          {place.travelTips && place.travelTips.trim() !== "" 
                            ? place.travelTips 
                            : "Best time to visit is during early morning or late afternoon. Please keep the environment clean and carry drinking water."}
                        </p>
                      </div>
                    )}

                    <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "#8a7b6c", background: "#faf8f5", padding: "10px 14px", borderRadius: "8px" }}>
                      <span>📍 <strong>Distance:</strong> {place.distanceFromAkkaraipattu} km</span>
                      <span>🎟️ <strong>Fee:</strong> {place.entryFee === 0 ? "Free Entry" : `Rs. ${place.entryFee}`}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default CreateItinerary;