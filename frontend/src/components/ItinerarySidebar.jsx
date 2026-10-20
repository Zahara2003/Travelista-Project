import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const homeLocation = [7.2193, 81.8450];

const homeIcon = L.divIcon({
  className: "home-marker",
  html: `<div style="font-size: 16px; background: #c1440e; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.3); font-weight: bold;">🏠</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const createStopIcon = (number) => L.divIcon({
  className: "custom-stop-marker",
  html: `<div style="background: #c1440e; color: white; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px; border: 2px solid white; box-shadow: 0 3px 6px rgba(0,0,0,0.3);">${number}</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

const ItinerarySidebar = ({ selectedPlaces = [], removePlace, totalFee, totalDistance, totalTime }) => {
  const sortedPlaces = [...selectedPlaces].sort((a, b) => 
    (a.distanceFromAkkaraipattu || 0) - (b.distanceFromAkkaraipattu || 0)
  );

  const handleViewFullRoute = () => {
    if (sortedPlaces.length === 0) return;
    const placeNames = sortedPlaces.map(p => encodeURIComponent(p.name + ", Akkaraipattu")).join("/");
    const googleMapsUrl = `https://www.google.com/maps/dir/Akkaraipattu/${placeNames}`;
    window.open(googleMapsUrl, "_blank");
  };

  const routeCoordinates = [
    homeLocation,
    ...sortedPlaces
      .filter(p => p.latitude && p.longitude)
      .map(p => [Number(p.latitude), Number(p.longitude)])
  ];

  return (
    <aside style={{ 
      background: "#ffffff", 
      padding: "22px", 
      borderRadius: "18px", 
      border: "1px solid #e3dccd", 
      position: "sticky", 
      top: "20px",
      boxShadow: "0 12px 35px rgba(46, 36, 28, 0.08)",
      width: "100%",
      boxSizing: "border-box"
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "2px solid #f4f0ec", paddingBottom: "12px", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, color: "#2e241c", fontSize: "16px", fontWeight: "700" }}>
          🧭 Tour Map Locator & Timeline
        </h3>
        <span style={{ background: "#fff3ec", color: "#c1440e", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", border: "1px solid #f4c2ae" }}>
          {sortedPlaces.length} Stops
        </span>
      </div>

      {/* Larger Map Container */}
      <div style={{ width: "100%", height: "280px", borderRadius: "14px", overflow: "hidden", marginBottom: "16px", border: "1px solid #e3dccd" }}>
        <MapContainer center={homeLocation} zoom={11} style={{ width: "100%", height: "100%" }} scrollWheelZoom={true}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          <Marker position={homeLocation} icon={homeIcon}>
            <Popup><strong>Start Point</strong><br/>Akkaraipattu Base</Popup>
          </Marker>

          {sortedPlaces.map((place, index) => (
            place.latitude && place.longitude && (
              <Marker key={place._id || index} position={[Number(place.latitude), Number(place.longitude)]} icon={createStopIcon(index + 1)}>
                <Popup>
                  <strong>Stop {index + 1}: {place.name}</strong>
                </Popup>
              </Marker>
            )
          ))}

          {routeCoordinates.length > 1 && (
            <Polyline positions={routeCoordinates} color="#c1440e" weight={4} dashArray="6, 8" />
          )}
        </MapContainer>
      </div>

      {/* Summary Box */}
      <div style={{ backgroundColor: "#fff3ec", padding: "14px 16px", borderRadius: "12px", border: "1px solid #f4c2ae", marginBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
          <span style={{ color: "#8a7b6c", fontWeight: "600" }}>Total Distance:</span>
          <strong style={{ color: "#c1440e" }}>{totalDistance} km</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
          <span style={{ color: "#8a7b6c", fontWeight: "600" }}>Est. Travel Time:</span>
          <strong style={{ color: "#c1440e" }}>~{totalTime} mins</strong>
        </div>
        <hr style={{ border: "none", borderTop: "1px dashed #f4c2ae", margin: "8px 0" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", alignItems: "center" }}>
          <span style={{ color: "#4a3f35", fontWeight: "700" }}>Total Entry Fee:</span>
          <strong style={{ color: "#c1440e", fontSize: "16px" }}>Rs. {totalFee}</strong>
        </div>
      </div>
      
      {/* Stops List */}
      <div style={{ margin: "10px 0", maxHeight: "240px", overflowY: "auto", paddingRight: "4px" }}>
        {sortedPlaces.length === 0 ? (
          <div style={{ textAlign: "center", color: "#8a7b6c", padding: "25px 15px", background: "#faf8f5", borderRadius: "12px", border: "1px dashed #e3dccd" }}>
            <span style={{ fontSize: "28px", display: "block", marginBottom: "6px" }}>🗺️</span>
            <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#2e241c" }}>No destinations selected</p>
            <p style={{ margin: "4px 0 0 0", fontSize: "11px" }}>Select places from the left to build your route timeline.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sortedPlaces.map((place, index) => (
              <div key={place._id || index} style={{ 
                padding: "10px 12px", 
                background: "#faf8f5",
                borderRadius: "10px",
                border: "1px solid #e3dccd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden" }}>
                  <span style={{ background: "#c1440e", color: "white", borderRadius: "50%", minWidth: "22px", height: "22px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold" }}>
                    {index + 1}
                  </span>
                  <div style={{ overflow: "hidden" }}>
                    <h4 style={{ margin: "0 0 2px 0", color: "#2e241c", fontSize: "13px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {place.name}
                    </h4>
                    <span style={{ fontSize: "11px", color: "#8a7b6c" }}>
                      📍 {place.distanceFromAkkaraipattu} km • 🎟️ {place.entryFee === 0 ? "Free" : `Rs. ${place.entryFee}`}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => removePlace(place._id)} 
                  style={{ 
                    background: "#fee2e2", 
                    color: "#ef4444", 
                    border: "none", 
                    borderRadius: "50%", 
                    width: "22px", 
                    height: "22px", 
                    cursor: "pointer", 
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "10px",
                    flexShrink: 0
                  }}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {sortedPlaces.length > 0 && (
        <button 
          onClick={handleViewFullRoute}
          style={{
            width: "100%",
            backgroundColor: "#2e241c",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "12px",
            fontWeight: "600",
            fontSize: "13px",
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "14px",
            boxShadow: "0 4px 12px rgba(46, 36, 28, 0.15)"
          }}
        >
          🗺️ Open Full Route in Google Maps
        </button>
      )}
    </aside>
  );
};

export default ItinerarySidebar;