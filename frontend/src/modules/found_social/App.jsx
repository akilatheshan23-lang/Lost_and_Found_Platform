import { Routes, Route, Navigate } from "react-router-dom";
import FoundFeed from "./pages/FoundFeed";
import SocialFeed from "./pages/SocialFeed";
import AdminPanel from "./pages/AdminPanel";
import ClaimPlaceholder from "./pages/ClaimPlaceholder";
import FoundScanPage from "./pages/FoundScanPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { ToastProvider } from "./components/Toast";
import AppShell from "./components/AppShell";

function Gate({ children }) {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div className="min-h-screen app-bg flex items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }
  return children(user);
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/found" replace />} />

          <Route element={<AppShell />}>
            <Route path="/found" element={<FoundFeed />} />
            <Route path="/found/scan/:token" element={<FoundScanPage />} />
            <Route path="/social" element={<SocialFeed />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/claims/:foundId" element={<ClaimPlaceholder />} />
          </Route>

          <Route
            path="/login"
            element={
              <Gate>
                {(user) => (user ? <Navigate to="/found" replace /> : <Login />)}
              </Gate>
            }
          />
          <Route
            path="/register"
            element={
              <Gate>
                {(user) => (user ? <Navigate to="/found" replace /> : <Register />)}
              </Gate>
            }
          />

          <Route
            path="*"
            element={<div className="min-h-screen app-bg p-6 text-slate-600">Not found</div>}
          />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}