import React, { useMemo, useState } from "react";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import StatusBadge from "../components/StatusBadge";
import { updateClaimStatus } from "../services/claimService";

export default function AdminClaimDashboard() {
  const { claims, refreshAll } = useData();
  const { showToast } = useToast();
  const [busyId, setBusyId] = useState("");
  const [notes, setNotes] = useState({});

  const orderedClaims = useMemo(
    () => [...claims].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [claims]
  );

  const doAction = async (id, status) => {
    setBusyId(id);
    try {
      await updateClaimStatus(id, status, notes[id] || "");
      showToast(`Claim ${status} successfully.`, status === "approved" ? "✓" : status === "collected" ? "📦" : "✕");
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
          <h2 className="text-2xl font-bold text-slate-800">Admin Dashboard — Claims</h2>
          <p className="text-slate-500 text-sm mt-1">Review claim forms, approve or reject, then mark item as collected after security release.</p>
        </div>
      </div>

      <div className="space-y-4">
        {orderedClaims.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center border border-slate-200">
            <p className="text-slate-500">No claims to review.</p>
          </div>
        ) : (
          orderedClaims.map((c) => (
            <div key={c._id} className="glass rounded-xl p-5 border border-slate-200">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h4 className="font-bold text-slate-800 text-lg">{c.itemName || c.claimItem?.itemName || "Unknown Item"}</h4>
                    <StatusBadge status={c.status} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <Card title="Claimant">
                      <p><span className="text-slate-500">Name:</span> {c.claimedBy}</p>
                      <p><span className="text-slate-500">Email:</span> {c.userEmail}</p>
                      <p><span className="text-slate-500">Phone:</span> {c.userPhone}</p>
                    </Card>

                    <Card title="Claim Form">
                      <p><span className="text-slate-500">Date:</span> {c.claimDate}</p>
                      <p><span className="text-slate-500">Place:</span> {c.claimPlace}</p>
                      <p><span className="text-slate-500">Time:</span> {c.claimTime}</p>
                      <p><span className="text-slate-500">Type:</span> {c.itemType}</p>
                      <p><span className="text-slate-500">Color:</span> {c.itemColor}</p>
                    </Card>
                  </div>

                  <Card title="Authorization Details">
                    <p className="text-slate-700 whitespace-pre-wrap">{c.authorizationDetails}</p>
                    <div className="grid md:grid-cols-2 gap-2 mt-3 text-sm">
                      {c.phoneNumber ? <p><span className="text-slate-500">Phone Number:</span> {c.phoneNumber}</p> : null}
                      {c.imeiNumber ? <p><span className="text-slate-500">IMEI Number:</span> {c.imeiNumber}</p> : null}
                      {c.laptopContactNumber ? <p><span className="text-slate-500">Laptop Contact:</span> {c.laptopContactNumber}</p> : null}
                      {c.bookColor ? <p><span className="text-slate-500">Book Color:</span> {c.bookColor}</p> : null}
                      {c.bagColor ? <p><span className="text-slate-500">Bag Color:</span> {c.bagColor}</p> : null}
                    </div>
                  </Card>

                  <Card title="System / Security Status">
                    <p><span className="text-slate-500">Notification:</span> {c.approvalNotification || "Waiting"}</p>
                    <p><span className="text-slate-500">Approval Email:</span> {c.emailSentAt ? new Date(c.emailSentAt).toLocaleString() : "Not sent yet"}</p>
                    <p><span className="text-slate-500">Mail Fallback File:</span> {c.emailFallbackPath || "—"}</p>
                    <p><span className="text-slate-500">Approved At:</span> {c.approvedAt ? new Date(c.approvedAt).toLocaleString() : "—"}</p>
                    <p><span className="text-slate-500">Collected At:</span> {c.collectedAt ? new Date(c.collectedAt).toLocaleString() : "—"}</p>
                  </Card>

                  <Card title="Feedback (linked from user side)">
                    {c.feedback ? (
                      <>
                        <p className="text-slate-700">{c.feedback}</p>
                        <p className="text-sm text-slate-500 mt-2">Rating: {c.feedbackRating || 0}/5</p>
                        <p className="text-xs text-slate-500">Submitted: {c.feedbackSubmittedAt ? new Date(c.feedbackSubmittedAt).toLocaleString() : "—"}</p>
                      </>
                    ) : (
                      <p className="text-sm text-amber-700">Feedback not submitted yet. User feedback is compulsory and appears here after submission.</p>
                    )}
                  </Card>
                </div>

                <div className="w-full lg:w-[320px] space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Admin Note</label>
                    <textarea
                      rows="5"
                      value={notes[c._id] ?? c.adminNote ?? ""}
                      onChange={(e) => setNotes((prev) => ({ ...prev, [c._id]: e.target.value }))}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Optional admin note"
                    />
                  </div>

                  {c.status === "pending" && (
                    <>
                      <button
                        disabled={busyId === c._id}
                        onClick={() => doAction(c._id, "approved")}
                        className="w-full px-4 py-3 btn-success text-white rounded-lg font-medium"
                      >
                        {busyId === c._id ? "Processing..." : "✓ Approve Claim"}
                      </button>
                      <button
                        disabled={busyId === c._id}
                        onClick={() => doAction(c._id, "rejected")}
                        className="w-full px-4 py-3 btn-danger text-white rounded-lg font-medium"
                      >
                        {busyId === c._id ? "Processing..." : "✕ Reject Claim"}
                      </button>
                    </>
                  )}

                  {c.status === "approved" && (
                    <button
                      disabled={busyId === c._id}
                      onClick={() => doAction(c._id, "collected")}
                      className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium"
                    >
                      {busyId === c._id ? "Processing..." : "📦 Mark Item Collected"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-slate-500 mt-6">
        If approve, reject, or collected actions fail, set the same key in <code>server/.env ADMIN_KEY</code> and <code>client/.env VITE_ADMIN_KEY</code>.
      </p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
      <p className="font-semibold text-slate-800 mb-2">{title}</p>
      {children}
    </div>
  );
}
