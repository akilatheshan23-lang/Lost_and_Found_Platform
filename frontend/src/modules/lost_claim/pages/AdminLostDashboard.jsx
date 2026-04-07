import React, { useState } from "react";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import StatusBadge from "../components/StatusBadge";
import { updateLostStatus } from "../services/lostService";

export default function AdminLostDashboard() {
  const { lostItems, refreshAll } = useData();
  const { showToast } = useToast();
  const [busyId, setBusyId] = useState("");

  const doAction = async (id, status) => {
    setBusyId(id);
    try {
      await updateLostStatus(id, status);
      showToast(`Item ${status}!`, status === "approved" ? "✓" : "✕");
      await refreshAll();
    } catch (e) {
      showToast(e?.response?.data?.message || "Action failed. Check VITE_ADMIN_KEY / ADMIN_KEY.", "⚠️");
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard — Lost Items</h2>
          <p className="text-slate-500 text-sm mt-1">Approve/Reject lost item reports.</p>
        </div>
      </div>

      <div className="space-y-4">
        {lostItems.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center border border-slate-200">
            <p className="text-slate-500">No items to review.</p>
          </div>
        ) : (
          lostItems.map((item) => (
            <div key={item._id} className="glass rounded-xl p-4 border border-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-slate-800">{item.itemName}</h4>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="text-sm text-slate-600">📍 {item.location} | 📅 {item.date}</p>
                  <p className="text-sm text-slate-500 mt-1">By: {item.userName} ({item.userEmail})</p>
                </div>

                {item.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      disabled={busyId === item._id}
                      onClick={() => doAction(item._id, "approved")}
                      className="px-4 py-2 btn-success text-white rounded-lg font-medium"
                    >
                      {busyId === item._id ? "Processing..." : "✓ Approve"}
                    </button>
                    <button
                      disabled={busyId === item._id}
                      onClick={() => doAction(item._id, "rejected")}
                      className="px-4 py-2 btn-danger text-white rounded-lg font-medium"
                    >
                      {busyId === item._id ? "Processing..." : "✕ Reject"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-slate-500 mt-6">
        If approve/reject fails, set the same key in <code>server/.env ADMIN_KEY</code> and <code>client/.env VITE_ADMIN_KEY</code>.
      </p>
    </div>
  );
}
