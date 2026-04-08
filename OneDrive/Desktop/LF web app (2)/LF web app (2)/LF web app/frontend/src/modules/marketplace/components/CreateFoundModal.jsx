import { useEffect, useState } from "react";
import Modal from "./Modal";
import { apiCreateFound } from "../api/found.api";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";

export default function CreateFoundModal({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
    location: "",
    date: "",
    time: "",
    userType: "student",
  });

  useEffect(() => {
    if (open) {
      const now = new Date();
      setForm((p) => ({
        ...p,
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
        userType: user?.userType || "student",
      }));
    }
  }, [open, user]);

  async function submit(e) {
    e.preventDefault();
    if (!user) return toast.push("Login required to create posts", "warning");

    setSaving(true);
    try {
      const foundDateISO = new Date(`${form.date}T${form.time || "00:00"}:00`).toISOString();
      await apiCreateFound({
        title: form.title,
        description: form.description,
        imageUrl: form.imageUrl || "",
        category: form.category,
        location: form.location,
        foundDateISO,
        userType: form.userType,
      });
      toast.push("✅ Submitted for admin approval", "success");
      onClose();
      onCreated?.();
    } catch (e2) {
      toast.push(e2?.response?.data?.message || "Failed to submit", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="➕ Report Found Item">
      <form className="space-y-3" onSubmit={submit}>
        <input
          className="input"
          placeholder="Item name *"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />

        <textarea
          className="input"
          rows={3}
          placeholder="Description *"
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          required
        />

        <input
          className="input"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            className="select"
            required
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
          >
            <option value="">Category *</option>
            <option value="electronics">📱 Electronics</option>
            <option value="documents">📄 Documents</option>
            <option value="accessories">👜 Accessories</option>
            <option value="clothing">👕 Clothing</option>
            <option value="keys">🔑 Keys</option>
            <option value="other">📦 Other</option>
          </select>

          <select
            className="select"
            value={form.userType}
            onChange={(e) => setForm((p) => ({ ...p, userType: e.target.value }))}
          >
            <option value="student">🎓 Student</option>
            <option value="staff">👔 Staff</option>
          </select>
        </div>

        <input
          className="input"
          placeholder="Found location *"
          value={form.location}
          onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
          required
        />

        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            className="input"
            required
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          />
          <input
            type="time"
            className="input"
            value={form.time}
            onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
          />
        </div>

        <button disabled={saving} className="btn-primary w-full py-3">
          {saving ? "Submitting..." : "Submit for Approval"}
        </button>
        <p className="text-xs text-slate-500 text-center">
          After admin approval, your post will appear in the feed.
        </p>
      </form>
    </Modal>
  );
}
