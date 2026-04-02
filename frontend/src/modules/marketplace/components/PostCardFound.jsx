import { useMemo } from "react";
import { Link } from "react-router-dom";

function categoryBadge(category) {
  const styles = {
    electronics: "bg-blue-50 text-blue-700 border-blue-100",
    documents: "bg-amber-50 text-amber-800 border-amber-100",
    accessories: "bg-pink-50 text-pink-700 border-pink-100",
    clothing: "bg-purple-50 text-purple-700 border-purple-100",
    keys: "bg-slate-50 text-slate-700 border-slate-200",
    other: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };
  return styles[category] || "bg-slate-50 text-slate-700 border-slate-200";
}

export default function PostCardFound({ item }) {
  const dt = useMemo(() => new Date(item.foundDate), [item.foundDate]);

  return (
    <div className="card-solid card-hover overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                item.userType === "student" ? "bg-blue-50" : "bg-purple-50"
              }`}
            >
              {item.userType === "student" ? "🎓" : "👔"}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="font-semibold text-slate-900 truncate">{item.createdByName}</div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border ${
                    item.userType === "student"
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : "bg-purple-50 text-purple-700 border-purple-100"
                  }`}
                >
                  {item.userType}
                </span>
                <span className="text-slate-400 text-sm">•</span>
                <span className="text-slate-500 text-sm">{dt.toLocaleString()}</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">📍 {item.location}</div>
            </div>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium border ${categoryBadge(item.category)}`}
          >
            {item.category}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
          <p className="text-slate-700 mt-1 whitespace-pre-wrap">{item.description}</p>
        </div>

        {item.imageUrl ? (
          <div className="rounded-2xl overflow-hidden border border-slate-200">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full max-h-[420px] object-cover"
              loading="lazy"
            />
          </div>
        ) : null}

        <div className="flex justify-end">
          <Link to={`/claims/${item._id}`} className="btn-warning">
            🙋 Claim
          </Link>
        </div>
      </div>
    </div>
  );
}
