import React from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";

export default function Home() {
  const nav = useNavigate();
  const { stats } = useData();

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Lost & Found System</h2>
        <p className="text-slate-600">Report lost items or claim found items easily</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass rounded-2xl p-6 card-hover shadow-lg border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">📦</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Lost Items</h3>
              <p className="text-slate-500">Report or find lost items</p>
            </div>
          </div>
          <p className="text-slate-600 mb-4">
            Lost something? Report it here or browse through items that have been found by others.
          </p>
          <button
            onClick={() => nav("/lost")}
            className="w-full btn-primary text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            View Lost Items →
          </button>
        </div>

        <div className="glass rounded-2xl p-6 card-hover shadow-lg border border-slate-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-3xl">✋</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Claim Management</h3>
              <p className="text-slate-500">Claim your found items</p>
            </div>
          </div>
          <p className="text-slate-600 mb-4">
            Found your lost item? Submit a claim request and get it back after verification.
          </p>
          <button
            onClick={() => nav("/claims")}
            className="w-full btn-success text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
          >
            View Claims →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Lost" value={stats.totalLost} color="text-blue-600" />
        <StatCard label="Total Claims" value={stats.totalClaims} color="text-green-600" />
        <StatCard label="Pending" value={stats.pending} color="text-amber-600" />
        <StatCard label="Resolved" value={stats.resolved} color="text-emerald-600" />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="glass rounded-xl p-4 text-center border border-slate-200">
      <div className={`text-3xl font-bold ${color}`}>{value}</div>
      <div className="text-slate-500 text-sm">{label}</div>
    </div>
  );
}
