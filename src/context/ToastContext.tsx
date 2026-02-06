import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Track recent toasts to prevent duplicates (stores toast keys with timestamps)
  const recentToastsRef = useRef<Map<string, number>>(new Map());
  const DUPLICATE_THRESHOLD_MS = 1000; // Prevent same toast within 1 second

  const addToast = useCallback((type: ToastType, title: string, message?: string) => {
    // Create a key to identify duplicate toasts
    const toastKey = `${type}-${title}-${message || ''}`;
    const now = Date.now();
    const lastShown = recentToastsRef.current.get(toastKey);
    
    // Prevent duplicate toasts within the threshold
    if (lastShown && now - lastShown < DUPLICATE_THRESHOLD_MS) {
      return; // Skip this duplicate toast
    }
    
    // Record this toast
    recentToastsRef.current.set(toastKey, now);
    
    // Clean up old entries (older than 5 seconds)
    recentToastsRef.current.forEach((timestamp, key) => {
      if (now - timestamp > 5000) {
        recentToastsRef.current.delete(key);
      }
    });
    
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const borderColors = {
    success: 'border-green-500/20',
    error: 'border-red-500/20',
    warning: 'border-orange-500/20',
    info: 'border-blue-500/20'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      layout
      className={`pointer-events-auto min-w-[300px] max-w-md bg-neutral-900/90 backdrop-blur-md border ${borderColors[toast.type]} rounded-xl shadow-2xl p-4 flex items-start gap-3`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1">
        <h4 className="text-white font-semibold text-sm">{toast.title}</h4>
        {toast.message && <p className="text-gray-400 text-xs mt-1">{toast.message}</p>}
      </div>
      <button 
        onClick={() => onDismiss(toast.id)}
        className="text-gray-500 hover:text-white transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
