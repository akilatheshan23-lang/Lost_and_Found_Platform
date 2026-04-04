import { useEffect, useState } from "react";
import Modal from "./Modal";
import { apiUpdateSocial } from "../api/social.api";
import { useToast } from "./Toast";
import { fileToDataUrl } from "../utils/image";
import { hasValidationErrors, validateSocialPost } from "../utils/postValidation";

export default function EditSocialModal({ open, onClose, post, onSaved }) {
  const toast = useToast();

  const [saving, setSaving] = useState(false);
  const [imageMode, setImageMode] = useState("url");
  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    imageUrl: "",
    tagsText: "",
  });

  const [form, setForm] = useState({
    title: "",
    content: "",
    imageUrl: "",
    tagsText: "",
  });

  useEffect(() => {
    if (open && post) {
      setForm({
        title: post.title || "",
        content: post.content || "",
        imageUrl: post.imageUrl || "",
        tagsText: (post.tags || []).join(", "),
      });

      setErrors({
        title: "",
        content: "",
        imageUrl: "",
        tagsText: "",
      });

      if (post.imageData) {
        setImageMode("upload");
        setImagePreview(post.imageData);
      } else {
        setImageMode("url");
        setImagePreview("");
      }
    }
  }, [open, post]);

  async function onPickFile(file) {
    if (!file) return;

    try {
      const dataUrl = await fileToDataUrl(file);
      setImagePreview(dataUrl);
      toast.push("Image selected", "success");
    } catch (error) {
      setImagePreview("");
      toast.push(error?.message || "Invalid image", "error");
    }
  }

  function updateField(field, value) {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    const nextErrors = validateSocialPost(nextForm, {
      imageMode,
    });

    setErrors((prev) => ({
      ...prev,
      [field]: nextErrors[field] || "",
      imageUrl: field === "imageUrl" ? nextErrors.imageUrl : prev.imageUrl,
      tagsText: field === "tagsText" ? nextErrors.tagsText : prev.tagsText,
    }));
  }

  async function submit(e) {
    e.preventDefault();

    const nextErrors = validateSocialPost(form, {
      imageMode,
    });

    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      toast.push(
        nextErrors.title ||
          nextErrors.content ||
          nextErrors.imageUrl ||
          nextErrors.tagsText ||
          "Please fix the highlighted fields.",
        "warning"
      );
      return;
    }

    setSaving(true);

    try {
      const tags = form.tagsText
        ? form.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        title: form.title.trim(),
        content: form.content.trim(),
        tags,
        imageUrl: "",
        imageData: "",
      };

      if (imageMode === "url") {
        payload.imageUrl = form.imageUrl.trim();
      } else {
        payload.imageData = imagePreview || "";
      }

      await apiUpdateSocial(post._id, payload);

      toast.push("Post updated", "success");
      onClose?.();
      onSaved?.();
    } catch (error) {
      toast.push(error?.response?.data?.message || "Failed to update", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="✏️ Edit Post">
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <input
            className={`input ${errors.title ? "input-error" : ""}`}
            placeholder="Title *"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
          {errors.title ? <p className="field-error">{errors.title}</p> : null}
        </div>

        <div>
          <textarea
            className={`input min-h-[120px] ${errors.content ? "input-error" : ""}`}
            rows={5}
            placeholder="Content *"
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            required
          />
          {errors.content ? <p className="field-error">{errors.content}</p> : null}
        </div>

        <div className="premium-section p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-slate-900">📷 Post image</div>
              <div className="text-xs text-slate-500 mt-1">Switch between upload and image URL anytime.</div>
            </div>

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
                <div className="rounded-3xl overflow-hidden border border-white/60 shadow-inner">
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
                className={`input ${errors.imageUrl ? "input-error" : ""}`}
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => updateField("imageUrl", e.target.value)}
              />
              {errors.imageUrl ? <p className="field-error">{errors.imageUrl}</p> : null}

              {form.imageUrl ? (
                <div className="rounded-3xl overflow-hidden border border-white/60 shadow-inner">
                  <img src={form.imageUrl} alt="Preview" className="w-full max-h-[280px] object-cover" />
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div>
          <input
            className={`input ${errors.tagsText ? "input-error" : ""}`}
            placeholder="Tags (comma separated)"
            value={form.tagsText}
            onChange={(e) => updateField("tagsText", e.target.value)}
          />
          {errors.tagsText ? <p className="field-error">{errors.tagsText}</p> : null}
        </div>

        <button disabled={saving} className="btn-primary w-full py-3.5">
          {saving ? "Saving..." : "Save changes"}
        </button>
      </form>
    </Modal>
  );
}