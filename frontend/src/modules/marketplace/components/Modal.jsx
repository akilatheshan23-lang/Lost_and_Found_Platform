export default function Modal({ open, onClose, title, children, maxWidth = "max-w-lg" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} card-solid p-5 max-h-[90vh] overflow-auto shadow-xl`}>
        <div className="flex items-center justify-between mb-4">
          <div className="font-bold text-lg text-slate-900">{title}</div>
          <button onClick={onClose} className="btn-secondary px-3" aria-label="Close">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
