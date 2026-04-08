import React from "react";
import StatusBadge from "./StatusBadge";
import { approvalPdfUrl } from "../services/claimService";

export default function ClaimCard({ claim, onView, onFeedback }) {
  const itemName = claim.claimItem?.itemName || claim.itemName || "Unknown Item";
  const needsFeedback = ["approved", "collected"].includes(claim.status) && !claim.feedback;

  return (
    <div className="glass rounded-xl p-4 border border-slate-200 card-hover">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <h4 className="font-bold text-slate-800">{itemName}</h4>
          <p className="text-xs text-slate-500 mt-1 capitalize">{claim.itemType} • {claim.claimCategory}</p>
        </div>
        <StatusBadge status={claim.status} />
      </div>

      <div className="space-y-1 text-sm mb-3">
        <p className="text-slate-600">Claimed by: {claim.claimedBy}</p>
        <p className="text-slate-500">Date / Time: {claim.claimDate} {claim.claimTime}</p>
        <p className="text-slate-500">Place: {claim.claimPlace}</p>
      </div>

      <p className="text-sm text-slate-500 mb-3 line-clamp-3">{claim.authorizationDetails || "No authorization details"}</p>

      <div className="flex gap-2">
        <button
          onClick={() => onView?.(claim)}
          className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
        >
          View Details
        </button>
        {["approved", "collected"].includes(claim.status) && (
          <a
            href={approvalPdfUrl(claim._id)}
            className="flex-1 px-3 py-2 btn-primary text-white rounded-lg text-sm font-medium text-center"
          >
            📄 PDF
          </a>
        )}
      </div>

      {claim.status === "approved" && (
        <div className="mt-3 rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Collect your item from main gate security and present the approval PDF.
        </div>
      )}

      {claim.status === "collected" && (
        <div className="mt-3 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-800">
          Item collected successfully and recorded in the system.
        </div>
      )}

      {needsFeedback && (
        <button
          onClick={() => onFeedback?.(claim)}
          className="w-full mt-2 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg text-sm font-medium transition"
        >
          ⭐ Feedback Required
        </button>
      )}

      {claim.feedback && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 border border-slate-200">
          <p className="text-xs text-slate-500 mb-1">Your Feedback</p>
          <p className="text-sm text-slate-700">{claim.feedback}</p>
          <p className="text-xs text-slate-500 mt-1">Rating: {claim.feedbackRating || 0}/5</p>
        </div>
      )}
    </div>
  );
}
