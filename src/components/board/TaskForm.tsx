"use client";
import React, { useRef, useEffect } from "react";
import type { Task, TaskFormData } from "@/types";
import { STATUSES, PRIORITIES } from "@/lib/constants";
import { useTaskForm } from "@/hooks/useTaskForm";
import { TextInput, TextArea } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { TagBadge } from "@/components/ui/Badge";

interface TaskFormProps {
  initial?: Task | null;
  defaultStatus?: string;
  onSave: (data: TaskFormData) => void;
  onCancel: () => void;
}

export function TaskForm({ initial, defaultStatus, onSave, onCancel }: TaskFormProps) {
  const { form, errors, setField, addTag, removeTag, validate, getFormData } =
    useTaskForm(initial);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(getFormData());
  };

  return (
    <div className="flex flex-col gap-4">
      <TextInput
        ref={titleRef}
        label="Title"
        id="task-title"
        value={form.title}
        onChange={(e) => setField("title", e.target.value)}
        placeholder="Task title..."
        error={errors.title}
        required
      />
      <TextArea
        label="Description"
        id="task-description"
        value={form.description}
        onChange={(e) => setField("description", e.target.value)}
        placeholder="What needs to be done..."
        rows={4}
      />
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Status"
          id="task-status"
          value={form.status}
          onChange={(e) => setField("status", e.target.value as Task["status"])}
          options={STATUSES}
        />
        <Select
          label="Priority"
          id="task-priority"
          value={form.priority}
          onChange={(e) => setField("priority", e.target.value as Task["priority"])}
          options={PRIORITIES}
        />
      </div>
      <TextInput
        label="Assignee"
        id="task-assignee"
        value={form.assignee}
        onChange={(e) => setField("assignee", e.target.value)}
        placeholder="Assign to..."
        error={errors.assignee}
        required
      />
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-text-secondary">Tags</label>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {form.tags.map((t) => (
              <TagBadge key={t} text={t} onRemove={() => removeTag(t)} />
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={form.tagInput}
            onChange={(e) => setField("tagInput", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Type tag + Enter..."
            className="flex-1 rounded-md px-3 py-2 text-sm bg-board-input border border-board-inputBorder
              text-text-primary placeholder:text-text-faint
              focus:outline-none focus:ring-1 focus:border-accent-indigo focus:ring-accent-indigo transition-colors"
          />
          <Button variant="secondary" size="md" type="button" onClick={addTag}>
            Add
          </Button>
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {initial ? "Update" : "Save"}
        </Button>
      </div>
    </div>
  );
}
