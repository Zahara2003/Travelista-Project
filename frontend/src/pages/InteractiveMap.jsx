import { useEffect, useState } from "react";
import axios from "axios";
import MapComponent from "../components/MapComponent";

const InteractiveMap = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Places");
  const [maxDistance, setMaxDistance] = useState(25); // Set initial max limit to 25 KM

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      const res = await axios.get(`${API}/places`);
      const allPlaces = res.data || [];
      setPlaces(allPlaces);

      // Initial filter for <= 25 KM
      const initialFiltered = allPlaces.filter(
        (p) => (p.distanceFromAkkaraipattu || 0) <= 25
      );
      setFilteredPlaces(initialFiltered);
    } catch (error) {
      console.error("Error loading places:", error);
    }
  };

  // Filter based on Category and Distance (KM)
  const handleFilter = (category) => {
    setSelectedCategory(category);
    filterData(category, maxDistance);
  };

  const handleDistanceChange = (e) => {
    const dist = Number(e.target.value);
    setMaxDistance(dist);
    filterData(selectedCategory, dist);
  };

  const filterData = (category, distance) => {
    let temp = places;

    // Category Filter
    if (category !== "All Places") {
      temp = temp.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Distance Filter (Max range capped at 25 KM)
    temp = temp.filter(
      (p) => (p.distanceFromAkkaraipattu || 0) <= distance
    );

    setFilteredPlaces(temp);
  };

  // Database Categories
  const categories = [
    "All Places",
    "Beaches",
    "Parks",
    "Religious Sites",
    "Landmarks",
    "Agricultural areas",
    "Restaurants",
    "Rooms"
  ];

  return (
    <div style={{ padding: "30px", maxWidth: "1250px", margin: "0 auto", fontFamily: "Inter, sans-serif", backgroundColor: "#fdfbf7", minHeight: "100vh" }}>
      
      {/* Top Banner Header */}
      <div style={{ background: "#ffffff", padding: "24px 30px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(46, 36, 28, 0.08)", border: "1px solid #e3dccd", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "20px" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#c1440e", letterSpacing: "1px", background: "#fff3ec", padding: "4px 10px", borderRadius: "20px" }}>
            📍 VISUAL GEOGRAPHIC RADAR
          </span>
          <h1 style={{ fontSize: "26px", color: "#2e241c", margin: "8px 0 4px" }}>Interactive Map</h1>
          <p style={{ color: "#8a7b6c", fontSize: "13px", margin: 0 }}>
            Interactive spatial layout of tourist places plotted relative to Akkaraipattu town and the eastern coastal corridor.
          </p>
        </div>

        {/* Distance Range Control Capped at Max 25 KM */}
        <div style={{ background: "#fdfbf7", padding: "12px 18px", borderRadius: "12px", border: "1px solid #e3dccd", minWidth: "240px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: "600", color: "#4a3f35", marginBottom: "6px" }}>
            <span>MAX DISTANCE: <strong style={{ color: "#c1440e" }}>{maxDistance} KM</strong></span>
            <span style={{ color: "#8a7b6c", fontWeight: "normal" }}>{filteredPlaces.length} Visible</span>
          </div>
          <input
            type="range"
            min="1"
            max="25"
            value={maxDistance}
            onChange={handleDistanceChange}
            style={{ width: "100%", accentColor: "#c1440e", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Category Filter Buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleFilter(cat)}
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid #e3dccd",
              background: selectedCategory === cat ? "#c1440e" : "#ffffff",
              color: selectedCategory === cat ? "#ffffff" : "#4a3f35",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 5px rgba(0,0,0,0.02)"
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map Container Box */}
      <div style={{ background: "#ffffff", padding: "15px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(46, 36, 28, 0.08)", border: "1px solid #e3dccd" }}>
        <MapComponent places={filteredPlaces} />
      </div>

    </div>
  );
};

export default InteractiveMap;