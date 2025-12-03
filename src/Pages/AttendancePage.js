import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const AttendancePage = () => {
    const [coords, setCoords] = useState(null);
    const [errorLoc, setErrorLoc] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setCoords({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    console.log("Lokasi ditemukan:", position.coords);
                },
                (error) => {
                    setErrorLoc("Gagal mengambil lokasi: " + error.message);
                }
            );
        } else {
            setErrorLoc("Browser ini tidak mendukung Geolocation.");
        }
    }, []);

    const kirimAbsen = async (jenis) => {
        const token = localStorage.getItem('token');
        if (!token) return alert("Silakan login dulu!");

        if (!coords) {
            alert("Lokasi belum ditemukan. Pastikan GPS aktif.");
            return;
        }

        // Mapping jenis absen ke route backend
        const jenisRouteMap = {
            'check-in': 'checkin',
            'check-out': 'checkout'
        };

        try {
            const url = `http://localhost:3001/api/presensi/${jenisRouteMap[jenis]}`;
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // FIX TERPENTING → check-in & check-out sama-sama kirim lokasi
            const payload = {
                latitude: coords.lat,
                longitude: coords.lng
            };

            console.log("Payload dikirim:", payload);

            const response = await axios.post(url, payload, config);
            setStatus(response.data.message);
            alert(response.data.message);

        } catch (error) {
            const errMsg = error.response?.data?.message || "Gagal melakukan presensi";
            setStatus(errMsg);
            alert(errMsg);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto mt-10 p-5 flex justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Presensi & Lokasi</h2>

                    {status && <div className="mb-4 p-2 bg-blue-100 text-blue-700 rounded">{status}</div>}
                    {errorLoc && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{errorLoc}</div>}

                    {/* MAP */}
                    <div className="mb-6 border-2 border-blue-200 rounded-lg overflow-hidden h-64 relative bg-gray-200">
                        {coords ? (
                            <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; OpenStreetMap contributors'
                                />
                                <Marker position={[coords.lat, coords.lng]}>
                                    <Popup>Lokasi Kamu Saat Ini</Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full animate-pulse">
                                <p className="text-gray-500 font-semibold">📡 Sedang melacak lokasimu...</p>
                            </div>
                        )}
                    </div>

                    {coords && (
                        <p className="text-xs text-gray-500 mb-6 font-mono">
                            Lat: {coords.lat.toFixed(6)}, Lng: {coords.lng.toFixed(6)}
                        </p>
                    )}

                    {/* BUTTON */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => kirimAbsen('check-in')}
                            disabled={!coords}
                            className={`w-full py-3 rounded-lg font-bold text-white transition ${coords ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
                        >
                            MASUK (Check-In)
                        </button>

                        <button
                            onClick={() => kirimAbsen('check-out')}
                            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold transition"
                        >
                            PULANG (Check-Out)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
