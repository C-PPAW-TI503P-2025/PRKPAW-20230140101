// reportController.js

const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize"); // Pastikan Op sudah di-import

exports.getDailyReport = async (req, res) => {
  try {
    // 1. Ambil parameter nama, tanggalMulai, dan tanggalSelesai
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    let options = { where: {} };
    
    // Filter berdasarkan nama (Kode yang sudah ada)
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    // 2. Logika Filter Berdasarkan Rentang Tanggal
    if (tanggalMulai && tanggalSelesai) {
     
      options.where.createdAt = {
        [Op.between]: [new Date(tanggalMulai), new Date(tanggalSelesai)],
      };
    }
    // Opsi tambahan jika hanya satu tanggal yang diberikan (walaupun tidak wajib di tugas, ini praktik yang baik)
    else if (tanggalMulai) {
        options.where.createdAt = {
            [Op.gte]: new Date(tanggalMulai), // Lebih besar dari atau sama dengan
        };
    } else if (tanggalSelesai) {
        options.where.createdAt = {
            [Op.lte]: new Date(tanggalSelesai), // Lebih kecil dari atau sama dengan
        };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      filterApplied: { nama, tanggalMulai, tanggalSelesai },
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};