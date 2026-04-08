import { useEffect, useState } from "react";
import Modal from "./Modal";
import { apiUpdateSocial } from "../api/social.api";
import { useToast } from "./Toast";

export default function EditSocialModal({ open, onClose, post, onSaved }) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", imageUrl: "", tagsText: "" });

  useEffect(() => {
    if (open && post) {
      setForm({
        title: post.title || "",
        content: post.content || "",
        imageUrl: post.imageUrl || "",
        tagsText: (post.tags || []).join(", "),
      });
    }
  }, [open, post]);

  async function submit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const tags = form.tagsText
        ? form.tagsText.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
      await apiUpdateSocial(post._id, {
        title: form.title,
        content: form.content,
        imageUrl: form.imageUrl,
        tags,
      });
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

        <input
          className="input"
          placeholder="Image URL"
          value={form.imageUrl}
          onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
        />

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
