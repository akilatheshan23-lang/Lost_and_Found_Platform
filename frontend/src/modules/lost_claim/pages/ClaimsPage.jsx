import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import ClaimCard from "../components/ClaimCard";
import StatusBadge from "../components/StatusBadge";
import { useData } from "../context/DataContext";
import { approvalPdfUrl } from "../services/claimService";

export default function ClaimsPage() {
  const nav = useNavigate();
  const { claims } = useData();

  const [openView, setOpenView] = useState(false);
  const [selected, setSelected] = useState(null);

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button onClick={() => nav("/")} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Claim Management</h2>
          <p className="text-slate-500 text-sm mt-1">Track submitted claims, approval PDF, and feedback status.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {claims.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center border border-slate-200 col-span-full">
            <span className="text-4xl mb-4 block">✋</span>
            <p className="text-slate-500">No claims yet. Submit a claim for found items.</p>
          </div>
        ) : (
          claims.map((c) => (
            <ClaimCard
              key={c._id}
              claim={c}
              onView={(cl) => {
                setSelected(cl);
                setOpenView(true);
              }}
              onFeedback={(cl) => nav(`/feedback?claimId=${cl._id}`)}
            />
          ))
        )}
      </div>

      <Modal open={openView} title="Claim Details" onClose={() => setOpenView(false)} headerClassName="bg-gradient-to-r from-green-600 to-green-700">
        <ClaimDetails claim={selected} />
      </Modal>
    </div>
  );
}

function ClaimDetails({ claim }) {
  if (!claim) return <p className="text-slate-500">No claim selected.</p>;

  const showPdf = ["approved", "collected"].includes(claim.status);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Claim Request</h3>
          <p className="text-sm text-slate-500">Full claim details submitted for admin review.</p>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <Section title="Claimant">
        <Info label="Name" value={claim.claimedBy} />
        <Info label="Email" value={claim.userEmail} />
        <Info label="Mobile Phone Number" value={claim.userPhone} />
      </Section>

      <Section title="Claim Details Form">
        <Info label="Date" value={claim.claimDate} />
        <Info label="Place" value={claim.claimPlace} />
        <Info label="Time" value={claim.claimTime} />
        <Info label="Category" value={claim.claimCategory} />
        <Info label="Item Type" value={claim.itemType} />
        <Info label="Item Name" value={claim.itemName} />
        <Info label="Item Color" value={claim.itemColor} />
      </Section>

      <Section title="Verification">
        <Info label="Authorization Details" value={claim.authorizationDetails} />
        {claim.phoneNumber ? <Info label="Phone Number on Mobile" value={claim.phoneNumber} /> : null}
        {claim.imeiNumber ? <Info label="IMEI Number" value={claim.imeiNumber} /> : null}
        {claim.laptopContactNumber ? <Info label="Laptop Contact Number" value={claim.laptopContactNumber} /> : null}
        {claim.bookColor ? <Info label="Book Color" value={claim.bookColor} /> : null}
        {claim.bagColor ? <Info label="Bag Color" value={claim.bagColor} /> : null}
      </Section>

      <Section title="Admin Workflow">
        <Info label="Notification" value={claim.approvalNotification || "Waiting for admin review"} />
        <Info label="Admin Note" value={claim.adminNote || "—"} />
        <Info label="Approval Email" value={claim.emailSentAt ? `Sent / prepared on ${new Date(claim.emailSentAt).toLocaleString()}` : "Not sent yet"} />
        <Info label="Fallback Mail File" value={claim.emailFallbackPath || "—"} />
      </Section>

      {showPdf && (
        <a href={approvalPdfUrl(claim._id)} className="block text-center btn-primary text-white py-3 rounded-xl font-semibold">
          Download Approval PDF
        </a>
      )}

      {claim.status === "approved" && (
        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-sm text-green-800">
          Approved. Please collect your item through the main gate security and present this document to the security officer.
        </div>
      )}

      {claim.feedback && (
        <Section title="Feedback">
          <Info label="Rating" value={`${claim.feedbackRating || 0}/5`} />
          <Info label="Comment" value={claim.feedback} />
        </Section>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-slate-50 p-4 rounded-xl space-y-2">
      <p className="font-semibold text-slate-800">{title}</p>
      {children}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-slate-500 text-sm">{label}</p>
      <p className="text-slate-800 break-words">{value || "—"}</p>
    </div>
  );
}
