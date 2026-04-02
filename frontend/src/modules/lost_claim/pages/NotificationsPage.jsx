import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";

export default function NotificationsPage() {
  const nav = useNavigate();
  const { notifications } = useData();
  const { showToast } = useToast();

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => nav("/")} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
        </div>
        <button
          onClick={() => showToast("Notifications are created automatically from lost item and claim status changes.", "ℹ️")}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition"
        >
          Info
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="glass rounded-xl p-6 text-center border border-slate-200">
            <span className="text-4xl mb-4 block">🔔</span>
            <p className="text-slate-500">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div key={`${n.kind}-${n.id}`} className="glass rounded-xl p-4 border border-slate-200 flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg(n.status)}`}>
                <span className="text-2xl">{iconText(n.status)}</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{messageFor(n)}</p>
                <p className="text-sm text-slate-500">{n.title}</p>
                {n.note ? <p className="text-sm text-slate-600 mt-1">{n.note}</p> : null}
                <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function iconBg(status) {
  if (status === "approved") return "bg-green-100";
  if (status === "rejected") return "bg-red-100";
  if (status === "collected") return "bg-emerald-100";
  return "bg-amber-100";
}

function iconText(status) {
  if (status === "approved") return "✓";
  if (status === "rejected") return "✕";
  if (status === "collected") return "📦";
  return "⏳";
}

function messageFor(n) {
  if (n.kind === "lost") {
    return `Your lost item report is ${n.status}.`;
  }
  if (n.status === "approved") {
    return "Your claim was approved. The item can be collected from security.";
  }
  if (n.status === "collected") {
    return "Your item collection was recorded successfully.";
  }
  if (n.status === "rejected") {
    return "Your claim was rejected by admin review.";
  }
  return "Your claim status was updated.";
}
