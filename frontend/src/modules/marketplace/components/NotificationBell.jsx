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
          <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 text-xs bg-rose-600 text-white rounded-full px-1">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 card-solid p-3 shadow-xl z-50">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-slate-900">Notifications</div>
            <button className="btn-secondary text-xs px-2 py-1" onClick={markAll}>
              Mark all read
            </button>
          </div>

          <div className="max-h-72 overflow-auto space-y-2">
            {items.length === 0 ? (
              <div className="text-center text-slate-500 py-6">No notifications</div>
            ) : (
              items.map((n) => (
                <div key={n._id} className={`p-3 rounded-2xl border ${n.read ? "bg-white border-slate-200" : "bg-blue-50 border-blue-100"}`}>
                  <div className="text-sm text-slate-900">{n.message}</div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center justify-between">
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                    {n.link ? (
                      <Link to={n.link} className="text-slate-900 hover:underline" onClick={() => setOpen(false)}>
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
