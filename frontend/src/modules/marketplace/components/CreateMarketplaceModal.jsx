import React, { useState } from "react";
import { useAuth } from "../../../state/AuthContext";

const CATEGORIES = ["electronics", "textbooks", "furniture", "clothing", "accessories", "other"];
const CONDITIONS = ["new", "like-new", "good", "fair", "poor"];

export default function CreateMarketplaceModal({ onSubmit }) {
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "other",
    condition: "good",
    sellerName: user?.name || "",
    sellerContact: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      
      if (imageFile) {
        fd.append("image", imageFile);
      }

      await onSubmit(fd);

      // Reset
      setForm({
        title: "",
        description: "",
        price: "",
        category: "other",
        condition: "good",
        sellerName: user?.name || "",
        sellerContact: "",
      });
      setImageFile(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-slate-700 font-bold mb-1">Item Title *</label>
        <input
          required
          maxLength={60}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-medium text-slate-800"
          placeholder="e.g. Sony WH-1000XM4 Headphones"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-slate-700 font-bold mb-1">Price (LKR) *</label>
           <div className="relative">
             <span className="absolute left-4 top-3 text-slate-400 font-bold">Rs.</span>
             <input
               required
               type="number"
               min="0"
               value={form.price}
               onChange={(e) => set("price", e.target.value)}
               className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
               placeholder="45000"
             />
           </div>
        </div>

        <div>
          <label className="block text-slate-700 font-bold mb-1">Condition</label>
          <select
            value={form.condition}
            onChange={(e) => set("condition", e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all uppercase text-sm font-bold text-slate-800"
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Category</label>
        <select
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all uppercase text-sm font-bold text-slate-800"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-slate-700 font-bold mb-1">Description *</label>
        <textarea
          required
          rows={3}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none transition-all text-slate-800"
          placeholder="Selling my headphones. Perfect condition, comes with box..."
        />
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 border-dashed">
         <label className="block text-slate-700 font-bold flex items-center gap-2 mb-2">📸 Item Image</label>
         <input 
           type="file" 
           accept="image/*" 
           onChange={(e) => setImageFile(e.target.files?.[0] || null)}
           className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-colors cursor-pointer"
         />
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-slate-700 font-bold mb-1 text-sm">Seller Name *</label>
          <input
            required
            value={form.sellerName}
            onChange={(e) => set("sellerName", e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-sm"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-bold mb-1 text-sm">Contact Number *</label>
          <input
            required
            type="tel"
            value={form.sellerContact}
            onChange={(e) => set("sellerContact", e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 text-sm"
            placeholder="07X XXX XXXX"
          />
        </div>
      </div>

      <div className="pt-4">
        <button 
           disabled={submitting} 
           className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-lg flex justify-center items-center gap-2"
        >
          {submitting ? "Processing..." : <>🏪 Post to Marketplace</>}
        </button>
      </div>
    </form>
  );
}
