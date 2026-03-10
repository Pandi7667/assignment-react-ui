import { useState, useEffect, useCallback } from "react";
import type { Task, TaskFormData, TaskPriority, TaskStatus } from "@/types";

interface FormState extends TaskFormData {
  tagInput: string;
}

const DEFAULTS: FormState = {
  title: "",
  description: "",
  status: "Backlog",
  priority: "Medium",
  assignee: "",
  tags: [],
  tagInput: "",
};

interface FormErrors {
  title?: string;
  assignee?: string;
}

export function useTaskForm(initial?: Task | null) {
  const [form, setForm] = useState<FormState>(() =>
    initial
      ? { ...initial, tagInput: "" }
      : { ...DEFAULTS }
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [dirty, setDirty] = useState(false);

  // Reset when initial changes (e.g. switching between create/edit)
  useEffect(() => {
    setForm(initial ? { ...initial, tagInput: "" } : { ...DEFAULTS });
    setErrors({});
    setDirty(false);
  }, [initial?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Warn on unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const setField = useCallback(
    <K extends keyof FormState>(field: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
      setDirty(true);
      if (field === "title") setErrors((e) => ({ ...e, title: undefined }));
    },
    []
  );

  const addTag = useCallback(() => {
    const t = form.tagInput.trim().replace(/^#/, "");
    if (t && !form.tags.includes(t)) {
      setForm((prev) => ({ ...prev, tags: [...prev.tags, t], tagInput: "" }));
      setDirty(true);
    } else {
      setForm((prev) => ({ ...prev, tagInput: "" }));
    }
  }, [form.tagInput, form.tags]);

  const removeTag = useCallback((tag: string) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
    setDirty(true);
  }, []);

  // const validate = useCallback((): boolean => {
  //   const errs: FormErrors = {};
  //   if (!form.title.trim()) errs.title = "Title is required";
  //   else if (form.title.length > 80) errs.title = "Max 80 characters";
  //   setErrors(errs);
  //   return Object.keys(errs).length === 0;
  // }, [form.title]);

  const validate = useCallback((): boolean => {
  const errs: FormErrors = {};

  if (!form.title.trim()) {
    errs.title = "Title is required";
  } else if (form.title.length > 80) {
    errs.title = "Max 80 characters";
  }

  if (!form.assignee.trim()) {
    errs.assignee = "Assignee is required";
  } else if (form.assignee.length > 50) {
    errs.assignee = "Max 50 characters";
  }

  setErrors(errs);

  return Object.keys(errs).length === 0;
}, [form.title, form.assignee]);

  const getFormData = (): TaskFormData => ({
    title: form.title.trim(),
    description: form.description,
    status: form.status as TaskStatus,
    priority: form.priority as TaskPriority,
    assignee: form.assignee,
    tags: form.tags,
  });

  return { form, errors, setField, addTag, removeTag, validate, getFormData, dirty };
}
