 	// 1. Ganti sumber data dari array ke model Sequelize
 	const { Presensi } = require("../models");
 	const { format } = require("date-fns-tz");
 	const timeZone = "Asia/Jakarta";
 	
 	exports.CheckIn = async (req, res) => {
 	  // 2. Gunakan try...catch untuk error handling
 	  try {
 	    const { id: userId, nama: userName } = req.user;
 	    const waktuSekarang = new Date();
 	
 	    // 3. Ubah cara mencari data menggunakan 'findOne' dari Sequelize
 	    const existingRecord = await Presensi.findOne({
 	      where: { userId: userId, checkOut: null },
 	    });
 	
 	    if (existingRecord) {
 	      return res
 	        .status(400)
 	        .json({ message: "Anda sudah melakukan check-in hari ini." });
 	    }
 	
 	    // 4. Ubah cara membuat data baru menggunakan 'create' dari Sequelize
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



