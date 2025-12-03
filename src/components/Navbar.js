import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-[#111] text-white border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="text-2xl font-bold tracking-wide">
          Aplikasi Presensi
        </div>

        {/* NAV LINKS */}
        <div className="flex items-center gap-10 text-lg">
          <Link className="hover:text-blue-400 transition" to="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-blue-400 transition" to="/presensi">
            Presensi
          </Link>
          <Link className="hover:text-blue-400 transition" to="/laporan">
            Laporan
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
