import { useEffect, useState } from "react";
import Modal from "./Modal";
import { apiCreateSocial } from "../api/social.api";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";

export default function CreateSocialModal({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    postType: "",
    title: "",
    content: "",
    imageUrl: "",
    tagsText: "",
  });

  useEffect(() => {
    if (open) setForm({ postType: "", title: "", content: "", imageUrl: "", tagsText: "" });
  }, [open]);

  async function submit(e) {
    e.preventDefault();
    if (!user) return toast.push("Login required to create posts", "warning");

    setSaving(true);
    try {
      const tags = form.tagsText
        ? form.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      await apiCreateSocial({
        postType: form.postType,
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl || "",
        tags,
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
    <Modal open={open} onClose={onClose} title="📝 Create New Post">
      <form className="space-y-3" onSubmit={submit}>
        <select
          className="select"
          required
          value={form.postType}
          onChange={(e) => setForm((p) => ({ ...p, postType: e.target.value }))}
        >
          <option value="">Select post type *</option>
          <option value="announcement">📢 Announcement</option>
          <option value="event">🎉 Event</option>
          <option value="update">📌 Update</option>
          <option value="general">💬 General</option>
        </select>

        <input
          className="input"
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />

        <textarea
          className="input"
          rows={4}
          placeholder="Content *"
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          required
        />

        <input
          className="input"
          placeholder="Image URL (optional)"
          value={form.imageUrl}
          onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
        />

        <input
          className="input"
          placeholder="Tags (comma separated) e.g. exam, important"
          value={form.tagsText}
          onChange={(e) => setForm((p) => ({ ...p, tagsText: e.target.value }))}
        />

        <button disabled={saving} className="btn-success w-full py-3">
          {saving ? "Submitting..." : "Submit for Approval"}
        </button>
        <p className="text-xs text-slate-500 text-center">
          After admin approval, your post will appear in the feed.
        </p>
      </form>
    </Modal>
  );
}
