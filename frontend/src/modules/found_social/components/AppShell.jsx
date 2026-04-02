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
    <NavLink to={to}>
      {({ isActive }) => (
        <div
          className={[
            "group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-200",
            isActive
              ? "border-amber-300/30 bg-gradient-to-r from-amber-400/18 via-orange-400/14 to-fuchsia-500/14 text-white shadow-[0_14px_30px_rgba(251,191,36,0.16)]"
              : "border-transparent text-slate-300 hover:border-sky-300/10 hover:bg-[#132348] hover:text-white",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-9 w-9 items-center justify-center rounded-xl text-lg transition-all duration-200",
              isActive
                ? "bg-amber-300/14 text-amber-200 ring-1 ring-amber-200/18"
                : "bg-slate-800/65 text-sky-200 group-hover:bg-slate-700/80 group-hover:text-white",
            ].join(" ")}
          >
            {icon}
          </span>
          <span className="truncate">{label}</span>
        </div>
      )}
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
    <div className="space-y-2">
      <SidebarLink to="/found" icon="🔎" label="Found" />
      <SidebarLink to="/social" icon="🗞️" label="Social" />
      {user?.isAdmin ? <SidebarLink to="/admin" icon="⚙️" label="Admin" /> : null}
    </div>
  );

  return (
    <div className="min-h-screen app-bg">
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "" : "pointer-events-none"}`}>
        <div
          className={`absolute inset-0 bg-slate-950/60 transition-opacity ${mobileOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileOpen(false)}
        />
        <aside
          className={`absolute left-0 top-0 flex h-full w-80 flex-col sidebar p-4 transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/14 to-fuchsia-500/14 text-lg text-amber-200 shadow-[0_14px_32px_rgba(15,23,42,0.24)]">🎓</div>
              <div className="text-white">
                <div className="font-bold leading-tight">Lost &amp; Found</div>
                <div className="text-xs text-slate-300">Premium dashboard</div>
              </div>
            </div>
            <button
              className="rounded-xl border border-slate-700/70 bg-slate-900/45 px-3 py-2 text-slate-300 hover:border-slate-500/70 hover:bg-slate-800/80 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              ✕
            </button>
          </div>

          <div className="mt-8">{links}</div>

          <div className="mt-auto pt-6">
            {user ? (
              <div className="rounded-[24px] border border-slate-700/70 bg-slate-900/35 p-3 shadow-[0_20px_40px_rgba(2,6,23,0.28)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/18 bg-gradient-to-br from-amber-300/16 to-sky-400/16 text-white">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-white">{user.name}</div>
                    <div className="truncate text-xs text-slate-300">{user.isAdmin ? "Admin" : user.userType}</div>
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
        <aside className="hidden md:flex md:w-72 sidebar p-4 flex-col">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-300/20 bg-gradient-to-br from-amber-300/14 to-fuchsia-500/14 text-lg text-amber-200 shadow-[0_14px_32px_rgba(15,23,42,0.24)]">🎓</div>
            <div className="text-white">
              <div className="font-bold leading-tight">Lost &amp; Found</div>
              <div className="text-xs text-slate-300">Premium dashboard</div>
            </div>
          </div>

          <div className="mt-8">{links}</div>

          <div className="mt-auto">
            {user ? (
              <div className="rounded-[24px] border border-slate-700/70 bg-slate-900/35 p-3 shadow-[0_20px_40px_rgba(2,6,23,0.28)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-300/18 bg-gradient-to-br from-amber-300/16 to-sky-400/16 text-white">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium text-white">{user.name}</div>
                    <div className="truncate text-xs text-slate-300">{user.isAdmin ? "Admin" : user.userType}</div>
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

        <div className="flex-1 min-w-0">
          <header className="sticky top-0 z-40">
            <div className="mx-auto px-4 md:px-6 py-4">
              <div className="card-solid px-4 py-3 flex items-center justify-between border-white/90 bg-white/75">
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
                    <div className="text-xs text-slate-500">Premium Lost &amp; Found experience</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <NotificationBell />
                  {user ? (
                    <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-white/70 bg-gradient-to-r from-white/85 to-indigo-50/85 px-3 py-2 shadow-sm">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-900 text-sm text-white">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                      <div className="max-w-[160px] truncate text-sm font-semibold text-slate-800">
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
