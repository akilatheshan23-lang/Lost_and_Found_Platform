import React, { useEffect } from "react";

export default function Modal({ open, title, onClose, headerClassName = "bg-gradient-to-r from-blue-600 to-blue-700", children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose?.();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="modal-overlay absolute inset-0" onClick={onClose} />
      <div className="absolute inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg glass rounded-2xl shadow-2xl overflow-hidden">
        <div className={`${headerClassName} px-6 py-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">×</button>
          </div>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
