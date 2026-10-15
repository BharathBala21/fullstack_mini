import React from 'react';
import { useUser } from '../context/UserContext';
import { X } from 'lucide-react';

const Toast = () => {
  const { toasts, removeToast } = useUser();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-xs w-full pointer-events-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg shadow-md text-xs font-medium border transition ${
              isError
                ? 'bg-rose-900 text-white border-rose-800'
                : 'bg-stone-900 text-white border-stone-800'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white transition"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
