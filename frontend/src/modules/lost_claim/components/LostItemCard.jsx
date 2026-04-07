import React from "react";
import StatusBadge from "./StatusBadge";

export default function LostItemCard({ item, onView }) {

  return (
    <div className="glass rounded-xl overflow-hidden border border-slate-200 card-hover">
      <div className="h-32 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
        {item.imageUrl ? (
          <img
            src={item.imageUrl.startsWith("http") ? item.imageUrl : (import.meta.env.VITE_API_URL || "http://localhost:5000") + item.imageUrl}
            alt={item.itemName}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h4 className="font-bold text-slate-800 truncate">{item.itemName}</h4>
          <StatusBadge status={item.status} />
        </div>
        <p className="text-sm text-slate-500 mb-1">📍 {item.location}</p>
        <p className="text-sm text-slate-500 mb-3">📅 {item.date}</p>


        <div className="flex gap-2">
          <button
            onClick={() => onView?.(item)}
            className="w-full px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
