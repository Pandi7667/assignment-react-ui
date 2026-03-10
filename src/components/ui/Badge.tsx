"use client";
import React from "react";
import type { TaskPriority } from "@/types";
import { PRIORITY_CONFIG } from "@/lib/constants";

interface TagBadgeProps {
  text: string;
  onRemove?: () => void;
}

export function TagBadge({ text, onRemove }: TagBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 bg-board-surface text-text-muted border border-board-inputBorder rounded px-1.5 py-0.5 text-[11px] font-mono">
      #{text}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove tag ${text}`}
          className="text-text-faint hover:text-text-secondary transition-colors ml-0.5 leading-none"
        >
          ×
        </button>
      )}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const c = PRIORITY_CONFIG[priority];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {priority}
    </span>
  );
}

const AVATAR_COLORS = [
  "#6366f1","#ec4899","#f59e0b","#10b981","#3b82f6","#8b5cf6","#06b6d4",
];

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 24 }: AvatarProps) {
  const initial = name ? name[0].toUpperCase() : "?";
  const color = name
    ? AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length]
    : "#475569";
  return (
    <span
      aria-label={name || "Unassigned"}
      className="inline-flex items-center justify-center rounded-full text-white font-bold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.45 }}
    >
      {initial}
    </span>
  );
}
