import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ReportPage = () => {
  const [laporan, setLaporan] = useState([]); // Data tabel
  const [keyword, setKeyword] = useState(''); // Buat search nama
  const [tglMulai, setTglMulai] = useState(''); // Filter tgl
  const [tglAkhir, setTglAkhir] = useState(''); // Filter tgl
  const navigate = useNavigate();

  // Fungsi buat ngambil data dari API
  const ambilData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login'); // Usir kalo ga ada token

    try {
      // Request GET dengan params filter
      const response = await axios.get('http://localhost:3001/api/reports/daily', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          nama: keyword,
          tanggalMulai: tglMulai,
          tanggalSelesai: tglAkhir
        }
      });
      setLaporan(response.data.data); // Simpan data ke state
    } catch (error) {
      console.error("Gagal ambil data", error);
      alert("Gagal memuat laporan. Pastikan kamu Admin ya!");
    }
  };

  // Ambil data pas halaman pertama dibuka
  useEffect(() => {
    ambilData();
  }, []);

  // Handler buat form submit
  const handleCari = (e) => {
    e.preventDefault();
    ambilData(); // Panggil API lagi dengan filter baru
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan Presensi Harian</h1>

        {/* Form Filter */}
        <form onSubmit={handleCari} className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm text-gray-600">Cari Nama</label>
            <input 
              type="text" 
              placeholder="Nama karyawan..." 
              className="border p-2 rounded w-full"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Dari Tanggal</label>
            <input 
              type="date" 
              className="border p-2 rounded"
              value={tglMulai}
              onChange={(e) => setTglMulai(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Sampai Tanggal</label>
            <input 
              type="date" 
              className="border p-2 rounded"
              value={tglAkhir}
              onChange={(e) => setTglAkhir(e.target.value)}
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 h-10">
            Filter Data
          </button>
        </form>

        {/* Tabel Data */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Nama User</th>
                <th className="px-4 py-2 text-left">Waktu Masuk</th>
                <th className="px-4 py-2 text-left">Waktu Keluar</th>
              </tr>
            </thead>
            <tbody>
              {laporan.length > 0 ? (
                laporan.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{item.id}</td>
                    {/* Tampilkan nama dari relasi user, jaga-jaga kalo usernya udah diapus */}
                    <td className="px-4 py-3 font-medium">{item.user ? item.user.nama : 'User Dihapus'}</td>
                    <td className="px-4 py-3 text-green-600">
                      {new Date(item.checkIn).toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-red-600">
                      {item.checkOut ? new Date(item.checkOut).toLocaleString('id-ID') : 'Belum pulang'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-gray-500">Belum ada data presensi nih.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;