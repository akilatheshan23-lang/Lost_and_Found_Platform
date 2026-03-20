import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import NotificationBell from "./NotificationBell";

function getPageTitle(pathname) {
  if (pathname.startsWith("/found")) return "Found Items";
  if (pathname.startsWith("/social")) return "Social Feed";
  if (pathname.startsWith("/admin")) return "Admin Panel";
  if (pathname.startsWith("/claims")) return "Claim";
  return "Lost & Found Platform";
}

function SidebarLink({ to, icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition",
          isActive
            ? "bg-white/10 text-white ring-1 ring-white/10"
            : "text-white/70 hover:text-white hover:bg-white/5",
        ].join(" ")
      }
    >
      <span className="text-lg">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
}

export default function AppShell() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const title = useMemo(() => getPageTitle(pathname), [pathname]);

  const [mobileOpen, setMobileOpen] = useState(false);

  const links = (
    <div className="space-y-1">
      <SidebarLink to="/found" icon="🔎" label="Found" />
      <SidebarLink to="/social" icon="🗞️" label="Social" />
      {user?.isAdmin ? <SidebarLink to="/admin" icon="⚙️" label="Admin" /> : null}
    </div>
  );

  return (
    <div className="min-h-screen app-bg">
      {/* Mobile overlay sidebar */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 h-full w-80 sidebar p-4 transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">🎓</div>
              <div className="text-white">
                <div className="font-bold leading-tight">Lost & Found</div>
                <div className="text-xs text-white/70">Platform</div>
              </div>
            </div>
            <button
              className="text-white/80 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="mt-6">{links}</div>

          <div className="mt-auto pt-6">
            {user ? (
              <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium truncate">{user.name}</div>
                    <div className="text-xs text-white/70 truncate">{user.isAdmin ? "Admin" : user.userType}</div>
                  </div>
                </div>
                <button
                  className="mt-3 w-full btn-secondary"
                  onClick={() => {
                    logout();
                    nav("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-secondary" onClick={() => nav("/login")}>Login</button>
                <button className="btn-primary" onClick={() => nav("/register")}>Register</button>
              </div>
            )}
          </div>
        </aside>
      </div>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:w-72 sidebar p-4 flex-col">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">🎓</div>
            <div className="text-white">
              <div className="font-bold leading-tight">Lost & Found</div>
              <div className="text-xs text-white/70">Platform</div>
            </div>
          </div>

          <div className="mt-6">{links}</div>

          <div className="mt-auto">
            {user ? (
              <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-medium truncate">{user.name}</div>
                    <div className="text-xs text-white/70 truncate">{user.isAdmin ? "Admin" : user.userType}</div>
                  </div>
                </div>
                <button
                  className="mt-3 w-full btn-secondary"
                  onClick={() => {
                    logout();
                    nav("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-secondary" onClick={() => nav("/login")}>Login</button>
                <button className="btn-primary" onClick={() => nav("/register")}>Register</button>
              </div>
            )}
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-40">
            <div className="mx-auto px-4 md:px-6 py-4">
              <div className="card-solid px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    className="md:hidden btn-secondary px-3"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open menu"
                  >
                    ☰
                  </button>
                  <div>
                    <div className="text-lg font-bold text-slate-900">{title}</div>
                    <div className="text-xs text-slate-500">Lost & Found Platform</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NotificationBell />
                  {user ? (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-100">
                      <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-sm">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="text-sm font-medium text-slate-800 truncate max-w-[160px]">
                        {user.name}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="mx-auto px-4 md:px-6 pb-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
