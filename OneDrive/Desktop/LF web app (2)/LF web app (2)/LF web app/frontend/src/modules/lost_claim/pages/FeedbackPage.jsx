import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { submitFeedback } from "../services/claimService";

export default function FeedbackPage() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { claims, refreshAll } = useData();
  const { showToast } = useToast();

  const claimId = params.get("claimId") || "";
  const claim = useMemo(() => claims.find((c) => c._id === claimId), [claims, claimId]);

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!claimId) {
      showToast("Open feedback from an approved claim.", "⚠️");
      return;
    }
    if (!text.trim()) {
      showToast("Feedback is compulsory.", "⚠️");
      return;
    }
    setSubmitting(true);
    try {
      await submitFeedback(claimId, text, rating);
      showToast("Thank you for your feedback! It is now visible in the admin panel.", "⭐");
      setText("");
      setRating(0);
      await refreshAll();
      nav("/claims");
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to submit feedback.", "⚠️");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => nav("/")} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Submit Feedback</h2>
          {claimId && (
            <p className="text-slate-500 text-sm mt-1">
              Claim: <span className="font-medium">{claim?.itemName || claim?.claimItem?.itemName || claimId}</span>
            </p>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-6 border border-slate-200 max-w-lg mx-auto">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 mb-5 text-sm">
          Feedback is compulsory. After you submit it, the feedback is linked to the admin panel.
        </div>

        <form onSubmit={submit}>
          <div className="mb-4">
            <label className="block text-slate-700 font-medium mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={n <= rating ? "text-3xl text-yellow-400 transition" : "text-3xl text-slate-300 hover:text-yellow-400 transition"}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-slate-700 font-medium mb-2">Your Feedback *</label>
            <textarea
              rows="4"
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              placeholder="Share your experience..."
            />
          </div>

          <button disabled={submitting} type="submit" className="w-full btn-primary text-white py-3 rounded-xl font-semibold">
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {!claimId && (
          <p className="text-xs text-slate-500 mt-4">
            Tip: Open feedback from the <b>Claims</b> page after a claim is approved.
          </p>
        )}
      </div>
    </div>
  );
}
