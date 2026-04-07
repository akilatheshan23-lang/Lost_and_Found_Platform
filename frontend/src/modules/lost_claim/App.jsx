import React, { useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import LostPage from "./pages/LostPage";
import ClaimsPage from "./pages/ClaimsPage";
import NotificationsPage from "./pages/NotificationsPage";
import FeedbackPage from "./pages/FeedbackPage";
import AdminLostDashboard from "./pages/AdminLostDashboard";
import AdminClaimDashboard from "./pages/AdminClaimDashboard";
import { DataProvider } from "./context/DataContext";
import { ToastProvider } from "./context/ToastContext";

export default function App() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();

  const toggleAdmin = () => {
    setIsAdminMode((v) => {
      const next = !v;
      navigate(next ? "/admin/lost" : "/");
      return next;
    });
  };

  return (
    <ToastProvider>
      <DataProvider>
        <div className="min-h-screen bg-slate-100">
          <Navbar isAdminMode={isAdminMode} onToggleAdmin={toggleAdmin} />
          <main className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lost" element={<LostPage />} />
              <Route path="/claims" element={<ClaimsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />

              <Route path="/admin/lost" element={isAdminMode ? <AdminLostDashboard /> : <Navigate to="/" />} />
              <Route path="/admin/claims" element={isAdminMode ? <AdminClaimDashboard /> : <Navigate to="/" />} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </DataProvider>
    </ToastProvider>
  );
}
