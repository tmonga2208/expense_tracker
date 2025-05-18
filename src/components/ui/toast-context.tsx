import React, { createContext, useState } from 'react';
import { Toast } from './toast';

type ToastType = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

type ToastContextType = {
  toast: (props: ToastType) => void;
  toasts: ToastType[];
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = ({ title, description, variant = 'default' }: ToastType) => {
    const newToast = { title, description, variant };
    setToasts(prev => [...prev, newToast]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== newToast));
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => {
            setToasts(prev => prev.filter((_, i) => i !== index));
          }}
        />
      ))}
    </ToastContext.Provider>
  );
} 