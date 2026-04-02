import React, { useState } from "react";

const categories = ["Electronics", "Documents", "Accessories", "Clothing", "Books", "Other"];

export default function CreateLostItem({ onSubmit }) {
  const [useUpload, setUseUpload] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    itemName: "",
    imageUrl: "",
    userType: "",
    category: "",
    location: "",
    venue: "",
    date: "",
    time: "",
    userName: "",
    userEmail: "",
    userPhone: "",
  });

  const [imageFile, setImageFile] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (useUpload && imageFile) {
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        fd.append("image", imageFile);
        await onSubmit(fd);
      } else {
        await onSubmit(form);
      }

      setForm({
        itemName: "",
        imageUrl: "",
        userType: "",
        category: "",
        location: "",
        venue: "",
        date: "",
        time: "",
        userName: "",
        userEmail: "",
        userPhone: "",
      });
      setImageFile(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-slate-700 font-medium mb-1">Item Name *</label>
        <input
          required
          value={form.itemName}
          onChange={(e) => set("itemName", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., Blue Backpack"
        />
      </div>

      <div className="flex items-center gap-3">
        <input id="uploadToggle" type="checkbox" checked={useUpload} onChange={(e) => setUseUpload(e.target.checked)} />
        <label htmlFor="uploadToggle" className="text-sm text-slate-700">
          Upload an image (instead of URL)
        </label>
      </div>

      {useUpload ? (
        <div>
          <label className="block text-slate-700 font-medium mb-1">Image File</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          <p className="text-xs text-slate-500 mt-1">Max 5MB. JPG/PNG/WebP/GIF.</p>
        </div>
      ) : (
        <div>
          <label className="block text-slate-700 font-medium mb-1">Image URL</label>
          <input
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-700 font-medium mb-1">User Type *</label>
          <select
            required
            value={form.userType}
            onChange={(e) => set("userType", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select...</option>
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1">Category *</label>
          <select
            required
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select...</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-slate-700 font-medium mb-1">Location Lost *</label>
        <input
          required
          value={form.location}
          onChange={(e) => set("location", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., Library 2nd Floor"
        />
      </div>

      <div>
        <label className="block text-slate-700 font-medium mb-1">Venue *</label>
        <input
          required
          value={form.venue}
          onChange={(e) => set("venue", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g., Main Campus"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-slate-700 font-medium mb-1">Date *</label>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => set("date", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-slate-700 font-medium mb-1">Time *</label>
          <input
            required
            type="time"
            value={form.time}
            onChange={(e) => set("time", e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-slate-700 font-medium mb-1">Your Name *</label>
        <input
          required
          value={form.userName}
          onChange={(e) => set("userName", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block text-slate-700 font-medium mb-1">Email *</label>
        <input
          required
          type="email"
          value={form.userEmail}
          onChange={(e) => set("userEmail", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-slate-700 font-medium mb-1">Phone</label>
        <input
          value={form.userPhone}
          onChange={(e) => set("userPhone", e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="+94 XX XXX XXXX"
        />
      </div>

      <button disabled={submitting} className="w-full btn-primary text-white py-3 rounded-xl font-semibold">
        {submitting ? "Submitting..." : "Submit Report"}
      </button>
    </form>
  );
}

export { categories };
