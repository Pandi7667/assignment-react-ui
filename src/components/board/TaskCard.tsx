"use client";
import React, { useState, useRef, useEffect } from "react";
import type { Task, TaskStatus } from "@/types";
import { STATUSES, STATUS_COLOR } from "@/lib/constants";
import { useRelativeTime } from "@/hooks/useRelativeTime";
import { PriorityBadge, TagBadge, Avatar } from "@/components/ui/Badge";
import { Grip, SquarePen, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  isDragging: boolean;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}

export function TaskCard({
  task, isDragging, onEdit, onDelete, onMove, onDragStart, onDragEnd,
}: TaskCardProps) {
  const relTime = useRelativeTime(task.updatedAt);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const otherStatuses = STATUSES.filter((s) => s !== task.status);

  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showMenu]);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      onDragEnd={onDragEnd}
      className={`rounded-lg border p-3.5 cursor-grab select-none transition-all duration-150 group
        ${isDragging
          ? "opacity-40 scale-95 border-board-borderHover bg-board-card"
          : "border-board-border bg-board-card hover:border-board-borderHover hover:bg-board-cardHover"
        }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1.5 text-sm font-semibold text-text-primary text-left hover:text-accent-indigo transition-colors leading-snug focus:outline-none focus-visible:underline"
        >
         <SquarePen className="w-4 h-4 text-accent-indigo" /> {task.title}
        </button>
        <PriorityBadge priority={task.priority} />
      </div>
      {task.description && (
        <p className="text-xs text-text-faint leading-relaxed mb-2 line-clamp-2">
          {task.description}
        </p>
      )}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.tags.map((t) => <TagBadge key={t} text={t} />)}
        </div>
      )}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <Avatar name={task.assignee} size={22} />
          <span className={`text-xs ${task.assignee ? "text-text-secondary" : "text-text-faint italic"}`}>
            {task.assignee || "Unassigned"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-[11px] text-text-faint">{relTime}</span>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              aria-label="Move task to another column"
              aria-expanded={showMenu}
              title="Move task"
              className="p-1 rounded text-text-faint hover:text-text-secondary hover:bg-board-surface transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
            >
              <Grip className="w-3 h-3" />
            </button>

            {showMenu && (
              <div className="absolute right-0 bottom-full mb-1 bg-board-modal border border-board-modalBorder rounded-lg py-1 z-20 min-w-[130px]"
                style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
              >
                {otherStatuses.map((s) => (
                  <button
                    key={s}
                    onClick={() => { onMove(task.id, s); setShowMenu(false); }}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-text-secondary hover:bg-board-card hover:text-text-primary transition-colors text-left"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: STATUS_COLOR[s] }}
                    />
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => onDelete(task.id)}
            aria-label={`Delete task: ${task.title}`}
            title="Delete task"
            className="p-1 rounded text-text-faint hover:text-red-400 hover:bg-board-surface transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          >
             <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
