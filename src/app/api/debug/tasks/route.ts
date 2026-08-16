import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type DebugTask = {
  id: string;
  title: string;
  createdAt: string;
};

type TaskStore = {
  tasks: DebugTask[];
  nextId: number;
};

const globalTaskStore = globalThis as typeof globalThis & {
  debugTaskStore?: TaskStore;
};

function getTaskStore() {
  if (!globalTaskStore.debugTaskStore) {
    globalTaskStore.debugTaskStore = {
      tasks: [],
      nextId: 1,
    };
  }

  return globalTaskStore.debugTaskStore;
}

function noStoreJson(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
      ...init?.headers,
    },
  });
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function GET() {
  const store = getTaskStore();

  return noStoreJson({
    tasks: store.tasks,
    requestedAt: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  // Development-only delay so duplicate submit is reproducible on localhost.
  await wait(1600);

  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
  };
  const store = getTaskStore();
  const createdAt = new Date().toISOString();
  const task: DebugTask = {
    id: `task-${store.nextId}`,
    title: body.title?.trim() || "Follow up with client",
    createdAt,
  };

  store.nextId += 1;
  store.tasks.unshift(task);

  return noStoreJson(
    {
      task,
      tasks: store.tasks,
    },
    { status: 201 }
  );
}

export function DELETE() {
  globalTaskStore.debugTaskStore = {
    tasks: [],
    nextId: 1,
  };

  return noStoreJson({
    ok: true,
    resetAt: new Date().toISOString(),
  });
}
