"use client";
import axios from "axios";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";

const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });
const Polyline = dynamic(() => import("react-leaflet").then(m => m.Polyline), { ssr: false });
const ChangeView = dynamic(() => import("../../../components/ChangeView"), { ssr: false });

export default function HomePage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [responseData, setResponse] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const L = require("leaflet");
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (location) {
      fetchHospitals(location.lat, location.lng);
    }
  }, [location]);

  const getLocation = () => {
    setLoading(true);
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setLoading(false)
      );
    }
  };

  const fetchHospitals = async (lat: number, lng: number) => {
    try {
      const res = await axios.post('https://fastapi-backend-4-ue78.onrender.com/api/nearest-hospital', {
        latitude: lat,
        longitude: lng
      });
      setResponse(res.data);
    } catch (err) {
      console.error("API Error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans">
      <div className="w-full md:w-[400px] h-full overflow-y-auto p-6 border-r bg-white shadow-xl z-10 flex flex-col">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-blue-600 tracking-tight">HOSPITAL FINDER</h1>
          <p className="text-slate-500 text-sm">Real-time emergency location services</p>
        </div>

        <button
          onClick={getLocation}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98]"
        >
          {loading ? "SEARCHING..." : "FIND NEAREST CARE"}
        </button>

        <div className="mt-8 flex-1">
          {responseData.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Results Nearby</h2>
              {responseData.map((h, i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-300 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-800 truncate pr-2">Hospital {h.id}</h3>
                    <span className="text-blue-600 font-bold text-xs">{h.distance_km.toFixed(1)} km</span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{h.City}, {h.District}</p>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-semibold px-2 py-1 bg-white rounded border border-slate-200">⭐ {h.Rating || "N/A"}</span>
                     <a 
                      href={`https://www.google.com/maps/dir/?api=1&origin=${location?.lat},${location?.lng}&destination=${h.Latitude},${h.Longitude}`}
                      target="_blank" 
                      className="text-xs font-bold text-blue-600 hover:underline"
                     >
                       DIRECTIONS →
                     </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 opacity-40 italic">No hospitals loaded yet.</div>
          )}
        </div>
      </div>

     
      <div className="flex-1 h-full relative">
        {!location ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
            Waiting for GPS signal...
          </div>
        ) : (
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={13}
            className="w-full h-full"
          >
            <ChangeView center={[location.lat, location.lng]} zoom={13} />
            <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />
            
            <Marker position={[location.lat, location.lng]}>
              <Popup>You are here</Popup>
            </Marker>

            {responseData.map((h: any, index: number) => (
              <div key={index}>
                <Marker position={[h.Latitude, h.Longitude]}>
                  <Popup>
                    <div className="font-sans">
                      <p className="font-bold">Hospital {h.id}</p>
                      <p className="text-blue-600 text-xs font-bold">{h.distance_km.toFixed(2)} km away</p>
                    </div>
                  </Popup>
                </Marker>
                <Polyline 
                  positions={[[location.lat, location.lng], [h.Latitude, h.Longitude]]}
                  pathOptions={{ color: '#c60d0d', weight: 1.5, dashArray: '10, 10', opacity: 0.5 }}
                />
              </div>
            ))}
          </MapContainer>
        )}
      </div>
    </main>
  );
}