"use client";

import { useEffect, useRef } from "react";

import { type DraftPayload, saveDraft } from "./draftApi";

type FixedDraftAutosaveOptions = {
  draft: DraftPayload;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
};

export function useFixedDraftAutosave({
  draft,
  onSaved,
  onError,
}: FixedDraftAutosaveOptions) {
  const hasUserEditedRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  function cancelPendingAutosave() {
    if (timeoutRef.current === null) {
      return;
    }

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }

  useEffect(() => {
    if (!hasUserEditedRef.current) {
      hasUserEditedRef.current = true;
      return;
    }

    cancelPendingAutosave();

    timeoutRef.current = window.setTimeout(function autosaveTimerCallback() {
      timeoutRef.current = null;
      void runAutosave();
    }, 2500);

    async function runAutosave() {
      try {
        const result = await saveDraft(draft);
        onSaved(`Saved ${result.saveId} at ${formatTime(result.savedAt)}`);
      } catch (error) {
        onError(error instanceof Error ? error.message : "Draft save failed");
      }
    }

    return cancelPendingAutosave;
  }, [draft, onError, onSaved]);

  return {
    cancelPendingAutosave,
  };
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
