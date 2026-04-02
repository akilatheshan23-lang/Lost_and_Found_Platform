import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

export default function Navbar({ isAdminMode, onToggleAdmin }) {
  const { notifications } = useData();
  const navigate = useNavigate();
  const loc = useLocation();

  const count = notifications.length;

  return (
    <nav className="gradient-bg shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔍</span>
            </div>
            <h1 className="text-xl font-bold text-white">Lost & Claim Management</h1>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/notifications")}
              className="relative p-2 text-white hover:bg-white/10 rounded-lg transition"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>

            <button
              onClick={onToggleAdmin}
              className={
                isAdminMode
                  ? "px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition font-medium"
                  : "px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition font-medium"
              }
            >
              {isAdminMode ? "🔐 Admin Mode" : "👤 User Mode"}
            </button>
          </div>
        </div>

        {/* Secondary links */}
        <div className="mt-3 flex gap-2 text-white/90 text-sm flex-wrap">
          <Link className={`px-3 py-1 rounded-lg hover:bg-white/10 ${loc.pathname === "/" ? "bg-white/10" : ""}`} to="/">Home</Link>
          <Link className={`px-3 py-1 rounded-lg hover:bg-white/10 ${loc.pathname.startsWith("/lost") ? "bg-white/10" : ""}`} to="/lost">Lost Items</Link>
          <Link className={`px-3 py-1 rounded-lg hover:bg-white/10 ${loc.pathname.startsWith("/claims") ? "bg-white/10" : ""}`} to="/claims">Claims</Link>
          <Link className={`px-3 py-1 rounded-lg hover:bg-white/10 ${loc.pathname.startsWith("/feedback") ? "bg-white/10" : ""}`} to="/feedback">Feedback</Link>
          {isAdminMode && (
            <>
              <Link className={`px-3 py-1 rounded-lg hover:bg-white/10 ${loc.pathname.startsWith("/admin/lost") ? "bg-white/10" : ""}`} to="/admin/lost">Admin Lost</Link>
              <Link className={`px-3 py-1 rounded-lg hover:bg-white/10 ${loc.pathname.startsWith("/admin/claims") ? "bg-white/10" : ""}`} to="/admin/claims">Admin Claims</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
