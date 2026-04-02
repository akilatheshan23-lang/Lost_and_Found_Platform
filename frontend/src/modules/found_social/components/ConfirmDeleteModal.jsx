import Modal from "./Modal";

export default function ConfirmDeleteModal({
  open,
  onClose,
  title = "Delete?",
  message,
  onConfirm,
  busy,
}) {
  return (
    <Modal open={open} onClose={onClose} title="⚠️ Confirm Delete" maxWidth="max-w-sm">
      <div className="space-y-4">
        <div className="text-slate-900 font-semibold">{title}</div>
        <div className="text-slate-600 text-sm">{message}</div>
        <div className="flex gap-2">
          <button className="btn-secondary flex-1" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button className="btn-danger flex-1" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
