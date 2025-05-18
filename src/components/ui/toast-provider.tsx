import React from 'react';
import { Toast } from './toast';
import { useToast } from './use-toast';

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { toasts } = useToast();

  return (
    <>
      {children}
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          title={toast.title}
          description={toast.description}
          variant={toast.variant}
          onClose={() => {
            // Toast will auto-remove after 3 seconds
          }}
        />
      ))}
    </>
  );
} 