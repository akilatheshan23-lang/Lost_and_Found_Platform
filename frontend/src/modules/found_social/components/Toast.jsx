import { createContext, useContext, useMemo, useState } from "react";

const ToastCtx = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function push(message, type = "info") {
    const id = crypto.randomUUID();
    setToasts((t) => [{ id, message, type }, ...t]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 2600);
  }

  const value = useMemo(() => ({ push }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed right-4 top-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`post-card min-w-[240px] max-w-sm rounded-2xl border px-4 py-3 text-white shadow-2xl backdrop-blur-xl ${
              t.type === "success"
                ? "border-emerald-300/20 bg-emerald-600/95"
                : t.type === "error"
                  ? "border-rose-300/20 bg-rose-600/95"
                  : t.type === "warning"
                    ? "border-amber-300/20 bg-amber-500/95"
                    : "border-sky-300/20 bg-sky-600/95"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  return useContext(ToastCtx);
}
