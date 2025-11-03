// presensiController.js

const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require("express-validator"); // <-- IMPOR BARU
const timeZone = "Asia/Jakarta";

// --- CHECK-IN ---
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId: userId,
      nama: userName,
      checkIn: waktuSekarang,
    });

    const formattedData = {
      userId: newRecord.userId,
      nama: newRecord.nama,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null
    };

    res.status(201).json({
      message: `Halo ${userName}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};


// --- CHECK-OUT ---
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;

    const recordToUpdate = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!recordToUpdate) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in yang aktif untuk Anda.",
      });
    }

    // Simpan waktu check-out
    recordToUpdate.checkOut = new Date();
    await recordToUpdate.save();

    // Format untuk display
    const formattedData = {
      userId: recordToUpdate.userId,
      nama: recordToUpdate.nama,
      checkIn: recordToUpdate.checkIn
        ? format(new Date(recordToUpdate.checkIn), "yyyy-MM-dd HH:mm:ss", { timeZone })
        : null,
      checkOut: recordToUpdate.checkOut
        ? format(new Date(recordToUpdate.checkOut), "yyyy-MM-dd HH:mm:ss", { timeZone })
        : null,
    };

    res.json({
      message: `Selamat jalan ${userName}, check-out Anda berhasil.`,
      data: formattedData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};


// --- DELETE PRESENSI ---
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const recordToDelete = await Presensi.findByPk(presensiId);

    if (!recordToDelete) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }
    if (recordToDelete.userId !== userId) {
      // Pastikan hanya pemilik yang bisa menghapus
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }
    await recordToDelete.destroy();
    res.status(204).send(); // Status 204 No Content untuk penghapusan yang sukses
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};


// --- UPDATE PRESENSI (Dengan Penanganan Validasi) ---
exports.updatePresensi = async (req, res) => {
  // 1. Tangani hasil validasi dari middleware routes
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
        message: "Validasi input gagal.",
        errors: errors.array() // Mengirim detail error validasi
    });
  }
  
  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;
    
    // Pengecekan jika tidak ada data yang dikirim sama sekali
    if (checkIn === undefined && checkOut === undefined && nama === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn, checkOut, atau nama).",
      });
    }
    
    const recordToUpdate = await Presensi.findByPk(presensiId);
    
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    // Hanya update jika nilai dikirimkan di body
    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
    recordToUpdate.nama = nama || recordToUpdate.nama;
    await recordToUpdate.save();

    res.json({
      message: "Data presensi berhasil diperbarui.",
      data: recordToUpdate,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};