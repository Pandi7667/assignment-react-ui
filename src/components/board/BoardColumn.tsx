"use client";
import React, { useMemo, useState } from "react";
import type { Task, TaskStatus } from "@/types";
import { STATUS_COLOR } from "@/lib/constants";
import { TaskCard } from "./TaskCard";
import { Grip, Plus } from "lucide-react";
import { useGetDashboard } from "@/controllers/common";

interface BoardColumnProps {
  status: TaskStatus;
  tasks: Task[];
  draggingId: string | null;
  onAddNew: (status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDrop: (status: TaskStatus) => void;
}

export function BoardColumn({
  status, tasks, draggingId,
  onAddNew, onEdit, onDelete, onMove,
  onDragStart, onDragEnd, onDrop,
}: BoardColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dot = STATUS_COLOR[status];

  const { GetDashboard } = useGetDashboard();
  // console.log('Dashboard Posts',GetDashboard);
  // Memoize dashboard processing
  const processedDashboard = useMemo(() => {
    console.log('Processing dashboard data...');

    // Only recompute when GetDashboard changes
    if (!GetDashboard) return null;

    // Example: Filter or transform data
    return GetDashboard.filter(post => post.userId === 1);
  }, [GetDashboard]);
  console.log('Dashboard Posts', processedDashboard);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => { onDrop(status); setIsDragOver(false); }}
      className={`flex flex-col flex-1 min-w-0 rounded-xl border
  transition-colors duration-150
  bg-board-surface border-board-border`}
      style={{
        borderColor: isDragOver ? dot : undefined
      }}
    >
      <div className="flex items-center justify-between px-3.5 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: dot }}
          />
          <span className="text-sm font-semibold text-text-primary">{status}</span>
          <span className="text-xs font-medium text-text-faint bg-board-surface border border-board-border rounded-full px-2 py-0.5">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddNew(status)}
          aria-label={`Add task to ${status}`}
          className="text-text-faint hover:text-text-secondary transition-colors text-lg leading-none p-1 rounded hover:bg-board-card focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 flex flex-col gap-2 px-2 pb-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-text-faint py-10 text-center">
            <Grip />
            <span className="text-xs leading-relaxed">
              No tasks here.<br />
            </span>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isDragging={draggingId === task.id}
              onEdit={onEdit}
              onDelete={onDelete}
              onMove={onMove}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
    </div>
  );
}
