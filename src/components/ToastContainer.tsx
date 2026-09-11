import React from 'react';
import { CheckCircle, Info, AlertCircle } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContainerProps {
  toasts: ToastMessage[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none w-full max-w-sm px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-[#111111] text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#2A2A2A] animate-slide-up pointer-events-auto"
        >
          <div className="w-5 h-5 rounded-full bg-[#FF494E]/20 text-[#FF494E] flex items-center justify-center flex-shrink-0">
            {toast.type === 'error' ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : toast.type === 'info' ? (
              <Info className="w-3.5 h-3.5" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5" />
            )}
          </div>
          <span className="leading-snug">{toast.text}</span>
        </div>
      ))}
    </div>
  );
};
