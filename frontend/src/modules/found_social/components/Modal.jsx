export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-md" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} card-solid premium-glow max-h-[90vh] overflow-auto border-white/90 bg-white/92 p-5`}>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-lg font-bold text-slate-900">{title}</div>
            <div className="text-xs text-slate-500">Complete the form and submit for review.</div>
          </div>
          <button onClick={onClose} className="btn-secondary px-3" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
