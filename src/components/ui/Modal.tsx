"use client";
import { CircleX } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus first focusable element when opened
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      const el = dialogRef.current?.querySelector<HTMLElement>(
        'input, textarea, select, button:not([aria-label="Close modal"])'
      );
      el?.focus();
    }, 60);
    return () => clearTimeout(timer);
  }, [open]);

  // Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const content = (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)" }}
    >
      <div
        ref={dialogRef}
        className="bg-board-modal border border-board-modalBorder rounded-xl w-full max-w-[540px] max-h-[90vh] flex flex-col animate-fadeIn"
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-board-modalBorder shrink-0">
          <h2 id="modal-title" className="text-base font-semibold text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-text-muted hover:text-text-primary transition-colors text-xl leading-none p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo"
          >
           <CircleX style={{ color:"#F98080" }} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined"
    ? createPortal(content, document.body)
    : null;
}
