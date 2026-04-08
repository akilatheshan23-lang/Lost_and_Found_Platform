import React from "react";
import { useAuth } from "../../../state/AuthContext";

function conditionBadge(cond) {
  const styles = {
    new: "bg-emerald-50 text-emerald-700 border-emerald-100",
    "like-new": "bg-blue-50 text-blue-700 border-blue-100",
    good: "bg-indigo-50 text-indigo-700 border-indigo-100",
    fair: "bg-amber-50 text-amber-800 border-amber-100",
    poor: "bg-rose-50 text-rose-700 border-rose-100",
  };
  return styles[cond] || "bg-slate-50 text-slate-700 border-slate-200";
}

export default function MarketplaceCard({ item, onBorrow, isBorrowing = false, viewMode = "grid" }) {
  const { user } = useAuth();
  const imgSrc = item.imageUrl || "";
  const canBorrow = Boolean(user && user.role !== "admin");
  const stockCount = Number(item.stockCount ?? 1);
  const imageSrc = (() => {
    const raw = String(imgSrc || "").trim();
    if (!raw) {
      return "";
    }

    if (raw.startsWith("data:") || raw.startsWith("blob:")) {
      return raw;
    }

    if (/^https?:\/\//i.test(raw)) {
      return raw;
    }

    if (raw.startsWith("www.")) {
      return `https://${raw}`;
    }

    if (raw.startsWith("/")) {
      return `http://localhost:5000${raw}`;
    }

    if (/^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) {
      return `https://${raw}`;
    }

    return `http://localhost:5000/${raw}`;
  })();
  const hasValidSellerContact = /^07\d{8}$/.test(String(item.sellerContact || "").trim());
  const isList = viewMode === "list";

  // Helper to format currency
  const priceLabel = `LKR ${Number(item.price || 0).toLocaleString()}`;

  return (
    <div className={`card-solid card-hover overflow-hidden border-white/90 bg-white/92 h-full ${isList ? "md:flex md:flex-row" : "flex flex-col"}`}>
      <div className="relative md:shrink-0">
        {!isList ? (
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
            <span className="bg-slate-900/90 text-white backdrop-blur-sm px-3 py-1.5 rounded-xl font-bold text-lg shadow-lg">
              {priceLabel}
            </span>
          </div>
        ) : null}
        
        {imageSrc ? (
          <div className={`${isList ? "h-44 md:h-full md:w-72" : "h-48 w-full"} bg-slate-100 overflow-hidden relative ${isList ? "md:border-r border-slate-100" : "border-b border-slate-100"}`}>
            <img src={imageSrc} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
          </div>
        ) : (
          <div className={`${isList ? "h-44 md:h-full md:w-72" : "h-48 w-full"} bg-slate-100 flex items-center justify-center ${isList ? "md:border-r border-slate-200" : "border-b border-slate-200"}`}>
             <span className="text-4xl">🛍️</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col space-y-3">
        <div className="flex items-start justify-between gap-2">
            <div>
               <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{item.title}</h3>
               <div className="flex items-center gap-2 mt-1">
                 <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold uppercase ${conditionBadge(item.condition)}`}>
                   {item.condition}
                 </span>
                 <span className="text-xs text-slate-500 uppercase font-semibold">{item.category}</span>
               </div>
            </div>
            {isList ? (
              <span className="bg-slate-900 text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm whitespace-nowrap">
                {priceLabel}
              </span>
            ) : null}
        </div>

        <p className="mt-2 text-sm text-slate-600 line-clamp-2 flex-1">{item.description}</p>

        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
          <span className="font-semibold text-slate-600">In stock</span>
          <span className="font-bold text-slate-900">{stockCount}</span>
        </div>

        <div className="pt-4 border-t border-slate-100 mt-auto">
          <div className="space-y-3">
             <div className="flex items-center justify-between">
               <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Seller</span>
                <span className="font-medium text-slate-800 text-sm">{item.sellerName}</span>
               </div>
             
               {hasValidSellerContact ? (
                  <a
                    href={`tel:${item.sellerContact}`}
                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
                  >
                    📞 Contact
                  </a>
               ) : (
                  <button className="bg-slate-100 text-slate-400 px-4 py-2 rounded-lg text-sm font-semibold cursor-not-allowed">
                    No Contact
                  </button>
               )}
             </div>

             {canBorrow ? (
               <button
                 onClick={() => onBorrow && onBorrow(item._id)}
                 disabled={isBorrowing || stockCount <= 0}
                 className="w-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
               >
                 {stockCount <= 0 ? "Out of Stock" : isBorrowing ? "Requesting..." : "Request Borrow"}
               </button>
             ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
