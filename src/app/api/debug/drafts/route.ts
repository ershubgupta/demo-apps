import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type DraftSaveRecord = {
  id: string;
  title: string;
  body: string;
  savedAt: string;
};

type DraftStore = {
  saves: DraftSaveRecord[];
  nextId: number;
};

const globalDraftStore = globalThis as typeof globalThis & {
  debugDraftStore?: DraftStore;
};

function getDraftStore() {
  if (!globalDraftStore.debugDraftStore) {
    globalDraftStore.debugDraftStore = {
      saves: [],
      nextId: 1,
    };
  }

  return globalDraftStore.debugDraftStore;
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

export async function POST(request: Request) {
  // Development-only delay so the save-origin flow is visible in Network.
  await wait(900);

  const body = (await request.json().catch(() => ({}))) as {
    title?: string;
    body?: string;
  };

  const store = getDraftStore();
  const savedAt = new Date().toISOString();
  const record: DraftSaveRecord = {
    id: `draft-save-${store.nextId}`,
    title: body.title ?? "",
    body: body.body ?? "",
    savedAt,
  };

  store.nextId += 1;
  store.saves.unshift(record);

  return noStoreJson({
    saveId: record.id,
    savedAt,
    saveCount: store.saves.length,
    saves: store.saves.slice(0, 8),
  });
}

export function GET() {
  const store = getDraftStore();

  return noStoreJson({
    saveCount: store.saves.length,
    saves: store.saves.slice(0, 8),
    requestedAt: new Date().toISOString(),
  });
}

export function DELETE() {
  globalDraftStore.debugDraftStore = {
    saves: [],
    nextId: 1,
  };

  return noStoreJson({
    ok: true,
    resetAt: new Date().toISOString(),
  });
}
