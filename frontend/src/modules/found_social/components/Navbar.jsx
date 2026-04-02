import { Link, NavLink, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-40 glass-card shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/found" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xl">🎓</span>
          </div>
          <div>
            <div className="text-lg font-bold text-slate-800">Lost & Found Platform</div>
            <div className="text-xs text-slate-500">Found Items & Social Feed</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/found"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl font-medium ${isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}`
            }
          >
            🔍 Found
          </NavLink>
          <NavLink
            to="/social"
            className={({ isActive }) =>
              `px-3 py-2 rounded-xl font-medium ${isActive ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`
            }
          >
            📱 Social
          </NavLink>
          {user?.isAdmin ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl font-medium ${isActive ? "bg-slate-800 text-white" : "text-slate-600 hover:bg-slate-100"}`
              }
            >
              ⚙️ Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBell />

          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="text-sm font-medium text-slate-700">
                  {user.name} {user.isAdmin ? "(Admin)" : ""}
                </div>
              </div>
              <button
                onClick={() => { logout(); nav("/login"); }}
                className="px-3 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="px-3 py-2 rounded-xl bg-slate-900 text-white" to="/login">Login</Link>
              <Link className="px-3 py-2 rounded-xl bg-slate-200 text-slate-800" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
