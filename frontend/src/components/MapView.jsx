import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue with webpack/vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Simple hash function to generate consistent lat/lng from location string
const locationToCoords = (location) => {
    let hash = 0;
    for (let i = 0; i < location.length; i++) {
        const char = location.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const lat = 20 + (Math.abs(hash % 3000) / 100);
    const lng = -120 + (Math.abs((hash * 7) % 8000) / 100);
    return [lat, lng];
};

const MapView = ({ spaces, onSelectSpace, darkMode }) => {
    if (!spaces || spaces.length === 0) return null;

    const markers = spaces.map(s => ({
        ...s,
        coords: locationToCoords(s.location || 'default')
    }));

    const center = markers.length > 0 ? markers[0].coords : [37.7749, -122.4194];

    return (
        <div className={`rounded-2xl overflow-hidden border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} style={{ height: '400px' }}>
            <MapContainer center={center} zoom={4} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url={darkMode
                        ? 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
                        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    }
                />
                {markers.map(space => (
                    <Marker key={space._id} position={space.coords}>
                        <Popup>
                            <div style={{ minWidth: '150px' }}>
                                <strong>{space.title}</strong><br />
                                <span style={{ color: '#666', fontSize: '12px' }}>📍 {space.location}</span><br />
                                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>${space.price}/hr</span><br />
                                {onSelectSpace && (
                                    <button
                                        onClick={() => onSelectSpace(space)}
                                        style={{ marginTop: '8px', padding: '4px 12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        View Details
                                    </button>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
