import React, { useEffect, useState } from "react";
import { useAuth } from "../../../state/AuthContext";

const CATEGORIES = ["electronics", "textbooks", "furniture", "clothing", "accessories", "other"];
const CONDITIONS = ["new", "like-new", "good", "fair", "poor"];

export default function CreateMarketplaceModal({ onSubmit, initialValues = null, submitLabel = "Post to Marketplace" }) {
  const { user } = useAuth();

  const getInitialForm = () => ({
    title: "",
    description: "",
    price: "",
    stockCount: "1",
    category: "other",
    condition: "good",
    sellerName: user?.name || "",
    sellerContact: "",
    imageUrl: "",
  });

  const [form, setForm] = useState(getInitialForm);
  const [imageFile, setImageFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formError, setFormError] = useState("");

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    if (!initialValues) {
      setForm(getInitialForm());
      setImageFile(null);
      return;
    }

    setForm({
      title: initialValues.title || "",
      description: initialValues.description || "",
      price: initialValues.price !== undefined && initialValues.price !== null ? String(initialValues.price) : "",
      stockCount: initialValues.stockCount !== undefined && initialValues.stockCount !== null ? String(initialValues.stockCount) : "1",
      category: initialValues.category || "other",
      condition: initialValues.condition || "good",
      sellerName: initialValues.sellerName || user?.name || "",
      sellerContact: initialValues.sellerContact || "",
      imageUrl: initialValues.imageUrl || "",
    });
    setImageFile(null);
  }, [initialValues, user?.name]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  const getPreviewSrc = () => {
    if (imageFile) {
      return previewUrl;
    }

    if (!form.imageUrl) {
      return "";
    }

    if (form.imageUrl.startsWith("http")) {
      return form.imageUrl;
    }

    if (form.imageUrl.startsWith("/")) {
      return `http://localhost:5000${form.imageUrl}`;
    }

    return form.imageUrl;
  };

  const submit = async (event) => {
    event.preventDefault();
    setFormError("");

    const title = String(form.title || "").trim();
    const description = String(form.description || "").trim();
    const sellerName = String(form.sellerName || "").trim();
    const priceValue = Number(form.price);
    const stockValue = Number(form.stockCount);
    const rawContact = String(form.sellerContact || "").trim();

    const normalizeSriLankanMobile = (value) => {
      const compact = String(value || "").trim().replace(/[\s-]/g, "");
      const digits = compact.replace(/\D/g, "");

      if (/^07\d{8}$/.test(digits)) return digits;
      if (/^947\d{8}$/.test(digits)) return `0${digits.slice(2)}`;
      if (/^00947\d{8}$/.test(digits)) return `0${digits.slice(4)}`;
      return "";
    };

    const normalizedContact = normalizeSriLankanMobile(rawContact);

    if (title.length < 3 || title.length > 80) {
      setFormError("Title must be between 3 and 80 characters.");
      return;
    }
    if (description.length < 8 || description.length > 1000) {
      setFormError("Description must be between 8 and 1000 characters.");
      return;
    }
    if (!Number.isFinite(priceValue) || priceValue <= 0 || priceValue > 10000000) {
      setFormError("Price must be between LKR 1 and LKR 10,000,000.");
      return;
    }
    if (!Number.isInteger(stockValue) || stockValue < 1 || stockValue > 1000) {
      setFormError("Stock count must be an integer between 1 and 1000.");
      return;
    }
    if (sellerName.length < 2 || sellerName.length > 60 || !/\p{L}/u.test(sellerName)) {
      setFormError("Seller name must be 2-60 characters and include letters.");
      return;
    }
    if (!normalizedContact) {
      setFormError("Seller contact must be a valid Sri Lankan mobile number (07XXXXXXXX).\nYou can also use +947XXXXXXXX or 947XXXXXXXX.");
      return;
    }

    setSubmitting(true);

    try {
      let normalizedImageUrl = String(form.imageUrl || "").trim();
      if (normalizedImageUrl && !/^https?:\/\//i.test(normalizedImageUrl) && !normalizedImageUrl.startsWith("/")) {
        if (normalizedImageUrl.startsWith("www.") || /^[a-z0-9.-]+\.[a-z]{2,}(\/.*)?$/i.test(normalizedImageUrl)) {
          normalizedImageUrl = `https://${normalizedImageUrl}`;
        }
      }

      const payload = new FormData();
      Object.entries({
        ...form,
        title,
        description,
        sellerName,
        sellerContact: normalizedContact,
        price: String(priceValue),
        stockCount: String(stockValue),
        imageUrl: normalizedImageUrl,
      }).forEach(([key, value]) => payload.append(key, value));

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await onSubmit(payload);

      if (!initialValues) {
        setForm(getInitialForm());
      }
      setImageFile(null);
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
        <label className="mb-1 block font-bold text-slate-700">Item Title *</label>
        <input
          required
          maxLength={60}
          value={form.title ?? ""}
          onChange={(event) => set("title", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
          placeholder="e.g. Sony WH-1000XM4 Headphones"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block font-bold text-slate-700">Price (LKR) *</label>
          <div className="relative">
            <span className="absolute left-4 top-3 font-bold text-slate-400">Rs.</span>
            <input
              required
              type="number"
              min="0"
              value={form.price ?? ""}
              onChange={(event) => set("price", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 font-bold text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
              placeholder="45000"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block font-bold text-slate-700">Stock Count *</label>
          <input
            required
            type="number"
            min="0"
            value={form.stockCount ?? "1"}
            onChange={(event) => set("stockCount", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-bold text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
            placeholder="1"
          />
        </div>

        <div>
          <label className="mb-1 block font-bold text-slate-700">Condition</label>
          <select
            value={form.condition ?? "good"}
            onChange={(event) => set("condition", event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold uppercase text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
          >
            {CONDITIONS.map((condition) => (
              <option key={condition} value={condition}>{condition}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block font-bold text-slate-700">Category</label>
        <select
          value={form.category ?? "other"}
          onChange={(event) => set("category", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold uppercase text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
        >
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-bold text-slate-700">Description *</label>
        <textarea
          required
          rows={3}
          value={form.description ?? ""}
          onChange={(event) => set("description", event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-emerald-500"
          placeholder="Selling my headphones. Perfect condition, comes with box..."
        />
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
        <label className="mb-2 flex items-center gap-2 font-bold text-slate-700">Item Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setImageFile(file);
            if (file) {
              set("imageUrl", "");
            }
          }}
          className="w-full cursor-pointer text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-700 hover:file:bg-emerald-100"
        />
        <div className="mt-3">
          <label className="mb-1 block text-sm font-bold text-slate-700">Or Image URL</label>
          <input
            type="url"
            value={form.imageUrl ?? ""}
            onChange={(event) => {
              set("imageUrl", event.target.value);
              if (event.target.value) {
                setImageFile(null);
              }
            }}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://example.com/image.jpg"
          />
          <p className="mt-1 text-xs text-slate-500">Upload a file or paste a direct image link.</p>
        </div>

        {getPreviewSrc() ? (
          <div className="mt-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Preview</div>
            <img
              src={getPreviewSrc()}
              alt="Marketplace item preview"
              className="h-48 w-full rounded-xl border border-slate-200 bg-white object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">Seller Name *</label>
          <input
            required
            value={form.sellerName ?? ""}
            onChange={(event) => set("sellerName", event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-bold text-slate-700">Contact Number *</label>
          <input
            required
            type="tel"
            value={form.sellerContact ?? ""}
            onChange={(event) => set("sellerContact", event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="07XXXXXXXX"
          />
          <p className="mt-1 text-xs text-slate-500">Sri Lankan format: 07XXXXXXXX, +947XXXXXXXX, or 947XXXXXXXX</p>
        </div>
      </div>

      <div className="pt-4">
        <button
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-lg font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {submitting ? "Processing..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
