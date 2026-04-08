import React, { useState } from "react";

const CATEGORIES = ["electronics", "textbooks", "furniture", "clothing", "accessories", "other"];

function normalizeSriLankanMobile(value) {
  const compact = String(value || "").trim().replace(/[\s-]/g, "");
  const digits = compact.replace(/\D/g, "");

  if (/^07\d{8}$/.test(digits)) return digits;
  if (/^947\d{8}$/.test(digits)) return `0${digits.slice(2)}`;
  if (/^00947\d{8}$/.test(digits)) return `0${digits.slice(4)}`;
  return "";
}

export default function RequestMarketplaceItemModal({ onSubmit }) {
  const [form, setForm] = useState({
    itemName: "",
    category: "other",
    quantity: "1",
    maxBudget: "",
    contactNumber: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");

    const itemName = String(form.itemName || "").trim();
    const quantity = Number(form.quantity);
    const maxBudget = Number(form.maxBudget);
    const contactNumber = normalizeSriLankanMobile(form.contactNumber);
    const note = String(form.note || "").trim();

    if (itemName.length < 3 || itemName.length > 80) {
      setFormError("Requested item name must be between 3 and 80 characters.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      setFormError("Quantity must be an integer between 1 and 100.");
      return;
    }

    if (!Number.isFinite(maxBudget) || maxBudget <= 0 || maxBudget > 10000000) {
      setFormError("Max budget must be between LKR 1 and LKR 10,000,000.");
      return;
    }

    if (!contactNumber) {
      setFormError("Contact number must be valid Sri Lankan format (07XXXXXXXX, +947XXXXXXXX, or 947XXXXXXXX).");
      return;
    }

    if (note.length > 500) {
      setFormError("Note must be 500 characters or less.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        itemName,
        category: form.category,
        quantity,
        maxBudget,
        contactNumber,
        note,
      });

      setForm({
        itemName: "",
        category: "other",
        quantity: "1",
        maxBudget: "",
        contactNumber: "",
        note: "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      {formError ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {formError}
        </div>
      ) : null}

      <div>
        <label className="mb-1 block font-bold text-slate-700">Requested Item *</label>
        <input
          required
          value={form.itemName}
          onChange={(event) => set("itemName", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
          placeholder="e.g. Scientific calculator, office chair"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="mb-1 block font-bold text-slate-700">Category</label>
          <select
            value={form.category}
            onChange={(event) => set("category", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold uppercase text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block font-bold text-slate-700">Quantity *</label>
          <input
            required
            type="number"
            min="1"
            max="100"
            value={form.quantity}
            onChange={(event) => set("quantity", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <label className="mb-1 block font-bold text-slate-700">Max Budget (LKR) *</label>
          <input
            required
            type="number"
            min="1"
            value={form.maxBudget}
            onChange={(event) => set("maxBudget", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
            placeholder="10000"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-bold text-slate-700">Contact Number *</label>
        <input
          required
          type="tel"
          value={form.contactNumber}
          onChange={(event) => set("contactNumber", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
          placeholder="07XXXXXXXX"
        />
        <p className="mt-1 text-xs text-slate-500">Sri Lankan format: 07XXXXXXXX, +947XXXXXXXX, or 947XXXXXXXX</p>
      </div>

      <div>
        <label className="mb-1 block font-bold text-slate-700">Notes (optional)</label>
        <textarea
          rows={3}
          value={form.note}
          onChange={(event) => set("note", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
          placeholder="Any preferred brand/model/details"
        />
      </div>

      <button
        disabled={submitting}
        className="w-full rounded-xl bg-emerald-600 py-3 text-white font-bold hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
      >
        {submitting ? "Submitting..." : "Submit Item Request"}
      </button>
    </form>
  );
}
