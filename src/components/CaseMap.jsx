import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { supabaseService } from '../services/supabaseClient';

export default function CaseMap() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabaseService.getCases(50); // Get up to 50 cases
        if (error) {
          throw new Error(error.message);
        }
        setCases(data || []);
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError('Failed to load case locations');
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  // Color and radius logic (can be customized by type/severity)
  const getColor = () => 'rgba(0,191,165,0.45)'; // teal, semi-transparent
  const getRadius = () => 22; // can be dynamic

  return (
    <div className="w-full h-[220px] relative overflow-hidden" style={{
      border: '2px solid #00BFA5',
      boxShadow: '0 0 12px 2px #00BFA533, 0 0 32px 4px #00BFA522',
      background: 'rgba(20, 24, 40, 0.7)',
      filter: 'drop-shadow(0 0 6px #00BFA533)',
    }}>
      <style>{`
        .leaflet-container {
          background: transparent !important;
          border: none !important;
        }
        .case-link {
          color: #00BFA5;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 600;
        }
        .case-link:hover {
          color: #009688;
        }
      `}</style>
      {/* Map */}
      {loading ? (
        <div className="flex items-center justify-center h-full text-accent font-semibold text-lg">Loading map...</div>
      ) : error ? (
        <div className="flex items-center justify-center h-full text-error font-semibold text-lg">{error}</div>
      ) : (
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true} zoomControl={false} attributionControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
          />
          {cases.filter(c => (c.latlng && typeof c.latlng.lat === 'number' && typeof c.latlng.lng === 'number') || (Array.isArray(c.coordinates) && c.coordinates.length === 2)).map((c) => {
            // Prefer latlng, fallback to coordinates
            let center = null;
            if (c.latlng && typeof c.latlng.lat === 'number' && typeof c.latlng.lng === 'number') {
              center = [c.latlng.lat, c.latlng.lng];
            } else if (Array.isArray(c.coordinates) && c.coordinates.length === 2) {
              center = c.coordinates;
            }
            if (!center) return null;
            return (
              <CircleMarker
                key={c.id}
                center={center}
                radius={getRadius(c)}
                pathOptions={{ color: 'rgba(0,191,165,0.7)', fillColor: getColor(c), fillOpacity: 0.7 }}
                stroke={false}
              >
                <Popup>
                  <strong>{c.city}, {c.country}</strong><br />
                  <a
                    href={`/case-viewer-details?id=${c.id}`}
                    className="case-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {c.title}
                  </a>
                  <br />
                  {c.description}
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
} 