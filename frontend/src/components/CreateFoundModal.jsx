import { useEffect, useState } from "react";
import Modal from "./Modal";
import { apiCreateFound } from "../api/found.api";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "./Toast";
import { fileToDataUrl } from "../utils/image";
import {
  getTodayDateString,
  hasValidationErrors,
  validateFoundPost,
} from "../utils/postValidation";

export default function CreateFoundModal({ open, onClose, onCreated }) {
  const { user } = useAuth();
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({ title: "", description: "", date: "" });

  const [imageMode, setImageMode] = useState("upload"); // upload | url
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const maxFoundDate = getTodayDateString();

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
        title: "",
        description: "",
        imageUrl: "",
        category: "",
        location: "",
        date: maxFoundDate,
        time: now.toTimeString().slice(0, 5),
        userType: user?.userType || "student",
      }));
      setErrors({ title: "", description: "", date: "" });
      setImageMode("upload");
      setImageFile(null);
      setImagePreview("");
    }
  }, [open, user, maxFoundDate]);

  async function onPickFile(f) {
    if (!f) return;
    try {
      const dataUrl = await fileToDataUrl(f);
      setImageFile(f);
      setImagePreview(dataUrl);
      toast.push("📷 Image selected", "success");
    } catch (e) {
      setImageFile(null);
      setImagePreview("");
      toast.push(e?.message || "Invalid image", "error");
    }
  }

  function updateField(field, value) {
    const nextForm = { ...form, [field]: value };
    setForm(nextForm);

    if (field === "title" || field === "description" || field === "date") {
      setErrors(validateFoundPost(nextForm));
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!user) return toast.push("Login required to create posts", "warning");

    const nextErrors = validateFoundPost(form);
    setErrors(nextErrors);
    if (hasValidationErrors(nextErrors)) {
      toast.push(
        nextErrors.title || nextErrors.description || nextErrors.date || "Please fix the highlighted fields.",
        "warning"
      );
      return;
    }

    setSaving(true);
    try {
      const foundDateISO = new Date(`${form.date}T${form.time || "00:00"}:00`).toISOString();

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        foundDateISO,
        foundDateLocal: form.date,
        userType: form.userType,
        imageUrl: "",
        imageData: "",
      };

      if (imageMode === "url") {
        payload.imageUrl = form.imageUrl || "";
      } else {
        payload.imageData = imagePreview || "";
      }

      await apiCreateFound(payload);
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
      <form className="space-y-4" onSubmit={submit}>
        <div>
          <input
            className={`input ${errors.title ? "input-error" : ""}`}
            placeholder="Item name *"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
          />
          {errors.title ? <p className="field-error">{errors.title}</p> : null}
        </div>

        <div>
          <textarea
            className={`input min-h-[110px] ${errors.description ? "input-error" : ""}`}
            rows={3}
            placeholder="Description *"
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
          />
          {errors.description ? <p className="field-error">{errors.description}</p> : null}
        </div>

        <div className="premium-section p-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-slate-900">📷 Item photo (optional)</div>
              <div className="text-xs text-slate-500 mt-1">Use upload or paste an image URL.</div>
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
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview("");
                  }}
                >
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
                <div className="rounded-3xl overflow-hidden border border-white/60 shadow-inner">
                  <img src={form.imageUrl} alt="Preview" className="w-full max-h-[280px] object-cover" />
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
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

        <div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="date"
              className={`input ${errors.date ? "input-error" : ""}`}
              required
              value={form.date}
              max={maxFoundDate}
              onChange={(e) => updateField("date", e.target.value)}
            />
            <input
              type="time"
              className="input"
              value={form.time}
              onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
            />
          </div>
          {errors.date ? <p className="field-error mt-2">{errors.date}</p> : null}
          <p className="text-xs text-slate-500 mt-2">
            Only today and past dates can be selected for the found date.
          </p>
        </div>

        <button disabled={saving} className="btn-primary w-full py-3.5">
          {saving ? "Submitting..." : "Submit for Approval"}
        </button>
        <p className="text-xs text-slate-500 text-center">
          After admin approval, your post will appear in the feed.
        </p>
      </form>
    </Modal>
  );
}
