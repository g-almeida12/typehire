"use client";

import { ToastContainer } from "@/components/common/ToastContainer";
import { createContext, useCallback, useContext, useState } from "react";

export type ToastStatus = "success" | "error" | "info";
export type Toast = {
  id: string;
  status: ToastStatus;
  message: string;
};

const ToastContext = createContext<{
  toasts: Toast[];
  showToast: (status: ToastStatus, message: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((status: ToastStatus, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, status, message }]);

    setTimeout(() => removeToast(id), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast }}>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw Error("'useToast' hook must be used inside a Toast Provider only.");
  }

  return context;
}
