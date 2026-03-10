import type { Task, StorageResult } from "@/types";
import {
  SCHEMA_VERSION,
  STORAGE_KEY,
  STORAGE_VERSION_KEY,
  Json_Data,
} from "@/lib/constants";

function migrateV1ToV2(tasks: unknown[]): Task[] {
  return tasks.map((t: unknown) => {
    const task = t as Partial<Task> & Record<string, unknown>;
    return {
      id: String(task.id ?? Date.now()),
      title: String(task.title ?? ""),
      description: String(task.description ?? ""),
      status: (task.status as Task["status"]) ?? "Backlog",
      priority: (task.priority as Task["priority"]) ?? "Medium",
      assignee: String(task.assignee ?? ""),
      tags: Array.isArray(task.tags) ? (task.tags as string[]) : [],
      createdAt: Number(task.createdAt ?? Date.now()),
      updatedAt: Number(task.updatedAt ?? task.createdAt ?? Date.now()),
    };
  });
}

export function loadTasks(): StorageResult {
  try {
    const versionRaw = localStorage.getItem(STORAGE_VERSION_KEY);
    const version = versionRaw ? parseInt(versionRaw, 10) : 0;
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      // First load — seed data
      saveTasks(Json_Data);
      return { tasks: Json_Data, migrated: false, error: false };
    }

    const parsed: unknown[] = JSON.parse(raw);

    if (version < SCHEMA_VERSION) {
      const migrated = migrateV1ToV2(parsed);
      saveTasks(migrated);
      return { tasks: migrated, migrated: true, error: false };
    }

    return { tasks: parsed as Task[], migrated: false, error: false };
  } catch {
    return { tasks: Json_Data, migrated: false, error: true };
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_VERSION_KEY, String(SCHEMA_VERSION));
  } catch {
    // storage quota or unavailable 
  }
}
