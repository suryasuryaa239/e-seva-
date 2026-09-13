import React, { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Notification Container (Centered on Mobile, Bottom-Right on Desktop/System) */}
      <div className="fixed z-[100] flex flex-col gap-3 pointer-events-none transition-all duration-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[90vw] w-80 sm:top-auto sm:left-auto sm:bottom-6 sm:right-6 sm:translate-x-0 sm:translate-y-0 sm:max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-0 animate-in fade-in zoom-in-95 ${
              toast.type === 'success'
                ? 'bg-emerald-950 text-white border-emerald-600/80 shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-rose-950 text-white border-rose-600/80 shadow-rose-950/40'
                : 'bg-slate-950 text-white border-slate-700/80 shadow-slate-950/40'
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
              <span className="text-xs sm:text-sm font-semibold leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  return context || { addToast: () => {} };
};
