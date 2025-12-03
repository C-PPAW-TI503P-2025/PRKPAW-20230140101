const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require('path'); 

const app = express();
const PORT = 3001;


// ===============================================
// 1. MIDDLEWARE GLOBAL
// ===============================================
app.use(cors()); // 🔑 PENTING: CORS harus di atas agar request file statis diizinkan
app.use(express.json());
app.use(morgan("dev"));


// ===============================================
// 2. KONFIGURASI FILE STATIS (SOLUSI GAMBAR)
// ===============================================
// Pastikan ini diletakkan SETELAH CORS
// Server akan melayani file dari folder 'uploads' di http://localhost:3001/uploads/...
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ===============================================
// 3. ROUTER
// ===============================================

// Import router
const authRoutes = require("./routes/authRoutes");
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports"); 

// Mount router
app.use("/api/auth", authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes); 

// Root test
app.get("/", (req, res) => {
    res.send("Home Page for API");
});

// ===============================================
// 4. START SERVER
// ===============================================
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});