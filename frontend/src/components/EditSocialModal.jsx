import { useEffect, useState } from "react";
import Modal from "./Modal";
import { apiUpdateSocial } from "../api/social.api";
import { useToast } from "./Toast";
import { fileToDataUrl } from "../utils/image";

export default function EditSocialModal({ open, onClose, post, onSaved }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const [imageMode, setImageMode] = useState("url"); // upload | url
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({ title: "", content: "", imageUrl: "", tagsText: "" });

  useEffect(() => {
    if (open && post) {
      setForm({
        title: post.title || "",
        content: post.content || "",
        imageUrl: post.imageUrl || "",
        tagsText: (post.tags || []).join(", "),
      });
      // If post already has imageData, show it as preview by default
      if (post.imageData) {
        setImageMode("upload");
        setImagePreview(post.imageData);
      } else {
        setImageMode("url");
        setImagePreview("");
      }
    }
  }, [open, post]);

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
    setSaving(true);
    try {
      const tags = form.tagsText
        ? form.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title: form.title,
        content: form.content,
        tags,
      };

      if (imageMode === "url") {
        payload.imageUrl = form.imageUrl || "";
        payload.imageData = ""; // clear imageData if switching to url
      } else {
        payload.imageData = imagePreview || "";
        payload.imageUrl = ""; // clear url if using upload
      }

      await apiUpdateSocial(post._id, payload);
      toast.push("✅ Post updated", "success");
      onClose();
      onSaved?.();
    } catch (e2) {
      toast.push(e2?.response?.data?.message || "Failed to update", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="✏️ Edit Post">
      <form className="space-y-3" onSubmit={submit}>
        <input
          className="input"
          placeholder="Title *"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          required
        />

        <textarea
          className="input"
          rows={5}
          placeholder="Content *"
          value={form.content}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          required
        />

        {/* Image chooser */}
        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="font-semibold text-slate-900">📷 Post image</div>
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
              <input type="file" accept="image/*" className="input" onChange={(e) => onPickFile(e.target.files?.[0])} />
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
          placeholder="Tags (comma separated)"
          value={form.tagsText}
          onChange={(e) => setForm((p) => ({ ...p, tagsText: e.target.value }))}
        />

        <button disabled={saving} className="btn-primary w-full py-3">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </Modal>
  );
}
