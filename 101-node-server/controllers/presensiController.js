const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require("express-validator");

const timeZone = "Asia/Jakarta";

// --- CHECK-IN ---
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama } = req.user;
    const waktuSekarang = new Date();

    // Cek apakah user sudah check-in tapi belum check-out
    const existingRecord = await Presensi.findOne({
      where: { userId: userId, checkOut: null },
    });

    if (existingRecord) {
      return res
        .status(400)
        .json({ message: "Anda sudah melakukan check-in hari ini." });
    }

    // Buat data presensi baru
    const newRecord = await Presensi.create({
      userId: userId,
      checkIn: waktuSekarang,
    });

    const formattedData = {
      userId: newRecord.userId,
      checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
      checkOut: null,
    };

    res.status(201).json({
      message: `Halo ${nama}, check-in Anda berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: formattedData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- CHECK-OUT ---
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama } = req.user;

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

    const formattedData = {
      userId: recordToUpdate.userId,
      checkIn: format(recordToUpdate.checkIn, "yyyy-MM-dd HH:mm:ss", { timeZone }),
      checkOut: format(recordToUpdate.checkOut, "yyyy-MM-dd HH:mm:ss", { timeZone }),
    };

    res.json({
      message: `Selamat jalan ${nama}, check-out Anda berhasil.`,
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

    // Pastikan hanya pemilik data yang bisa hapus
    if (recordToDelete.userId !== userId) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await recordToDelete.destroy();
    res.status(204).send(); // No Content
  } catch (error) {
    res
      .status(500)
      .json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

// --- UPDATE PRESENSI ---
exports.updatePresensi = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validasi input gagal.",
      errors: errors.array(),
    });
  }

  try {
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    if (checkIn === undefined && checkOut === undefined) {
      return res.status(400).json({
        message:
          "Request body tidak berisi data yang valid untuk diupdate (checkIn atau checkOut).",
      });
    }

    const recordToUpdate = await Presensi.findByPk(presensiId);
    if (!recordToUpdate) {
      return res
        .status(404)
        .json({ message: "Catatan presensi tidak ditemukan." });
    }

    recordToUpdate.checkIn = checkIn || recordToUpdate.checkIn;
    recordToUpdate.checkOut = checkOut || recordToUpdate.checkOut;
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
