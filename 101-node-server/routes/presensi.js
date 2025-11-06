const express = require("express");
const router = express.Router();
const presensiController = require("../controllers/presensiController");
const { body } = require("express-validator");

// ✅ Gunakan middleware autentikasi JWT yang benar
const { authenticateToken } = require("../middleware/authMiddleware");

// ✅ Validasi untuk UPDATE Presensi
const updatePresensiValidation = [
  body("checkIn")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Format waktu checkIn harus berupa tanggal/waktu yang valid (ISO8601)."),

  body("checkOut")
    .optional({ nullable: true, checkFalsy: true })
    .isISO8601()
    .withMessage("Format waktu checkOut harus berupa tanggal/waktu yang valid (ISO8601)."),
];

// ✅ Semua rute di bawah ini wajib login dulu (JWT)
router.use(authenticateToken);

// --- Rute Presensi ---

// Check-In & Check-Out
router.post("/checkin", presensiController.CheckIn);
router.post("/checkout", presensiController.CheckOut);

// Update Presensi
router.put("/:id", updatePresensiValidation, presensiController.updatePresensi);

// Delete Presensi
router.delete("/:id", presensiController.deletePresensi);

module.exports = router;
