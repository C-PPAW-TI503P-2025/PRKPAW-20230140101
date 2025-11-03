// routes/presensi.js

const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");

// IMPOR express-validator
const { body } = require("express-validator"); 

// Ganti addUserData dengan middleware autentikasi/izin Anda yang sebenarnya
// Saya asumsikan ini adalah middleware yang menambahkan req.user
const { addUserData } = require("../middleware/permissionMiddleware");

// 1. Middleware Validasi untuk UPDATE Presensi (PUT)
const updatePresensiValidation = [
  // Memastikan checkIn, jika ada, adalah format tanggal/waktu yang valid (ISO8601)
  body("checkIn")
    .optional({ nullable: true, checkFalsy: true }) // Izinkan field kosong atau tidak ada
    .isISO8601()
    .withMessage("Format waktu checkIn harus berupa tanggal/waktu yang valid (ISO8601)."),
  
  // Memastikan checkOut, jika ada, adalah format tanggal/waktu yang valid (ISO8601)
  body("checkOut")
    .optional({ nullable: true, checkFalsy: true }) // Izinkan field kosong atau tidak ada
    .isISO8601()
    .withMessage("Format waktu checkOut harus berupa tanggal/waktu yang valid (ISO8601)."),
];

// Middleware untuk setiap rute (Misalnya, Autentikasi)
router.use(addUserData); 

// --- Rute Presensi ---

// Rute POST (Check-in & Check-out)
router.post("/check-in", presensiController.CheckIn);
router.post("/check-out", presensiController.CheckOut);

// Rute PUT (UPDATE) - Menambahkan validasi dan memperbaiki nama controller
router.put(
  "/:id", // Ubah ke /:id agar path sesuai dengan /api/presensi/1
  updatePresensiValidation, // Terapkan middleware validasi
  presensiController.updatePresensi // Menggunakan nama controller yang benar: updatePresensi
);

// Rute DELETE - Memperbaiki nama controller
router.delete(
  "/:id", // Ubah ke /:id
  presensiController.deletePresensi // Menggunakan nama controller yang benar: deletePresensi
);

module.exports = router;