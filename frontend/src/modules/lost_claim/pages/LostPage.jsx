import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import LostItemCard from "../components/LostItemCard";
import ItemDetails from "../components/ItemDetails";
import CreateLostItem, { categories } from "../components/CreateLostItem";
import ClaimForm from "../components/ClaimForm";
import { useData } from "../context/DataContext";
import { useToast } from "../context/ToastContext";
import { createLostItem } from "../services/lostService";
import { createClaim } from "../services/claimService";

export default function LostPage() {
  const nav = useNavigate();
  const { lostItems, claims, refreshAll } = useData();
  const { showToast } = useToast();

  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openClaim, setOpenClaim] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);



  const filtered = useMemo(() => {
    return lostItems.filter((x) => {
      if (filterCategory && x.category !== filterCategory) return false;
      if (filterStatus && x.status !== filterStatus) return false;
      return true;
    });
  }, [lostItems, filterCategory, filterStatus]);

  const onSubmitLost = async (payload) => {
    try {
      await createLostItem(payload);
      showToast("Lost item reported successfully!", "✓");
      setOpenCreate(false);
      await refreshAll();
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to submit. Please try again.", "⚠️");
    }
  };

  const onSubmitClaim = async (claimPayload) => {
    try {
      await createClaim(claimPayload);
      showToast("Claim submitted successfully and sent to admin!", "✓");
      setOpenClaim(false);
      await refreshAll();
      nav("/claims");
    } catch (e) {
      showToast(e?.response?.data?.message || "Failed to submit claim.", "⚠️");
    }
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button onClick={() => nav("/")} className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-1">
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold text-slate-800">Lost Items</h2>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="btn-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center gap-2"
        >
          <span className="text-xl">+</span> Create Lost Item
        </button>
      </div>

      <div className="glass rounded-xl p-4 mb-6 border border-slate-200">
        <div className="flex flex-wrap gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center border border-slate-200 col-span-full">
            <span className="text-4xl mb-4 block">📦</span>
            <p className="text-slate-500">No lost items found.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <LostItemCard
              key={item._id}
              item={item}
              onView={(it) => {
                setSelectedItem(it);
                setOpenView(true);
              }}
            />
          ))
        )}
      </div>

      <Modal open={openCreate} title="Report Lost Item" onClose={() => setOpenCreate(false)}>
        <CreateLostItem onSubmit={onSubmitLost} />
      </Modal>

      <Modal
        open={openView}
        title="Item Details"
        onClose={() => setOpenView(false)}
        headerClassName="bg-gradient-to-r from-slate-700 to-slate-800"
      >
        <ItemDetails item={selectedItem} />
      </Modal>


    </div>
  );
}
