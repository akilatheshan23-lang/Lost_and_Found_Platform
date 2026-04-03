import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetFoundQr } from "../api/found.api";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";

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

function triggerDownload(dataUrl, filename) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default function PostCardFound({ item }) {
  const { user } = useAuth();
  const toast = useToast();
  const [downloadingQr, setDownloadingQr] = useState(false);

  const dt = useMemo(() => new Date(item.foundDate), [item.foundDate]);
  const imgSrc = item.imageData || item.imageUrl || "";
  const currentUserId = user?._id || user?.id || "";
  const itemCreatorId = typeof item.createdBy === "object" ? item.createdBy?._id : item.createdBy;
  const isCreator = Boolean(currentUserId) && String(itemCreatorId || "") === String(currentUserId);
  const canDownloadQr = isCreator && item.status === "approved";

  async function downloadQr() {
    if (!isCreator) {
      toast.push("Only the owner of this found post can download the QR code.", "warning");
      return;
    }

    if (item.status !== "approved") {
      toast.push("QR code is available only after admin approval.", "warning");
      return;
    }

    try {
      setDownloadingQr(true);
      const data = await apiGetFoundQr(item._id);
      triggerDownload(data.qrCodeData, data.filename || `found-item-qr-${item._id}.png`);
      toast.push("QR downloaded successfully", "success");
    } catch (error) {
      toast.push(error?.response?.data?.message || "Unable to download QR code", "error");
    } finally {
      setDownloadingQr(false);
    }
  }

  return (
    <div className="card-solid card-hover overflow-hidden border-white/90 bg-white/92">
      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ring-1 ${
                item.userType === "student"
                  ? "bg-gradient-to-br from-blue-50 to-sky-100 ring-blue-100"
                  : "bg-gradient-to-br from-violet-50 to-fuchsia-100 ring-violet-100"
              }`}
            >
              {item.userType === "student" ? "🎓" : "👔"}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <div className="truncate font-semibold text-slate-900">{item.createdByName}</div>
                <span
                  className={`rounded-full border px-2.5 py-1 text-xs ${
                    item.userType === "student"
                      ? "bg-blue-50 text-blue-700 border-blue-100"
                      : "bg-purple-50 text-purple-700 border-purple-100"
                  }`}
                >
                  {item.userType}
                </span>
                <span className="text-sm text-slate-400">•</span>
                <span className="text-sm text-slate-500">{dt.toLocaleString()}</span>
              </div>
              <div className="mt-1 text-xs text-slate-500">📍 {item.location}</div>
            </div>
          </div>

          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${categoryBadge(item.category)}`}>
            {item.category}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
          <p className="mt-1 whitespace-pre-wrap text-slate-700">{item.description}</p>
        </div>

        {imgSrc ? (
          <div className="overflow-hidden rounded-3xl border border-white/70 shadow-inner">
            <img src={imgSrc} alt={item.title} className="max-h-[420px] w-full object-cover" loading="lazy" />
          </div>
        ) : null}

        <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
          {canDownloadQr ? (
            <button onClick={downloadQr} disabled={downloadingQr} className="btn-secondary">
              {downloadingQr ? "Preparing QR..." : "⬇️ Download QR"}
            </button>
          ) : null}

          <Link to={`/claims/${item._id}`} className="btn-warning">
            🙋 Claim
          </Link>
        </div>
      </div>
    </div>
  );
}