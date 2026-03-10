"use client";
import React from "react";
import type { 
  // TaskPriority, 
  SortOption } from "@/types";
import { PRIORITIES, SORT_OPTIONS, PRIORITY_CONFIG } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearch,
  togglePriority,
  setSortBy,
  // clearFilters,
  selectSearch_,
  selectPriorities_,
  selectSortBy_,
} from "@/redux/board/boardSlice";

export function FilterBar() {
  const dispatch = useAppDispatch();
  const search = useAppSelector(selectSearch_);
  const priorities = useAppSelector(selectPriorities_);
  const sortBy = useAppSelector(selectSortBy_);

  return (
    <div className="flex items-center gap-4 flex-wrap bg-board-surface border border-board-border rounded-xl px-4 py-2.5">
      <div className="flex items-center gap-2 bg-board-input border border-board-inputBorder/60 rounded-lg px-3 py-1.5 flex-1 min-w-[140px]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          placeholder="Search tasks..."
          aria-label="Search tasks by title, description or tag"
          className="bg-transparent border-none outline-none text-sm text-text-primary placeholder:text-text-faint flex-1 min-w-0"
        />
        {search && (
          <button
            onClick={() => dispatch(setSearch(""))}
            aria-label="Clear search"
            className="text-text-faint hover:text-text-secondary transition-colors text-base leading-none"
          >
            ×
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-semibold text-text-faint tracking-wider">
          PRIORITY
        </span>
        {PRIORITIES.map((p) => {
          const c = PRIORITY_CONFIG[p];
          const active = priorities.includes(p);
          return (
            <button
              key={p}
              onClick={() => dispatch(togglePriority(p))}
              aria-pressed={active}
              className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-indigo"
              style={{
                background: active ? "#ffffff" : "transparent",
                borderColor: active ? c.dot : "#2d3748",
                color: active ? c.text : "#64748b",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: c.dot }}
              />
              {p}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2 ml-auto shrink-0">
        <span className="text-[11px] font-semibold text-text-faint tracking-wider">
          SORT
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => dispatch(setSortBy(e.target.value as SortOption))}
            aria-label="Sort tasks"
            className="bg-board-input border border-board-inputBorder rounded-md pl-3 pr-7 py-1.5 text-sm
              text-text-primary appearance-none cursor-pointer
              focus:outline-none focus:ring-1 focus:ring-accent-indigo focus:border-accent-indigo transition-colors"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o} value={o} className="bg-board-modal">
                {o}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-text-faint text-[10px]">
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}
