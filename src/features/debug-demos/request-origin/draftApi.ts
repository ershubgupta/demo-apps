export type DraftPayload = {
  title: string;
  body: string;
};

export type DraftSaveRecord = DraftPayload & {
  id: string;
  savedAt: string;
};

export type DraftSaveResponse = {
  saveId: string;
  savedAt: string;
  saveCount: number;
  saves: DraftSaveRecord[];
};

export async function saveDraft(
  draft: DraftPayload
): Promise<DraftSaveResponse> {
  const response = await fetch("/api/debug/drafts", {
    method: "POST",
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(draft),
  });

  if (!response.ok) {
    throw new Error(`Draft save failed with ${response.status}`);
  }

  return response.json() as Promise<DraftSaveResponse>;
}

export async function resetDraftSaves() {
  await fetch("/api/debug/drafts", {
    method: "DELETE",
    cache: "no-store",
  });
}
