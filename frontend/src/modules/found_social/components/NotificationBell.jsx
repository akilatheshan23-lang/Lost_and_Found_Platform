import { useEffect, useState } from "react";
import { apiNotifications, apiReadAll } from "../api/notifications.api";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function NotificationBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  async function refresh() {
    if (!user) return;
    const data = await apiNotifications();
    setItems(data);
  }

  useEffect(() => {
    refresh();
  }, [user]);

  const unread = items.filter((n) => !n.read).length;

  async function markAll() {
    await apiReadAll();
    await refresh();
  }

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="btn-secondary px-3"
        title="Notifications"
      >
        🔔
        {unread > 0 && (
          <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-1 text-xs text-white h-5 shadow-sm">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-[26px] border border-white/90 bg-white/92 p-3 shadow-[0_25px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Notifications</div>
              <div className="text-xs text-slate-500">Latest updates from moderation</div>
            </div>
            <button className="btn-secondary text-xs px-2 py-1" onClick={markAll}>
              Mark all read
            </button>
          </div>

          <div className="max-h-72 space-y-2 overflow-auto">
            {items.length === 0 ? (
              <div className="py-6 text-center text-slate-500">No notifications</div>
            ) : (
              items.map((n) => (
                <div
                  key={n._id}
                  className={`rounded-2xl border p-3 ${n.read ? "border-slate-200 bg-white/90" : "border-indigo-100 bg-gradient-to-r from-indigo-50 to-sky-50"}`}
                >
                  <div className="text-sm text-slate-900">{n.message}</div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                    {n.link ? (
                      <Link to={n.link} className="font-medium text-indigo-700 hover:underline" onClick={() => setOpen(false)}>
                        Open
                      </Link>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-2 text-right">
            <button className="text-xs text-slate-500 hover:text-slate-700" onClick={() => setOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
