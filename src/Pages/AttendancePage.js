import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// ----- Setup default icon Leaflet -----
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// ----- Thumbnail + Modal Component -----
function PhotoThumbnail({ fotoUrl }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <img
        src={fotoUrl}
        alt="Presensi"
        className="w-32 h-32 object-cover rounded-lg cursor-pointer border hover:opacity-80 transition"
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative">
            <img
              src={fotoUrl}
              alt="Presensi Full"
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-xl font-bold"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AttendancePage() {
  const [coords, setCoords] = useState(null);
  const [errorLoc, setErrorLoc] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastPresensi, setLastPresensi] = useState(null); // menyimpan data presensi terakhir

  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
    // Ambil lokasi GPS
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          setCoords({ lat: position.coords.latitude, lng: position.coords.longitude }),
        (error) => setErrorLoc("Gagal mengambil lokasi: " + error.message)
      );
    } else {
      setErrorLoc("Browser ini tidak mendukung Geolocation.");
    }

    // Fetch presensi terakhir
    const fetchLastPresensi = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/presensi/last",
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );
        setLastPresensi(response.data.presensi);
      } catch (err) {
        console.error("Gagal fetch presensi terakhir:", err.response || err);
      }
    };

    fetchLastPresensi();
  }, []);

  // ----- Check-In -----
  const handleCheckIn = async () => {
    if (!coords) return alert("Lokasi belum ditemukan.");
    if (!image) return alert("Silakan ambil foto selfie.");

    try {
      setLoading(true);

      const blob = await (await fetch(image)).blob();
      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("buktiFoto", blob, "selfie.jpg"); // sesuai backend

      const response = await axios.post(
        "http://localhost:3001/api/presensi/checkin",
        formData,
        { headers: { Authorization: `Bearer ${getToken()}`, "Content-Type": "multipart/form-data" } }
      );

      setStatus(response.data.message);
      setLastPresensi(response.data.presensi);
      setImage(null);
      alert(response.data.message);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Gagal melakukan check-in";
      setStatus(errMsg);
      alert(errMsg);
      console.error(err.response || err);
    } finally {
      setLoading(false);
    }
  };

  // ----- Check-Out -----
  const handleCheckOut = async () => {
    if (!coords) return alert("Lokasi belum ditemukan.");

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3001/api/presensi/checkout",
        { latitude: coords.lat, longitude: coords.lng },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      setStatus(response.data.message);
      alert(response.data.message);
    } catch (err) {
      const errMsg = err.response?.data?.message || "Gagal melakukan check-out";
      setStatus(errMsg);
      alert(errMsg);
      console.error(err.response || err);
    } finally {
      setLoading(false);
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
              <MapContainer center={[coords.lat, coords.lng]} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
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

          {/* WEBCAM */}
          <div className="my-4 border rounded-lg overflow-hidden bg-black">
            {image ? (
              <img src={image} alt="Selfie" className="w-full" />
            ) : (
              <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="w-full" />
            )}
          </div>

          <div className="mb-4">
            {!image ? (
              <button onClick={capture} className="bg-blue-500 text-white px-4 py-2 rounded w-full">
                Ambil Foto 📸
              </button>
            ) : (
              <button onClick={() => setImage(null)} className="bg-gray-500 text-white px-4 py-2 rounded w-full">
                Foto Ulang 🔄
              </button>
            )}
          </div>

          {/* Thumbnail foto terakhir */}
          {lastPresensi?.buktiFoto && (
            <div className="my-4">
              <h3 className="font-bold mb-2">Foto Check-In Terakhir:</h3>
              <PhotoThumbnail fotoUrl={`http://localhost:3001/${lastPresensi.buktiFoto}`} />
            </div>
          )}

          {/* BUTTON PRESENSI */}
          <div className="flex flex-col gap-3 mt-4">
            <button
              onClick={handleCheckIn}
              disabled={!coords || !image || loading}
              className={`w-full py-3 rounded-lg font-bold text-white transition ${
                coords && image ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Memproses..." : "MASUK (Check-In)"}
            </button>

            <button
              onClick={handleCheckOut}
              disabled={!coords || loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 font-bold transition"
            >
              {loading ? "Memproses..." : "PULANG (Check-Out)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendancePage;
