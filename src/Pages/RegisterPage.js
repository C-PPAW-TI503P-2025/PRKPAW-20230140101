import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    try {
      await axios.post('http://localhost:3001/api/auth/register', {
        nama: name,
        email: email,
        password: password
      });

      setSuccess('Pendaftaran berhasil! Mengarahkan ke halaman Login...');
      
      setTimeout(() => {
          navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response ? err.response.data.message : 'Registrasi gagal. Coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transition duration-500 hover:shadow-gray-700/50">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-gray-900">
          Buat Akun Baru
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input Nama */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Masukkan nama lengkap Anda"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Input Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh@domain.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
            />
          </div>
          
          {/* Input Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
            />
          </div>

          {/* Input Konfirmasi Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Ulangi password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out"
            />
          </div>
          
          {/* Tombol Registrasi */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out transform hover:scale-[1.01]"
          >
            Daftar Sekarang
          </button>
        </form>
        
        {/* Pesan Error */}
        {error && (
          <p className="text-red-600 text-sm mt-4 text-center font-medium bg-red-50 p-2 rounded-md border border-red-300">{error}</p>
        )}

        {/* Pesan Sukses */}
        {success && (
          <p className="text-green-600 text-sm mt-4 text-center font-medium bg-green-50 p-2 rounded-md border border-green-300">{success}</p>
        )}

        {/* Tautan Login */}
        <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline transition duration-150">
                    Masuk di sini
                </Link>
            </p>
        </div>

      </div>
    </div>
  );
}
export default RegisterPage;