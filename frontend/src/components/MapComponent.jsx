import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';

// Custom Marker Icon (படங்கள் லோட் ஆகாத பிழையைத் தவிர்க்க)
const customIcon = L.divIcon({
  className: 'custom-map-marker',
  html: `<div style="background-color: #c1440e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">📍</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12]
});

function MapComponent({ places }) {
  // அக்காரப்பற்று மையப் பகுதி
  const center = [7.22, 81.84];

  return (
    <div style={{ borderRadius: "12px", border: "1px solid #e3dccd", overflow: "hidden" }}>
      {/* மேப்பை கறுப்பு நிறமாக மாற்ற CSS Filter */}
      <div style={{ filter: "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '550px', width: '100%', backgroundColor: '#0f172a' }}
        >
          {/* API Key வாட்டர்மார்க் இல்லாத இலவச மேப் */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          
          {places?.map((place) => {
            // டேட்டாபேஸில் எண்கள் இல்லாத இடங்களை மேப்பில் காட்டாமல் தவிர்க்க
            if (!place.latitude || !place.longitude) return null;

            return (
              <Marker
                key={place._id}
                // இங்குதான் லொகேஷன் சரியாக விழும்: [latitude, longitude]
                position={[place.latitude, place.longitude]}
                icon={customIcon}
              >
                {/* KM தூரம் நிரந்தரமாகத் தெரியும் */}
                <Tooltip direction="right" offset={[10, 0]} opacity={1} permanent={true}>
                  <span style={{ fontWeight: 'bold', color: '#c1440e', backgroundColor: '#ffffff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>
                    {place.distanceFromAkkaraipattu || 0} km
                  </span>
                </Tooltip>

                <Popup>
                  {/* மேப் கறுப்பாக மாறியிருப்பதால், பாப்-அப் எழுத்துக்களைத் தெளிவாகக் காட்ட மீன்டும் Invert செய்யப்பட்டுள்ளது */}
                  <div style={{ textAlign: "left", minWidth: "180px", fontFamily: "Inter, sans-serif", filter: "invert(100%) hue-rotate(180deg)" }}>
                    
                    <h3 style={{ margin: "0 0 4px", fontSize: "16px", color: "#2e241c", fontWeight: "700" }}>
                      {place.name}
                    </h3>
                    <p style={{ margin: "0 0 12px", fontSize: "12px", color: "#8a7b6c", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      {place.category}
                    </p>
                    
                    <div style={{ marginBottom: "10px" }}>
                      <Link 
                        to={`/place/${place._id}`} 
                        style={{ 
                          display: "inline-block", 
                          background: "#c1440e", 
                          color: "#ffffff", 
                          padding: "6px 14px", 
                          borderRadius: "6px", 
                          textDecoration: "none", 
                          fontSize: "12px", 
                          fontWeight: "600" 
                        }}
                      >
                        View Details →
                      </Link>
                    </div>

                    <div style={{ fontSize: "12px", color: "#6b5d52", fontWeight: "500", borderTop: "1px solid #e3dccd", paddingTop: "6px" }}>
                      Distance: <strong style={{ color: "#c1440e" }}>{place.distanceFromAkkaraipattu || 0} KM</strong>
                    </div>

                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapComponent;