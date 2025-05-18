import React from 'react';
import { X } from 'lucide-react';

type ToastProps = {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
  onClose: () => void;
};

export function Toast({ title, description, variant = 'default', onClose }: ToastProps) {
  const baseStyles = "fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md";
  const variantStyles = {
    default: "bg-white text-gray-900",
    destructive: "bg-red-500 text-white"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm mt-1">{description}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-500 hover:text-gray-700"
          aria-label="Close notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
