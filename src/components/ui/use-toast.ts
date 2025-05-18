import { useState } from 'react';

type ToastType = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const toast = ({ title, description, variant = 'default' }: ToastType) => {
    const newToast = { title, description, variant };
    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t !== newToast));
    }, 3000);
  };

  return { toast, toasts };
} 