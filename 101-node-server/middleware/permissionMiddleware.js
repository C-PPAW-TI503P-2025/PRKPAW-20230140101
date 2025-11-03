exports.addUserData = (req, res, next) => {
  console.log("Middleware: Menambahkan data user dummy...");
  req.user = {
    id: 123,
    nama: "User Karyawan",
    role: "admin", // ubah ke "admin" untuk akses laporan
  };
  next();
};

exports.isAdmin = (req, res, next) => {
  if (!req.user) {
    console.log("Middleware: Data pengguna tidak ditemukan.");
    return res
      .status(401)
      .json({ message: "Akses ditolak: Otentikasi diperlukan." });
  }

  if (req.user.role === "admin") {
    console.log("Middleware: Izin admin diberikan ✅");
    next();
  } else {
    console.log(
      `Middleware: Gagal! Pengguna (${req.user.nama}) bukan admin ❌`
    );
    return res
      .status(403)
      .json({ message: "Akses ditolak: Hanya untuk admin." });
  }
};
