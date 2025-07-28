import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import { supabaseService } from '../services/supabaseClient';

export default function CaseMap() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log('🗺️ CaseMap component loaded');

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      console.log('🗺️ Starting to fetch cases...');
      try {
        const { data, error } = await supabaseService.getCases(50); // Get up to 50 cases
        console.log('🗺️ Supabase response:', { data, error });
        if (error) {
          throw new Error(error.message);
        }
        console.log('🗺️ Fetched cases:', data);
        console.log('🗺️ Number of cases:', data?.length || 0);
        if (data && data.length > 0) {
          console.log('🗺️ First case latlng:', data[0].latlng);
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
          {cases.filter(c => {
            // Parse latlng if it's a string
            let parsedLatlng = c.latlng;
            if (typeof c.latlng === 'string') {
              try {
                parsedLatlng = JSON.parse(c.latlng);
              } catch (e) {
                console.log('🗺️ Failed to parse latlng string:', c.latlng);
                parsedLatlng = null;
              }
            }
            
            const hasValidCoords = (parsedLatlng && typeof parsedLatlng.lat === 'number' && typeof parsedLatlng.lng === 'number') || (Array.isArray(c.coordinates) && c.coordinates.length === 2);
            if (!hasValidCoords) {
              console.log('🗺️ Case filtered out - invalid coordinates:', c.title, c.latlng, c.coordinates);
            }
            return hasValidCoords;
          }).map((c) => {
            // Prefer latlng, fallback to coordinates
            let center = null;
            
            // Parse latlng if it's a string
            let parsedLatlng = c.latlng;
            if (typeof c.latlng === 'string') {
              try {
                parsedLatlng = JSON.parse(c.latlng);
              } catch (e) {
                parsedLatlng = null;
              }
            }
            
            if (parsedLatlng && typeof parsedLatlng.lat === 'number' && typeof parsedLatlng.lng === 'number') {
              center = [parsedLatlng.lat, parsedLatlng.lng];
            } else if (Array.isArray(c.coordinates) && c.coordinates.length === 2) {
              center = c.coordinates;
            }
            if (!center) {
              console.log('🗺️ Case has no center coordinates:', c.title);
              return null;
            }
            console.log('🗺️ Rendering marker for:', c.title, 'at', center);
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
                    onClick={() => navigate(`/case-viewer-details?id=${c.id}`)}
                    className="case-link"
                    style={{ cursor: 'pointer' }}
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