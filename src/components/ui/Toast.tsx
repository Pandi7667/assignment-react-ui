"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ToastItem } from "@/types";

interface ToastProps {
  toasts: ToastItem[];
  onRemove: (id: number) => void;
}

const TOAST_STYLES: Record<ToastItem["type"], string> = {
  info:    "bg-[#1e3a5f] border-blue-500/60 text-blue-100",
  success: "bg-[#14532d] border-green-500/60 text-green-100",
  warning: "bg-[#78350f] border-amber-500/60 text-amber-100",
  error:   "bg-[#7f1d1d] border-red-500/60 text-red-100",
};

function ToastItem({ toast, onRemove }: { toast: ToastItem; onRemove: () => void }) {
  useEffect(() => {
    const t = setTimeout(onRemove, 4000);
    return () => clearTimeout(t);
  }, [onRemove]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-center gap-3 min-w-[260px] max-w-[360px] px-4 py-2.5 rounded-lg border text-sm animate-slideIn ${TOAST_STYLES[toast.type]}`}
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onRemove}
        aria-label="Dismiss notification"
        className="text-current/60 hover:text-current transition-colors text-lg leading-none shrink-0"
      >
        ×
      </button>
    </div>
  );
}

export function Toast({ toasts, onRemove }: ToastProps) {
  if (typeof window === "undefined") return null;
  return createPortal(
    <div
      aria-label="Notifications"
      className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => onRemove(t.id)} />
      ))}
    </div>,
    document.body
  );
}
