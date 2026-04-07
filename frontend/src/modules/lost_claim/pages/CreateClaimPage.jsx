import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ClaimForm from "../components/ClaimForm";
import { useToast } from "../context/ToastContext";
import { createClaim } from "../services/claimService";
import { useData } from "../context/DataContext";
import api from "../../../api";

export default function CreateClaimPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const { showToast } = useToast();
  const { refreshAll } = useData();

  const [foundItem, setFoundItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFoundItem = async () => {
      try {
        setLoading(true);
        // We fetch the found item using the central API so we can pre-propulate Name, Color etc
        const res = await api.get(`/api/found/${id}`);
        setFoundItem(res.data);
      } catch (err) {
        setError("Item not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchFoundItem();
  }, [id]);

  const onSubmitClaim = async (claimPayload) => {
    try {
      await createClaim(claimPayload);
      showToast("Claim submitted successfully and sent to admin!", "✓");
      await refreshAll();
      nav("/claims"); // Navigate to Claims dashboard so they can track its status
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to submit claim.", "⚠️");
    }
  };

  if (loading) return <div className="text-center p-12 text-slate-500">Loading item details...</div>;
  if (error || !foundItem) return <div className="text-center p-12 text-red-500">{error}</div>;

  return (
    <div className="animate-[fadeIn_0.3s_ease] max-w-4xl mx-auto">
      <div className="mb-6">
        <button onClick={() => nav(-1)} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
          ← Back
        </button>
        <h2 className="text-3xl font-bold text-slate-800">Submit Claim</h2>
        <p className="text-slate-500 mt-2">
          You are claiming the found item <strong>"{foundItem.title || foundItem.itemName}"</strong> reported by {foundItem.createdByName}.
        </p>
      </div>

      <div className="glass rounded-2xl p-6 border border-white/50 premium-glow">
        <ClaimForm item={{ ...foundItem, itemName: foundItem.title || foundItem.itemName }} onSubmit={onSubmitClaim} />
      </div>
    </div>
  );
}
