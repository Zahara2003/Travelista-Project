import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [distance, setDistance] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [facilities, setFacilities] = useState("");
  const [travelTips, setTravelTips] = useState(""); // 1. Travel Tips State Add Panniyathu
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [entryFee, setEntryFee] = useState("");
  const [image, setImage] = useState(null);

  const [places, setPlaces] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const fetchPlaces = async () => {
    try {
      const response = await axios.get(`${API}/places`);
      setPlaces(response.data);
    } catch (error) {
      console.error("Error fetching places:", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("distanceFromAkkaraipattu", distance);
    formData.append("operatingHours", operatingHours);
    formData.append("facilities", facilities);
    formData.append("travelTips", travelTips); // 2. FormData-il Travel Tips Appended
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("entryFee", entryFee);

    if (image) {
      formData.append("imageFile", image);
    }

    try {
      if (editingId) {
        await axios.put(`${API}/places/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("🎉 Place updated successfully!");
      } else {
        await axios.post(`${API}/places`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("🎉 Place added successfully!");
      }

      resetForm();
      fetchPlaces();
    } catch (error) {
      console.error("Error saving place:", error);
      alert("❌ Failed to save place. Check console.");
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setDistance("");
    setOperatingHours("");
    setFacilities("");
    setTravelTips(""); // 3. Reset-la Travel Tips Clear Aagum
    setLatitude("");
    setLongitude("");
    setEntryFee("");
    setImage(null);
    setEditingId(null);
  };

  const handleEdit = (place) => {
    setEditingId(place._id);
    setName(place.name);
    setDescription(place.description);
    setCategory(place.category);
    setDistance(place.distanceFromAkkaraipattu);
    setOperatingHours(place.operatingHours);
    setFacilities(Array.isArray(place.facilities) ? place.facilities.join(", ") : place.facilities);
    setTravelTips(place.travelTips || ""); // 4. Edit panra pothu pre-fill aagum
    setLatitude(place.latitude);
    setLongitude(place.longitude);
    setEntryFee(place.entryFee);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this place?")) {
      try {
        await axios.delete(`${API}/places/${id}`);
        alert("🗑️ Place deleted successfully!");
        fetchPlaces();
      } catch (error) {
        console.error("Error deleting place:", error);
      }
    }
  };

  return (
    <div style={{ padding: "40px 24px", maxWidth: "1400px", margin: "0 auto", backgroundColor: "#fdfbf7", minHeight: "90vh", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h2 style={{ color: "#2e241c", fontSize: "28px", fontWeight: "700", margin: "0 0 6px 0" }}>Admin Dashboard</h2>
          <p style={{ color: "#8a7b6c", fontSize: "14px", margin: 0 }}>Manage tourist destinations, update details, and oversee platform content with Travelista theme.</p>
        </div>
        <div style={{ background: "#fff3ec", border: "1px solid #f4c2ae", padding: "8px 16px", borderRadius: "10px", color: "#c1440e", fontWeight: "600", fontSize: "14px" }}>
          Total Destinations: {places.length}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "30px", alignItems: "start" }}>
        
        {/* Left Side: Form Card */}
        <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "18px", boxShadow: "0 10px 30px rgba(46, 36, 28, 0.05)", border: "1px solid #e3dccd" }}>
          <h3 style={{ fontSize: "18px", color: "#2e241c", marginBottom: "20px", borderBottom: "2px solid #f4f0ec", paddingBottom: "12px", fontWeight: "700" }}>
            {editingId ? "✏️ Edit Destination" : "➕ Add New Destination"}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Place Name</label>
              <input type="text" placeholder="e.g. Deegavapi Stupa" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} required style={inputStyle}>
                <option value="" disabled>Select Category</option>
                <option value="Parks">Parks</option>
                <option value="Beaches">Beaches</option>
                <option value="Religious Sites">Religious Sites</option>
                <option value="Landmarks">Landmarks</option>
                <option value="Rooms">Rooms</option>
                <option value="Restaurants">Restaurants</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Distance (km)</label>
                <input type="number" step="any" placeholder="0.0" value={distance} onChange={(e) => setDistance(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Entry Fee (Rs.)</label>
                <input type="number" placeholder="0" value={entryFee} onChange={(e) => setEntryFee(e.target.value)} required style={inputStyle} />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Operating Hours</label>
              <input type="text" placeholder="e.g. 6:00 AM - 6:00 PM" value={operatingHours} onChange={(e) => setOperatingHours(e.target.value)} required style={inputStyle} />
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Facilities (comma separated)</label>
              <input type="text" placeholder="Parking, Restrooms, WiFi" value={facilities} onChange={(e) => setFacilities(e.target.value)} required style={inputStyle} />
            </div>

            {/* 5. Travel Tips Textarea Field Added Here */}
            <div style={formGroupStyle}>
              <label style={labelStyle}>Travel Tips & Advice</label>
              <textarea placeholder="Write helpful travel tips for visitors..." value={travelTips} onChange={(e) => setTravelTips(e.target.value)} rows="2" style={{ ...inputStyle, resize: "vertical" }}></textarea>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "16px" }}>
              <div>
                <label style={labelStyle}>Latitude</label>
                <input type="number" step="any" placeholder="7.2215" value={latitude} onChange={(e) => setLatitude(e.target.value)} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Longitude</label>
                <input type="number" step="any" placeholder="81.8436" value={longitude} onChange={(e) => setLongitude(e.target.value)} required style={inputStyle} />
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Description</label>
              <textarea placeholder="Write a brief overview..." value={description} onChange={(e) => setDescription(e.target.value)} rows="3" required style={{ ...inputStyle, resize: "vertical" }}></textarea>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Destination Image</label>
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ padding: "10px", width: "100%", fontSize: "13px", background: "#fdfbf7", borderRadius: "10px", border: "1px dashed #c4b5a2", boxSizing: "border-box", cursor: "pointer" }} />
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button type="submit" style={btnStyle}>{editingId ? "Update Destination" : "Save Destination"}</button>
              {editingId && <button type="button" onClick={resetForm} style={cancelBtnStyle}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* Right Side: Table Card */}
        <div style={{ backgroundColor: "#ffffff", padding: "30px", borderRadius: "18px", boxShadow: "0 10px 30px rgba(46, 36, 28, 0.05)", border: "1px solid #e3dccd" }}>
          <h3 style={{ fontSize: "18px", color: "#2e241c", marginBottom: "20px", borderBottom: "2px solid #f4f0ec", paddingBottom: "12px", fontWeight: "700" }}>
            📋 Existing Destinations ({places.length})
          </h3>
          
          {places.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "#8a7b6c" }}>
              <span style={{ fontSize: "35px", display: "block", marginBottom: "10px" }}>🏜️</span>
              <p style={{ margin: 0, fontSize: "14px", fontWeight: "600" }}>No destinations found.</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto", maxHeight: "650px", overflowY: "auto", borderRadius: "10px", border: "1px solid #f4f0ec" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ backgroundColor: "#faf8f5", color: "#5c4033", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px", position: "sticky", top: 0, zIndex: 1 }}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Category</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {places.map((place) => (
                    <tr key={place._id} style={{ borderBottom: "1px solid #f4f0ec", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#faf8f5"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                      <td style={{ ...tdStyle, fontWeight: "600", color: "#2e241c" }}>{place.name}</td>
                      <td style={tdStyle}>
                        <span style={{ backgroundColor: "#fff3ec", color: "#c1440e", padding: "5px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "600", border: "1px solid #f4c2ae" }}>
                          {place.category}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center", whiteSpace: "nowrap" }}>
                        <button onClick={() => handleEdit(place)} style={editBtnStyle}>Edit</button>
                        <button onClick={() => handleDelete(place._id)} style={deleteBtnStyle}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Travelista Theme UI Styles Object
const formGroupStyle = { marginBottom: "16px" };
const labelStyle = { display: "block", fontSize: "12px", fontWeight: "600", color: "#5c4033", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" };
const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: "10px", border: "1px solid #e3dccd", fontSize: "14px", backgroundColor: "#fdfbf7", outline: "none", boxSizing: "border-box", color: "#2e241c", transition: "border-color 0.2s" };
const btnStyle = { flex: 1, padding: "12px", backgroundColor: "#c1440e", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px", transition: "background 0.2s", boxShadow: "0 4px 12px rgba(193, 68, 14, 0.2)" };
const cancelBtnStyle = { padding: "12px 20px", backgroundColor: "#f4f0ec", color: "#5c4033", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px" };
const thStyle = { padding: "14px 16px", fontSize: "12px", fontWeight: "700", color: "#5c4033" };
const tdStyle = { padding: "14px 16px", fontSize: "13px", color: "#4a3f35" };
const editBtnStyle = { padding: "6px 14px", backgroundColor: "#c1440e", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600", marginRight: "8px", transition: "opacity 0.2s" };
const deleteBtnStyle = { padding: "6px 14px", backgroundColor: "#fee2e2", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" };
 
export default AdminDashboard;