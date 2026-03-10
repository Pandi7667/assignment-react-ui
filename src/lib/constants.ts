import type { Task, TaskPriority, TaskStatus } from "@/types";

export const STATUSES: TaskStatus[] = ["Backlog", "In Progress", "Done"];
export const PRIORITIES: TaskPriority[] = ["Low", "Medium", "High"];
export const SORT_OPTIONS = ["Last Updated", "Created Date", "Priority"] as const;

export const SCHEMA_VERSION = 2;
export const STORAGE_KEY = "local_teamboard_tasks";
export const STORAGE_VERSION_KEY = "local_teamboard_schema_version";

export const STATUS_COLOR: Record<TaskStatus, string> = {
  Backlog: "#6366f1",
  "In Progress": "#f59e0b",
  Done: "#22c55e",
};

export const PRIORITY_CONFIG: Record<
  TaskPriority,
  { bg: string; text: string; dot: string }
> = {
  Low:    { bg: "#166534", text: "#4ade80", dot: "#4ade80" },
  Medium: { bg: "#92400e", text: "#fbbf24", dot: "#fbbf24" },
  High:   { bg: "#feb6b6", text: "#c60000", dot: "#c60000" },
};

// Lower number = higher priority in sort
export const PRIORITY_ORDER: Record<TaskPriority, number> = {
  High: 0,
  Medium: 1,
  Low: 2,
};

export const Json_Data: Task[] = [
  {
    id: "1",
    title: "Set up project structure",
    description: "Initialize repository, configure TypeScript, add ESLint.",
    status: "Done",
    priority: "High",
    assignee: "Pandi",
    tags: ["setup", "infra"],
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: "2",
    title: "Implement board view",
    description: "Columns for Backlog, In Progress, Done with task cards.",
    status: "In Progress",
    priority: "High",
    assignee: "Pandi",
    tags: ["feature"],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "3",
    title: "Design component library",
    description: "Build reusable UI components: Button, Modal, Toast, etc.",
    status: "In Progress",
    priority: "High",
    assignee: "Harshan",
    tags: ["design", "ui"],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "4",
    title: "Add filtering & sorting",
    description: "Filter by status, priority, search text. Sort by date/priority.",
    status: "In Progress",
    priority: "Medium",
    assignee: "Aditya",
    tags: ["feature", "ux"],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: "5",
    title: "Different type template creation process",
    description: "Designing and developing reusable templates for various purposes such as websites.",
    status: "Backlog",
    priority: "Medium",
    assignee: "Harshan",
    tags: ["a11y"],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  }
];
