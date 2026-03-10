export type TaskStatus = "Backlog" | "In Progress" | "Done";
export type TaskPriority = "Low" | "Medium" | "High";
export type SortOption = "Last Updated" | "Created Date" | "Priority";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string[];
}

export interface FilterState {
  search: string;
  priorities: TaskPriority[];
  sortBy: SortOption;
}

export interface ToastItem {
  id: number;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

export interface StorageResult {
  tasks: Task[];
  migrated: boolean;
  error: boolean;
}
