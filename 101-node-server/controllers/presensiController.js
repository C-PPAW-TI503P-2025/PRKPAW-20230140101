const { Presensi, User } = require('../models'); // Import model dari index.js

// ==========================
// Controller Presensi
// ==========================

// CHECK-IN (latitude & longitude TIDAK WAJIB)
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    // GPS OPSIONAL → tidak perlu validasi wajib
    // if (latitude == null || longitude == null) {
    //   return res.status(400).json({ message: "Latitude dan Longitude wajib diisi" });
    // }

    // Ambil tanggal hari ini (format: YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];

    // Cek apakah user sudah check-in hari ini
    const existingPresensi = await Presensi.findOne({
      where: { userId, tanggal: today }
    });

    if (existingPresensi && existingPresensi.check_in) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini." });
    }

    // Simpan data check-in
    const newPresensi = await Presensi.create({
      userId,
      tanggal: today,
      check_in: new Date(),
      in_latitude: latitude || null,
      in_longitude: longitude || null
    });

    res.status(200).json({
      message: "Check-in berhasil",
      presensi: newPresensi
    });

  } catch (error) {
    console.error("CheckIn error:", error);
    res.status(500).json({
      message: "Gagal memproses check-in.",
      error: error.message
    });
  }
};

// CHECK-OUT (latitude & longitude WAJIB)
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    // GPS WAJIB
    if (latitude == null || longitude == null) {
      return res.status(400).json({ message: "Latitude dan Longitude wajib diisi" });
    }

    const today = new Date().toISOString().split('T')[0];

    const presensi = await Presensi.findOne({
      where: { userId, tanggal: today }
    });

    if (!presensi || !presensi.check_in) {
      return res.status(400).json({ message: "Belum melakukan check-in hari ini." });
    }

    if (presensi.check_out) {
      return res.status(400).json({ message: "Anda sudah check-out hari ini." });
    }

    // Update check-out
    presensi.check_out = new Date();
    presensi.out_latitude = latitude;
    presensi.out_longitude = longitude;

    await presensi.save();

    res.status(200).json({
      message: "Check-out berhasil",
      presensi
    });

  } catch (error) {
    console.error("CheckOut error:", error);
    res.status(500).json({
      message: "Gagal memproses check-out.",
      error: error.message
    });
  }
};

// DUMMY UPDATE
exports.updatePresensi = async (req, res) => {
  res.json({ message: "Update presensi dummy berhasil" });
};

// DUMMY DELETE
exports.deletePresensi = async (req, res) => {
  res.json({ message: "Hapus presensi dummy berhasil" });
};
