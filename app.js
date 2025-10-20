const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 3001;

// Import routes
const booksRoutes = require("./routes/books");
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Debug tipe ekspor
console.log(">>");
console.log("Type of booksRoutes:", typeof booksRoutes);
console.log("Type of presensiRoutes:", typeof presensiRoutes);
console.log("Type of reportRoutes:", typeof reportRoutes);

// Routes
app.get("/", (req, res) => res.send("Home Page for API"));
app.use("/api/books", booksRoutes);
app.use("/api/presensi", presensiRoutes);
app.use("/api/reports", reportRoutes);

// Start server
app.listen(PORT, () =>
  console.log(`Express server running at http://localhost:${PORT}/`)
);
