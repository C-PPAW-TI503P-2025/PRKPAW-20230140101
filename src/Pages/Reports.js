import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const ReportPage = () => {
    const [laporan, setLaporan] = useState([]);
    const [keyword, setKeyword] = useState('');
    const [tglMulai, setTglMulai] = useState('');
    const [tglAkhir, setTglAkhir] = useState('');
    const [modalImage, setModalImage] = useState(null); 
    const [loading, setLoading] = useState(false); // Tambahkan state loading
    const navigate = useNavigate();

    const ambilData = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        setLoading(true); // Mulai loading
        try {
            // ✅ KOREKSI: Sesuaikan parameter query dengan format yang umumnya dipakai (startDate, endDate)
            // Asumsi backend menggunakan nama parameter ini. Jika backend Anda menggunakan tanggalMulai, biarkan saja.
            const response = await axios.get('http://localhost:3001/api/reports/daily', {
                headers: { Authorization: `Bearer ${token}` },
                params: { 
                    nama: keyword, 
                    startDate: tglMulai,   // Sesuaikan nama parameter
                    endDate: tglAkhir      // Sesuaikan nama parameter
                }
            });

            // ✅ KOREKSI: Diasumsikan response.data adalah array atau object dengan properti 'data'
            // Jika backend mengembalikan { data: [...] }, kode Anda sudah benar.
            setLaporan(response.data.data || response.data); 

        } catch (error) {
            console.error("Gagal ambil data", error.response ? error.response.data : error.message);
            alert("Gagal memuat laporan. Pastikan kamu Admin dan server backend berjalan!");
            setLaporan([]); // Kosongkan laporan jika gagal
        } finally {
            setLoading(false); // Akhiri loading
        }
    };

    useEffect(() => {
        ambilData();
    }, []);

    const handleCari = (e) => {
        e.preventDefault();
        ambilData();
    };

    // Fungsi helper untuk format tanggal/waktu
    const formatDateTime = (datetime) => {
        if (!datetime) return '-';
        return new Date(datetime).toLocaleString('id-ID', {
            dateStyle: 'medium', 
            timeStyle: 'short' 
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Laporan Presensi Harian</h1>

                {/* Form Filter */}
                <form onSubmit={handleCari} className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
                    {/* ... (input keyword, tglMulai, tglAkhir tidak ada perubahan) ... */}
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
                    <button type="submit" disabled={loading} className={`text-white px-6 py-2 rounded h-10 ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                        {loading ? 'Memuat...' : 'Filter Data'}
                    </button>
                </form>

                {/* Tabel Data */}
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    {loading && <div className="text-center p-4 text-blue-500">Sedang memuat data...</div>}
                    {!loading && (
                        <table className="min-w-full table-auto">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-4 py-2 text-left">ID</th>
                                    <th className="px-4 py-2 text-left">Nama User</th>
                                    <th className="px-4 py-2 text-left">Waktu Masuk</th>
                                    <th className="px-4 py-2 text-left">Waktu Keluar</th>
                                    <th className="px-4 py-2 text-left">Bukti Foto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {laporan.length > 0 ? (
                                    laporan.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3">{item.id}</td>
                                            {/* ✅ KOREKSI CASE: Asumsi backend mengembalikan 'nama' */}
                                            <td className="px-4 py-3 font-medium">{item.user ? item.user.nama : 'User Dihapus'}</td>
                                            
                                            {/* ✅ KOREKSI CASE: Asumsi backend mengembalikan 'check_in' atau 'checkin' (disesuaikan dengan skema Anda: check_in) */}
                                            <td className="px-4 py-3 text-green-600">
                                                {formatDateTime(item.check_in || item.checkIn)} 
                                            </td> 
                                            
                                            {/* ✅ KOREKSI CASE: Asumsi backend mengembalikan 'check_out' atau 'checkOut' */}
                                            <td className="px-4 py-3 text-red-600">
                                                {formatDateTime(item.check_out || item.checkOut)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {item.buktiFoto ? (
                                                    <img 
                                                        src={`http://localhost:3001/${item.buktiFoto}`} 
                                                        alt="Bukti" 
                                                        className="w-16 h-16 object-cover cursor-pointer rounded"
                                                        onClick={() => setModalImage(`http://localhost:3001/${item.buktiFoto}`)}
                                                    />
                                                ) : (
                                                    <span className="text-gray-400">Tidak ada</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                            {loading ? 'Memuat data...' : 'Belum ada data presensi nih.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Modal Foto (tetap sama) */}
                {modalImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                        <div className="relative">
                            <button
                                onClick={() => setModalImage(null)}
                                className="absolute top-2 right-2 text-white text-3xl font-bold"
                            >
                                &times;
                            </button>
                            <img src={modalImage} alt="Bukti" className="max-h-[90vh] max-w-[90vw] rounded" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportPage;