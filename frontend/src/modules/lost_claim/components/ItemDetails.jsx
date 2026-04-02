import React from "react";
import StatusBadge from "./StatusBadge";

export default function ItemDetails({ item }) {
  if (!item) return <p className="text-slate-500">No item selected.</p>;

  return (
    <div className="space-y-4">
      <div className="h-40 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl.startsWith("http") ? item.imageUrl : (import.meta.env.VITE_API_URL || "http://localhost:5000") + item.imageUrl}
            alt={item.itemName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <span className="text-5xl">📦</span>
        )}
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-1">{item.itemName}</h3>
        <StatusBadge status={item.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <InfoBox label="Category" value={item.category} />
        <InfoBox label="User Type" value={item.userType} />
        <InfoBox label="Location" value={item.location} />
        <InfoBox label="Venue" value={item.venue} />
        <InfoBox label="Date" value={item.date} />
        <InfoBox label="Time" value={item.time} />
      </div>

      <div className="bg-slate-50 p-3 rounded-lg text-sm">
        <p className="text-slate-500">Reported By</p>
        <p className="font-medium text-slate-800">{item.userName}</p>
        <p className="text-slate-600">{item.userEmail}</p>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-slate-50 p-3 rounded-lg">
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}
