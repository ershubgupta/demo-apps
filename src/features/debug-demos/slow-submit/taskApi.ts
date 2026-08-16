export type DebugTask = {
  id: string;
  title: string;
  createdAt: string;
};

export type TasksResponse = {
  tasks: DebugTask[];
  requestedAt?: string;
};

export async function fetchTasks(): Promise<TasksResponse> {
  const response = await fetch("/api/debug/tasks", {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Task list failed with ${response.status}`);
  }

  return response.json() as Promise<TasksResponse>;
}

export async function createTask(title: string): Promise<TasksResponse> {
  const response = await fetch("/api/debug/tasks", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    throw new Error(`Task create failed with ${response.status}`);
  }

  return response.json() as Promise<TasksResponse>;
}

export async function resetTasks() {
  await fetch("/api/debug/tasks", {
    method: "DELETE",
    cache: "no-store",
  });
}
