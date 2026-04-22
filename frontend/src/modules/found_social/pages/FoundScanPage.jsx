import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiGetFoundScanData } from "../api/found.api";
import { useToast } from "../components/Toast";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString();
}

function formatTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function InfoCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/80 bg-white/90 p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</div>
      <div className="mt-2 text-base font-semibold text-slate-900 break-words">{value || "N/A"}</div>
    </div>
  );
}

export default function FoundScanPage() {
  const { token } = useParams();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setErrorMessage("");

        const data = await apiGetFoundScanData(token);

        if (!mounted) return;
        setItem(data);
      } catch (error) {
        if (!mounted) return;

        const msg = error?.response?.data?.message || "QR record not found";
        setItem(null);
        setErrorMessage(msg);

        if (toast?.push) {
          toast.push(msg, "error");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [token]);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const pdfUrl = `${baseURL}/api/found/scan/${token}/pdf`;

  return (
    <div className="max-w-5xl mx-auto py-2">
      <div className="rounded-[32px] border border-white/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-[0_30px_80px_rgba(15,23,42,0.28)]">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-100">
              QR Verification View
            </div>
            <h1 className="mt-4 text-3xl font-black">Found Item Scan Details</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">
              This page is opened from the found-item QR code. It shows only safe item details for admin or security verification.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={pdfUrl} className="btn-warning">
              ⬇️ Download PDF
            </a>
            <Link to="/found" className="btn-secondary">
              ← Back to Found Feed
            </Link>
          </div>
        </div>
      </div>

      {loading && (
        <div className="card-solid p-10 text-center text-slate-500 mt-4">
          Loading verification details...
        </div>
      )}

      {!loading && errorMessage && (
        <div className="card-solid p-10 text-center text-slate-500 mt-4">
          {errorMessage}
        </div>
      )}

      {!loading && item && (
        <div className="mt-4 grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
          <div className="card-solid p-5">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <div className="text-sm font-semibold text-indigo-600">Campus Verification Record</div>
                <h2 className="mt-1 text-2xl font-black text-slate-900">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Sensitive contact details are hidden here. Only essential verification data is shown.
                </p>
              </div>

              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                {String(item.status || "pending").toUpperCase()}
              </div>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <InfoCard label="Item Title" value={item.title} />
              <InfoCard label="Date" value={formatDate(item.foundDate)} />
              <InfoCard label="Time" value={formatTime(item.foundDate)} />
              <InfoCard label="Category" value={item.category} />
              <InfoCard label="Location" value={item.location} />
              <InfoCard label="Reported By" value={item.createdByName || "Campus user"} />
            </div>
          </div>

          <div className="card-solid p-5 flex flex-col">
            <div className="text-sm font-semibold text-slate-500">Downloaded QR Style Preview</div>

            <div className="mt-4 rounded-[28px] border border-dashed border-slate-200 bg-gradient-to-br from-indigo-50 to-sky-50 p-5 text-center flex-1 flex flex-col justify-center">
              {item.qrCodeData ? (
                <img
                  src={item.qrCodeData}
                  alt="Found item QR"
                  className="mx-auto w-full max-w-[220px] rounded-[24px] border border-white bg-white p-3 shadow-sm"
                />
              ) : (
                <div className="text-slate-400">QR preview unavailable</div>
              )}

              <div className="mt-4 text-xs leading-6 text-slate-500">
                Security can keep a PDF copy on the device after scanning for quick offline reference.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}