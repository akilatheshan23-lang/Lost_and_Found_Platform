import React, { useMemo, useState } from "react";

const categories = [
  { value: "electronic", label: "Electronic" },
  { value: "document", label: "Document" },
  { value: "book", label: "Book" },
  { value: "bag", label: "Bag" },
  { value: "other", label: "Other" },
];

const itemTypes = [
  { value: "mobile", label: "Mobile" },
  { value: "document", label: "Document" },
  { value: "laptop", label: "Laptop" },
  { value: "book", label: "Book" },
  { value: "bag", label: "Bag" },
  { value: "other", label: "Other" },
];

const initialForm = {
  claimedBy: "",
  userEmail: "mira32142003@gmail.com",
  userPhone: "",
  claimDate: "",
  claimPlace: "",
  claimTime: "",
  claimCategory: "electronic",
  itemType: "mobile",
  itemName: "",
  itemColor: "",
  authorizationDetails: "",
  phoneNumber: "",
  imeiNumber: "",
  laptopContactNumber: "",
  bookColor: "",
  bagColor: "",
};

export default function ClaimForm({ item, onSubmit }) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    ...initialForm,
    itemName: item?.itemName || "",
    itemColor: item?.color || "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const helperText = useMemo(() => {
    if (form.itemType === "mobile") return "Enter the matching phone number and IMEI number.";
    if (form.itemType === "document") return "Documents do not require extra matching fields.";
    if (form.itemType === "laptop") return "Enter the contact number related to the laptop.";
    if (form.itemType === "book") return "Book color is required.";
    if (form.itemType === "bag") return "Bag color is required.";
    return "Add any details that help admin verify the claim.";
  }, [form.itemType]);

  const submit = async (e) => {
    e.preventDefault();
    if (!item?._id) return;
    setSubmitting(true);
    try {
      await onSubmit({ claimItemId: item._id, ...form });
      setForm({
        ...initialForm,
        itemName: item?.itemName || "",
        itemColor: item?.color || "",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="bg-slate-100 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">{item?.itemName || "Item"}</h4>
            <p className="text-sm text-slate-500">📍 {item?.location || "—"}</p>
            <p className="text-xs text-slate-500 mt-1">Fill all required claim details for admin review.</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Your Name *" value={form.claimedBy} onChange={(v) => set("claimedBy", v)} placeholder="Your full name" required />
        <Input label="Email *" type="email" value={form.userEmail} onChange={(v) => set("userEmail", v)} placeholder="mira32142003@gmail.com" required />
        <Input label="Mobile Phone Number *" value={form.userPhone} onChange={(v) => set("userPhone", v)} placeholder="+94 XX XXX XXXX" required />
        <Input label="Date *" type="date" value={form.claimDate} onChange={(v) => set("claimDate", v)} required />
        <Input label="Place *" value={form.claimPlace} onChange={(v) => set("claimPlace", v)} placeholder="Where you lost the item" required />
        <Input label="Time *" type="time" value={form.claimTime} onChange={(v) => set("claimTime", v)} required />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Select label="Choose Category *" value={form.claimCategory} onChange={(v) => set("claimCategory", v)} options={categories} />
        <Select label="Select Item Type *" value={form.itemType} onChange={(v) => set("itemType", v)} options={itemTypes} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Input label="Item Name *" value={form.itemName} onChange={(v) => set("itemName", v)} placeholder="Item name" required />
        <Input label="Item Color *" value={form.itemColor} onChange={(v) => set("itemColor", v)} placeholder="Color" required />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <div className="font-semibold mb-1">Verification Details</div>
        <p>{helperText}</p>
      </div>

      {form.itemType === "mobile" && (
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Phone Number on Mobile *" value={form.phoneNumber} onChange={(v) => set("phoneNumber", v)} placeholder="Registered mobile number" required />
          <Input label="IMEI Number *" value={form.imeiNumber} onChange={(v) => set("imeiNumber", v)} placeholder="IMEI number" required />
        </div>
      )}

      {form.itemType === "laptop" && (
        <Input label="Laptop Contact Number *" value={form.laptopContactNumber} onChange={(v) => set("laptopContactNumber", v)} placeholder="Contact number linked to laptop" required />
      )}

      {form.itemType === "book" && (
        <Input label="Book Color *" value={form.bookColor} onChange={(v) => set("bookColor", v)} placeholder="Book color" required />
      )}

      {form.itemType === "bag" && (
        <Input label="Bag Color *" value={form.bagColor} onChange={(v) => set("bagColor", v)} placeholder="Bag color" required />
      )}

      <div>
        <label className="block text-slate-700 font-medium mb-1">Authorization Details * (description / details)</label>
        <textarea
          required
          rows="4"
          value={form.authorizationDetails}
          onChange={(e) => set("authorizationDetails", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none resize-none"
          placeholder="Explain how admin can verify that this item belongs to you..."
        />
      </div>

      <button disabled={submitting} className="w-full btn-success text-white py-3 rounded-xl font-semibold">
        {submitting ? "Submitting..." : "Submit Claim"}
      </button>
    </form>
  );
}

function Input({ label, onChange, ...props }) {
  return (
    <div>
      <label className="block text-slate-700 font-medium mb-1">{label}</label>
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-slate-700 font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
