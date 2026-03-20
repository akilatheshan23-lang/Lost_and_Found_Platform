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
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((t) => (
          <div key={t.id} className={`px-4 py-3 rounded-xl text-white shadow post-card ${
            t.type === "success" ? "bg-green-600" :
            t.type === "error" ? "bg-red-600" :
            t.type === "warning" ? "bg-amber-500" : "bg-blue-600"
          }`}>
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
