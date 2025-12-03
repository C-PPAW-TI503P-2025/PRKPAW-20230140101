import { Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import DashboardPage from "./Pages/DashboardPage";
import AttendancePage from "./Pages/AttendancePage";
import ReportPage from "./Pages/Reports";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/presensi" element={<AttendancePage />} />

      {/* Satu–satunya route untuk laporan */}
      <Route path="/reports" element={<ReportPage />} />
    </Routes>
  );
}

export default App;
