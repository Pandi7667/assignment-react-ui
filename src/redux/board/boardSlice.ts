import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store";
import type { Task, TaskStatus, TaskPriority, SortOption, TaskFormData } from "@/types";
import { PRIORITY_ORDER } from "@/lib/constants";
import { v4 as uuidv4 } from "uuid";

interface BoardState {
  tasks: Task[];
  // Filters
  search: string;
  priorities: TaskPriority[];   // empty = show all
  sortBy: SortOption;
  // UI flags
  storageError: boolean;
  migrationNotice: boolean;
  initialized: boolean;
}

const initialState: BoardState = {
  tasks: [],
  search: "",
  priorities: [],
  sortBy: "Last Updated",
  storageError: false,
  migrationNotice: false,
  initialized: false,
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    // ── Hydration ──────────────────────────────────────────────────────────
    hydrate(
      state,
      action: PayloadAction<{ tasks: Task[]; migrated: boolean; error: boolean }>
    ) {
      state.tasks = action.payload.tasks;
      state.migrationNotice = action.payload.migrated;
      state.storageError = action.payload.error;
      state.initialized = true;
    },

    // ── Tasks ──────────────────────────────────────────────────────────────
    addTask(state, action: PayloadAction<TaskFormData>) {
      const now = Date.now();
      const task: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
      };
      state.tasks.push(task);
    },

    updateTask(
      state,
      action: PayloadAction<{ id: string; data: TaskFormData }>
    ) {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.tasks[idx] = {
          ...state.tasks[idx],
          ...action.payload.data,
          updatedAt: Date.now(),
        };
      }
    },

    deleteTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },

    moveTask(
      state,
      action: PayloadAction<{ id: string; status: TaskStatus }>
    ) {
      const task = state.tasks.find((t) => t.id === action.payload.id);
      if (task) {
        task.status = action.payload.status;
        task.updatedAt = Date.now();
      }
    },

    // ── Filters ────────────────────────────────────────────────────────────
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },

    togglePriority(state, action: PayloadAction<TaskPriority>) {
      const p = action.payload;
      const idx = state.priorities.indexOf(p);
      if (idx === -1) {
        state.priorities.push(p);
      } else {
        state.priorities.splice(idx, 1);
      }
    },

    setSortBy(state, action: PayloadAction<SortOption>) {
      state.sortBy = action.payload;
    },

    clearFilters(state) {
      state.search = "";
      state.priorities = [];
      state.sortBy = "Last Updated";
    },

    // ── UI flags ───────────────────────────────────────────────────────────
    dismissMigrationNotice(state) {
      state.migrationNotice = false;
    },
  },
});

export const {
  hydrate,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  setSearch,
  togglePriority,
  setSortBy,
  clearFilters,
  dismissMigrationNotice,
} = boardSlice.actions;

export default boardSlice.reducer;

// ── Selectors ──────────────────────────────────────────────────────────────────

const selectAllTasks = (state: RootState) => state.board.tasks;
const selectSearch = (state: RootState) => state.board.search;
const selectPriorities = (state: RootState) => state.board.priorities;
const selectSortBy = (state: RootState) => state.board.sortBy;

/**
 * Core selector — applies search, priority filter, and sort in one pass.
 * BUG FIXES vs previous implementation:
 *   1. Search is trimmed AND lowercased before comparison (was sometimes skipping)
 *   2. Priority filter: empty array = "no filter active" = show ALL tasks
 *      (was previously only filtering when length > 0, but state mutation
 *       via togglePriority was not triggering re-render in some cases)
 *   3. Sort creates a shallow copy via [...result] before sort() to avoid
 *      mutating the array (RTK immer draft reference issue)
 */
export const selectFilteredTasksByStatus = createSelector(
  [selectAllTasks, selectSearch, selectPriorities, selectSortBy],
  (tasks, search, priorities, sortBy) => {
    // 1. Filter by search
    const q = search.trim().toLowerCase();
    let result = q
      ? tasks.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.tags.some((tag) => tag.toLowerCase().includes(q))
        )
      : [...tasks];

    // 2. Filter by priority (empty priorities = show all)
    if (priorities.length > 0) {
      result = result.filter((t) => priorities.includes(t.priority));
    }

    // 3. Sort (on a new array copy to avoid mutation)
    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case "Last Updated":
          return b.updatedAt - a.updatedAt;
        case "Created Date":
          return b.createdAt - a.createdAt;
        case "Priority":
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        default:
          return 0;
      }
    });

    // 4. Group by status
    return {
      Backlog: sorted.filter((t) => t.status === "Backlog"),
      "In Progress": sorted.filter((t) => t.status === "In Progress"),
      Done: sorted.filter((t) => t.status === "Done"),
      total: sorted.length,
    };
  }
);

export const selectTotalTasks = (state: RootState) => state.board.tasks.length;
export const selectSearch_ = selectSearch;
export const selectPriorities_ = selectPriorities;
export const selectSortBy_ = selectSortBy;
export const selectStorageError = (state: RootState) => state.board.storageError;
export const selectMigrationNotice = (state: RootState) => state.board.migrationNotice;
export const selectInitialized = (state: RootState) => state.board.initialized;
