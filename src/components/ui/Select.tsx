"use client";
import React from "react";
import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, id, className, ...rest }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          className={cn(
            "w-full rounded-md pl-3 pr-8 py-2 text-sm bg-board-input border appearance-none",
            "text-text-primary focus:outline-none focus:ring-1 transition-colors duration-150 cursor-pointer",
            error
              ? "border-priority-highText focus:ring-priority-highText"
              : "border-board-inputBorder focus:border-accent-indigo focus:ring-accent-indigo",
            className
          )}
          {...rest}
        >
          {options.map((o) => (
            <option key={o} value={o} className="bg-board-modal text-text-primary">
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-text-faint text-[10px]">
          ▼
        </span>
      </div>
      {error && (
        <span role="alert" className="text-xs text-priority-highText">
          {error}
        </span>
      )}
    </div>
  )
);
Select.displayName = "Select";
