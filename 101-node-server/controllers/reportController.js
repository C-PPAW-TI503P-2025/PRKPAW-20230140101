const { Presensi, User } = require("../models");
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    const options = {
      where: {},
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nama", "email"],
          where: {}
        }
      ],
      order: [["id", "DESC"]]
    };

    // Filter nama
    if (nama) {
      options.include[0].where.nama = {
        [Op.like]: `%${nama}%`
      };
    }

    // Filter tanggal (PAKAI KOLOM 'tanggal', BUKAN createdAt)
    if (tanggalMulai && tanggalSelesai) {
      options.where.tanggal = {
        [Op.between]: [tanggalMulai, tanggalSelesai]
      };
    } else if (tanggalMulai) {
      options.where.tanggal = {
        [Op.gte]: tanggalMulai
      };
    } else if (tanggalSelesai) {
      options.where.tanggal = {
        [Op.lte]: tanggalSelesai
      };
    }

    // Ambil data
    const records = await Presensi.findAll(options);

    // Format frontend perlu checkIn & checkOut (CamelCase)
    const formatted = records.map(r => ({
      id: r.id,
      checkIn: r.check_in,
      checkOut: r.check_out,
      user: r.user
        ? {
            id: r.user.id,
            nama: r.user.nama,
            email: r.user.email
          }
        : null
    }));

    res.json({
      status: true,
      count: formatted.length,
      data: formatted
    });

  } catch (error) {
    console.error("Report error:", error);
    res.status(500).json({
      status: false,
      message: "Gagal mengambil laporan",
      error: error.message
    });
  }
};
