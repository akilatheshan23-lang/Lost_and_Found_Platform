import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ open: false, message: "", icon: "✓" });

  const showToast = useCallback((message, icon = "✓") => {
    setToast({ open: true, message, icon });
    window.clearTimeout(window.__toastTimer);
    window.__toastTimer = window.setTimeout(() => {
      setToast((t) => ({ ...t, open: false }));
    }, 3000);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast.open && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="glass rounded-xl px-6 py-4 shadow-2xl border border-slate-200 flex items-center gap-3 max-w-sm">
            <span className="text-2xl">{toast.icon}</span>
            <p className="text-slate-700 font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
