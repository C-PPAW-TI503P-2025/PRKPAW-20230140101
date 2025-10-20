const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { addUserData, isAdmin } = require("../middleware/permissionMiddleware");

// Rute laporan (hanya admin)
router.get("/daily", [addUserData, isAdmin], reportController.getDailyReport);

module.exports = router;
