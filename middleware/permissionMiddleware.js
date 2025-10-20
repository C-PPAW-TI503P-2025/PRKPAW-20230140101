exports.addUserData = (req, res, next) => {
  console.log('Middleware: Menambahkan data user dummy...');
  req.user = {
    id: 123,
    // Diperbaiki: 'User Karyawan' harus diawali dengan tanda kutip.
    nama: 'User Karyawan',
    role: 'karyawan'
  };
  next();
};

// ----------------------------------------------------------------------

exports.isAdmin = (req, res, next) => {
  // Disarankan: Tambahkan pengecekan jika req.user tidak ada sama sekali.
  if (!req.user) {
    console.log('Middleware: Gagal! Data pengguna tidak ditemukan.');
    return res.status(401).json({ message: 'Akses ditolak: Otentikasi diperlukan' });
  }

  if (req.user.role === 'admin') {
    console.log('Middleware: Izin admin diberikan. ✅');
    next();
  } else {
    console.log(`Middleware: Gagal! Pengguna (${req.user.nama || 'Tidak dikenal'}) bukan admin.`);
    return res.status(403).json({ message: 'Akses ditolak: Hanya untuk admin' });
  }
};