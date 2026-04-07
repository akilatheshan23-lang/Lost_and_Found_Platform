import { useEffect, useState } from "react";
import {
  apiPending,
  apiApproveMarketplace,
  apiRejectMarketplace,
} from "../api/admin.api";
import Modal from "../components/Modal";
import { useAuth } from "../../../state/AuthContext";
import { useToast } from "../components/Toast";

export default function AdminMarketplacePanel() {
  const { user } = useAuth();
  const toast = useToast();
  // using pending data structure that includes { marketplace: [...] }
  const [data, setData] = useState({ marketplace: [] });
  const [loading, setLoading] = useState(false);

  const [rejectTarget, setRejectTarget] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiPending();
      setData({ marketplace: res.marketplace || [] });
    } catch (e) {
      toast.push(e?.response?.data?.message || "Failed to load admin data", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      load();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="card-solid p-8 text-center text-slate-600">Admin only.</div>
      </div>
    );
  }

  async function approve(id) {
    try {
      await apiApproveMarketplace(id);
      toast.push("Approved ✅", "success");
      load();
    } catch (e) {
      toast.push(e?.response?.data?.message || "Approve failed", "error");
    }
  }

  function openReject(id, title) {
    setRejectTarget({ id, title });
  }

  async function reject() {
    if (!rejectTarget) return;
    try {
      await apiRejectMarketplace(rejectTarget.id);
      toast.push("Rejected and Deleted ❌", "success");
      setRejectTarget(null);
      load();
    } catch (e) {
      toast.push(e?.response?.data?.message || "Reject failed", "error");
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="card-solid p-5 bg-gradient-to-r from-amber-50 to-white">
        <div className="text-2xl font-bold text-amber-900">🛒 Marketplace Admin Panel</div>
        <div className="text-sm text-amber-700 mt-1">Approve / reject pending listings.</div>
      </div>

      <div className="card-solid p-5">
        <div className="flex items-center justify-between">
          <div className="font-bold text-slate-900">⏳ Pending Listings</div>
          {loading ? <div className="text-sm text-slate-500">Loading...</div> : null}
        </div>

        {data.marketplace.length === 0 && !loading ? (
          <div className="text-slate-500 py-8 text-center bg-slate-50 rounded-xl mt-4 border border-dashed border-slate-200">No pending listings.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {data.marketplace.map((x) => (
              <div key={x._id} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm hover:shadow transition-shadow flex flex-col">
                <div className="text-sm text-slate-600 mb-1 font-medium">{x.sellerName} • {x.category}</div>
                <div className="font-bold text-slate-900 text-lg">{x.title}</div>
                <div className="text-xl font-bold text-teal-600 mt-1">${x.price}</div>
                <div className="text-sm text-slate-700 mt-2 line-clamp-3 flex-1">{x.description}</div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <button onClick={() => approve(x._id)} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg font-medium text-sm transition-colors">Approve</button>
                  <button onClick={() => openReject(x._id, x.title)} className="flex-1 bg-rose-100 hover:bg-rose-200 text-rose-700 py-2 rounded-lg font-medium text-sm transition-colors">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Confirm Rejection" maxWidth="max-w-md">
        <div className="space-y-3">
          <div className="text-slate-700 text-sm">
            Are you sure you want to reject and delete this listing?
            <div className="font-bold mt-2 text-lg text-slate-900">{rejectTarget?.title}</div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg" onClick={() => setRejectTarget(null)}>Cancel</button>
            <button className="flex-1 bg-rose-600 text-white py-2 rounded-lg" onClick={reject}>
              Delete Listing
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
