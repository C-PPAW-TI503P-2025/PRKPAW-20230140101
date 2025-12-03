import React from "react";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-gray-900 to-black text-white">

      {/* Banner Glow Section */}
      <div className="w-full h-40 md:h-56 bg-gradient-to-r from-indigo-600 to-purple-600 
      rounded-b-3xl shadow-xl flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold tracking-wide drop-shadow-lg">
          Dashboard Presensi
        </h1>
      </div>

      {/* Content */}
      <div className="px-6 mt-10">

        {/* Title */}
        <h2 className="text-3xl font-bold tracking-wide mb-6">
          🔥 Fitur Utama
        </h2>

        {/* Grid Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Card Presensi */}
          <Link
            to="/presensi"
            className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg 
            border border-white/20 hover:scale-[1.03] hover:shadow-2xl 
            transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/30 rounded-xl flex items-center justify-center">
                <span className="text-3xl">📝</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Presensi</h3>
                <p className="text-gray-300 text-sm mt-1">
                  Isi presensi masuk & pulang dengan mudah.
                </p>
              </div>
            </div>
          </Link>

          {/* Card Laporan */}
          <Link
            to="/laporan"
            className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg 
            border border-white/20 hover:scale-[1.03] hover:shadow-2xl 
            transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-purple-500/30 rounded-xl flex items-center justify-center">
                <span className="text-3xl">📊</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Laporan Presensi</h3>
                <p className="text-gray-300 text-sm mt-1">
                  Rekap data presensi berdasarkan tanggal.
                </p>
              </div>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
