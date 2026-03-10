"use client";
import React, { useState, useCallback, useEffect } from "react";
import type { Task, TaskStatus, TaskFormData } from "@/types";
import { STATUSES } from "@/lib/constants";
import { loadTasks, saveTasks } from "@/lib/storage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  hydrate,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  clearFilters,
  dismissMigrationNotice,
  selectFilteredTasksByStatus,
  selectTotalTasks,
  selectSearch_,
  selectPriorities_,
  selectStorageError,
  selectMigrationNotice,
  selectInitialized,
} from "@/redux/board/boardSlice";
import { FilterBar } from "@/components/board/FilterBar";
import { BoardColumn } from "@/components/board/BoardColumn";
import { TaskForm } from "@/components/board/TaskForm";
import { ConfirmDialog } from "@/components/board/ConfirmDialog";
import { Modal } from "@/components/ui/Modal";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/hooks/useToast";
import { LayoutGrid, Plus } from "lucide-react";

interface ModalState {
  open: boolean;
  mode: "create" | "edit";
  task: Task | null;
  defaultStatus: TaskStatus;
}

interface DeleteState {
  open: boolean;
  taskId: string;
  taskTitle: string;
}

const INITIAL_MODAL: ModalState = {
  open: false,
  mode: "create",
  task: null,
  defaultStatus: "Backlog",
};

const INITIAL_DELETE: DeleteState = {
  open: false,
  taskId: "",
  taskTitle: "",
};

