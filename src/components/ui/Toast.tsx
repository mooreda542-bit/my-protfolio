import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose, duration = 3500 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/80',
    error: 'border-rose-500/40 bg-rose-950/80',
    info: 'border-cyan-500/40 bg-cyan-950/80',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl text-slate-100 animate-bounce-in ${borders[type]}`}>
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

