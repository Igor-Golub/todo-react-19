import { Task } from "../model";
import { PaginatedResponse } from "../../../shared/types.ts";

export async function fetchTasks({
  page = 1,
  per_page = 10,
  sort = { createdAt: "asc" },
  filters,
}: {
  page?: number;
  per_page?: number;
  filters?: {
    userId?: string;
    title?: string;
  };
  sort?: {
    createdAt: "asc" | "desc";
  };
}) {
  return fetch(
    `http://localhost:3001/tasks?_page=${page}&_per_page=${per_page}&_sort=${
      sort.createdAt === "asc" ? "createdAt" : "-createdAt"
    }&userId=${filters?.userId}&title=${filters?.title ?? ""}`,
  )
    .then((res) => res.json() as Promise<PaginatedResponse<Task>>)
    .then((tasksPromise) => ({ ...tasksPromise, page }));
}

export async function createTask(task: Task) {
  return fetch("http://localhost:3001/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  }).then((res) => res.json());
}

export async function updateTask(id: string, task: Partial<Task>) {
  return fetch(`http://localhost:3001/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  }).then((res) => res.json());
}

export async function deleteTask(id: string) {
  return fetch(`http://localhost:3001/tasks/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());
}
