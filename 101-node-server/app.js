const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

// Middleware global
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Import router
const authRoutes = require("./routes/authRoutes");
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports"); // <- Tambahkan ini

// Mount router
app.use("/api/auth", authRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes); // <- Tambahkan ini

// Root test
app.get("/", (req, res) => {
  res.send("Home Page for API");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
