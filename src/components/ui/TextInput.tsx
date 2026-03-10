"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, required, id, className, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-text-secondary">
          {label}
          {required && <span className="text-priority-highText ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-md px-3 py-2 text-sm bg-board-input border",
          "text-text-primary placeholder:text-text-faint",
          "focus:outline-none focus:ring-1 transition-colors duration-150",
          error
            ? "border-priority-highText focus:ring-priority-highText"
            : "border-board-inputBorder focus:border-accent-indigo focus:ring-accent-indigo",
          className
        )}
        {...rest}
      />
      {error && (
        <span role="alert" className="text-xs text-priority-highText">
          {error}
        </span>
      )}
    </div>
  )
);
TextInput.displayName = "TextInput";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, id, className, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-md px-3 py-2 text-sm bg-board-input border resize-y min-h-[96px]",
          "text-text-primary placeholder:text-text-faint font-sans",
          "focus:outline-none focus:ring-1 transition-colors duration-150",
          error
            ? "border-priority-highText focus:ring-priority-highText"
            : "border-board-inputBorder focus:border-accent-indigo focus:ring-accent-indigo",
          className
        )}
        {...rest}
      />
      {error && (
        <span role="alert" className="text-xs text-priority-highText">
          {error}
        </span>
      )}
    </div>
  )
);
TextArea.displayName = "TextArea";
