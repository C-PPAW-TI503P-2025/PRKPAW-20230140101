import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Ikon sederhana untuk tombol show/hide password
const EyeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.585 11.235A2.999 2.999 0 0 0 12 15c1.196 0 2.27-.478 3.05-1.258m-2.28-3.072A3.001 3.001 0 0 0 12 9c-1.196 0-2.27.478-3.05 1.258M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><line x1="2" x2="22" y1="2" y2="22"/>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State baru untuk kontrol visibility password
  const [showPassword, setShowPassword] = useState(false);
  // State baru untuk penanganan error (menggantikan alert)
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Hapus pesan error sebelumnya
    const apiBackend = 'http://localhost:3001/api/auth/login';

    try {
      const response = await axios.post(apiBackend, { email, password });
      const { token } = response.data;
      
      // Simpan token
      localStorage.setItem('token', token);
      console.log('Login berhasil, token disimpan:', token);
      
      // Pindah ke dashboard
      navigate('/dashboard');

    } catch (error) {
      console.error('Login Error:', error);
      
      let message = "Gagal menghubungi server. Pastikan backend sudah jalan!";
      
      if (error.response && error.response.data && error.response.data.message) {
        // Jika server merespon (misal: password salah), pakai pesan dari server
        message = error.response.data.message;
      }
      
      // Atur pesan error ke state, yang akan ditampilkan di UI
      setErrorMessage(message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-900 font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl shadow-2xl border border-white border-opacity-20">
        <h1 className="text-4xl font-extrabold text-center text-white">Masuk Akun</h1>
        <p className="text-center text-gray-300">Selamat datang kembali!</p>
        
        {/* Notifikasi Error */}
        {errorMessage && (
          <div className="bg-red-500 bg-opacity-80 text-white p-3 rounded-lg text-sm text-center shadow-md">
            {errorMessage}
            <button 
              onClick={() => setErrorMessage('')} 
              className="ml-4 font-bold hover:text-red-200"
              aria-label="Close error notification"
            >
              &times;
            </button>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">Alamat Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 text-gray-900 bg-white bg-opacity-90 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition duration-150"
              placeholder="email@contoh.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">Password</label>
            {/* Wrapper untuk input dan ikon */}
            <div className="relative">
              <input
                id="password"
                // Tipe input ditentukan oleh state showPassword
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                // Tambahkan padding kanan (pr-10) untuk memberi ruang ikon
                className="w-full px-4 py-3 mt-0 text-gray-900 bg-white bg-opacity-90 border border-transparent rounded-lg shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-400/50 pr-10 transition duration-150"
                placeholder="••••••••"
              />
              
              {/* Tombol Toggle Password */}
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 transition duration-150"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button 
              type="submit"
              className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400/50 transition duration-300 transform hover:scale-[1.01]"
            >
              Masuk
            </button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-300">
          Belum punya akun?{' '}
          <Link to="/register" className="font-semibold text-blue-300 hover:text-blue-200 hover:underline transition duration-150">
            Registrasi di sini
          </Link>
        </p>
      </div>
    </div>
  );
}