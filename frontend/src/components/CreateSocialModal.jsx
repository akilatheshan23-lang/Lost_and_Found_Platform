import { useEffect, useState } from "react";
import Modal from "./Modal";
import { apiCreateSocial } from "../api/social.api";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";
import { fileToDataUrl } from "../utils/image";

export default function CreateSocialModal({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const [imageMode, setImageMode] = useState("upload"); // upload | url
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    postType: "",
    title: "",
    content: "",
    imageUrl: "",
    tagsText: "",
  });

  useEffect(() => {
    if (open) {
      setForm({ postType: "", title: "", content: "", imageUrl: "", tagsText: "" });
      setImageMode("upload");
      setImagePreview("");
    }
  }, [open]);

  async function onPickFile(f) {
    if (!f) return;
    try {
      const dataUrl = await fileToDataUrl(f);
      setImagePreview(dataUrl);
      toast.push("📷 Image selected", "success");
    } catch (e) {
      setImagePreview("");
      toast.push(e?.message || "Invalid image", "error");
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!user) return toast.push("Login required to create posts", "warning");

    setSaving(true);
    try {
      const tags = form.tagsText
        ? form.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        postType: form.postType,
        title: form.title,
        content: form.content,
        tags,
        imageUrl: "",
        imageData: "",
      };

      if (imageMode === "url") payload.imageUrl = form.imageUrl || "";
      else payload.imageData = imagePreview || "";

      await apiCreateSocial(payload);

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

        {/* Image chooser */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-slate-900">📷 Post image (optional)</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageMode("upload")}
                className={`pill ${imageMode === "upload" ? "pill-active" : "pill-idle"}`}
              >
                Upload
              </button>
              <button
                type="button"
                onClick={() => setImageMode("url")}
                className={`pill ${imageMode === "url" ? "pill-active" : "pill-idle"}`}
              >
                URL
              </button>
            </div>
          </div>

          {imageMode === "upload" ? (
            <div className="mt-3 space-y-2">
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={(e) => onPickFile(e.target.files?.[0])}
              />
              {imagePreview ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={imagePreview} alt="Preview" className="w-full max-h-[280px] object-cover" />
                </div>
              ) : (
                <div className="text-xs text-slate-500">Choose an image under 1.5MB.</div>
              )}
              {imagePreview ? (
                <button type="button" className="btn-secondary" onClick={() => setImagePreview("")}>
                  Remove image
                </button>
              ) : null}
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              <input
                className="input"
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
              />
              {form.imageUrl ? (
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={form.imageUrl} alt="Preview" className="w-full max-h-[280px] object-cover" />
                </div>
              ) : null}
            </div>
          )}
        </div>

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