export function BoardPage() {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector(selectInitialized);
  const tasksByStatus = useAppSelector(selectFilteredTasksByStatus);
  const totalTasks = useAppSelector(selectTotalTasks);
  const search = useAppSelector(selectSearch_);
  const priorities = useAppSelector(selectPriorities_);
  const storageError = useAppSelector(selectStorageError);
  const migrationNotice = useAppSelector(selectMigrationNotice);
  const { toasts, addToast, removeToast } = useToast();

  const [modal, setModal] = useState<ModalState>(INITIAL_MODAL);
  const [deleteState, setDeleteState] = useState<DeleteState>(INITIAL_DELETE);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // ── Hydrate from localStorage on mount ──────────────────────────────────
  useEffect(() => {
    if (!initialized) {
      const result = loadTasks();
      dispatch(hydrate(result));
    }
  }, [dispatch, initialized]);

  // ── Persist to localStorage whenever tasks change ───────────────────────
  // We pull tasks directly from the selector; saveTasks is idempotent
  const allTasks = useAppSelector((s) => s.board.tasks);
  useEffect(() => {
    if (initialized) {
      saveTasks(allTasks);
    }
  }, [allTasks, initialized]);

  // ── Migration notice toast ───────────────────────────────────────────────
  useEffect(() => {
    if (migrationNotice) {
      addToast("✦ Data migrated to latest schema", "info");
      dispatch(dismissMigrationNotice());
    }
  }, [migrationNotice, addToast, dispatch]);

  // ── Storage error toast ─────────────────────────────────────────────────
  useEffect(() => {
    if (storageError) {
      addToast("Storage unavailable — changes won't persist", "error");
    }
  }, [storageError, addToast]);

  // ── Modal helpers ────────────────────────────────────────────────────────
  const openCreate = useCallback((status: TaskStatus = "Backlog") => {
    setModal({ open: true, mode: "create", task: null, defaultStatus: status });
  }, []);

  const openEdit = useCallback((task: Task) => {
    setModal({ open: true, mode: "edit", task, defaultStatus: task.status });
  }, []);

  const closeModal = useCallback(() => {
    setModal((m) => ({ ...m, open: false }));
  }, []);

  // ── Task actions ─────────────────────────────────────────────────────────
  const handleSave = useCallback((data: TaskFormData) => {
    if (modal.mode === "create") {
      dispatch(addTask({ ...data, status: data.status || modal.defaultStatus }));
      addToast("Task created ✓", "success");
    } else if (modal.task) {
      dispatch(updateTask({ id: modal.task.id, data }));
      addToast("Task updated ✓", "success");
    }
    closeModal();
  }, [modal, dispatch, addToast, closeModal]);

  const handleDeleteRequest = useCallback((id: string) => {
    const task = allTasks.find((t) => t.id === id);
    if (!task) return;
    setDeleteState({ open: true, taskId: id, taskTitle: task.title });
  }, [allTasks]);

  const handleDeleteConfirm = useCallback(() => {
    dispatch(deleteTask(deleteState.taskId));
    addToast("Task deleted", "warning");
    setDeleteState(INITIAL_DELETE);
  }, [dispatch, deleteState.taskId, addToast]);

  const handleMove = useCallback((id: string, status: TaskStatus) => {
    dispatch(moveTask({ id, status }));
    addToast(`Moved to ${status}`, "info");
  }, [dispatch, addToast]);

  // ── Drag & drop ──────────────────────────────────────────────────────────
  const handleDragStart = useCallback((id: string) => setDraggingId(id), []);
  const handleDragEnd = useCallback(() => setDraggingId(null), []);

  const handleDrop = useCallback((targetStatus: TaskStatus) => {
    if (!draggingId) return;
    const task = allTasks.find((t) => t.id === draggingId);
    if (task && task.status !== targetStatus) {
      handleMove(draggingId, targetStatus);
    }
    setDraggingId(null);
  }, [draggingId, allTasks, handleMove]);

  // ── Derived UI state ─────────────────────────────────────────────────────
  const hasActiveFilters = search.trim() !== "" || priorities.length > 0;
  const allHidden = totalTasks > 0 && tasksByStatus.total === 0;

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen bg-board-bg">
        <div className="w-6 h-6 border-2 border-accent-indigo border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-board-bg overflow-hidden font-sans">
      <header className="flex items-center justify-between px-5 h-[52px] border-b border-board-border shrink-0 bg-board-bg z-10">
        <div className="flex items-center gap-2.5">
          <LayoutGrid />
          <span className="text-base font-bold">
            <span className="text-text-primary">Team</span>
            <span className="text-accent-indigo">Board</span>
          </span>
          <span className="text-sm text-text-faint">{totalTasks} tasks</span>
        </div>
        <Button variant="primary" onClick={() => openCreate()} className="rounded-full">
          <span className="text-base font-light leading-none"><Plus className="w-5 h-5" /></span>
          New Task
        </Button>
      </header>

      <main className="flex flex-col flex-1 gap-3 p-4 overflow-hidden">
        <FilterBar />
        {storageError && (
          <div role="alert" className="flex items-center gap-2 bg-[#7f1d1d]/60 border border-red-500/40 rounded-lg px-4 py-2.5 text-sm text-red-200">
            <span>⚠</span>
            <span>Storage unavailable — data won&apos;t persist between sessions.</span>
          </div>
        )}
        {allHidden && (
          <div className="text-center text-sm text-text-faint py-2">
            No tasks match your filters.{" "}
            <button
              onClick={() => dispatch(clearFilters())}
              className="text-accent-indigo underline hover:text-[#4f46e5] transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}
        <div className="flex flex-1 gap-3 overflow-hidden min-h-0">
          {STATUSES.map((status) => (
            <BoardColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              draggingId={draggingId}
              onAddNew={openCreate}
              onEdit={openEdit}
              onDelete={handleDeleteRequest}
              onMove={handleMove}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
          ))}
        </div>
      </main>
      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.mode === "create" ? "Create Task" : "Edit Task"}
      >
        {modal.open && (
          <TaskForm
            initial={modal.mode === "edit" ? modal.task : null}
            defaultStatus={modal.defaultStatus}
            onSave={handleSave}
            onCancel={closeModal}
          />
        )}
      </Modal>
      <ConfirmDialog
        open={deleteState.open}
        title={deleteState.taskTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteState(INITIAL_DELETE)}
      />
      <Toast toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
