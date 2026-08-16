"use client";

import { useEffect, useRef } from "react";

import { type DraftPayload, saveDraft } from "./draftApi";

type BrokenDraftAutosaveOptions = {
  draft: DraftPayload;
  onSaved: (message: string) => void;
  onError: (message: string) => void;
};

export function useBrokenDraftAutosave({
  draft,
  onSaved,
  onError,
}: BrokenDraftAutosaveOptions) {
  const hasUserEditedRef = useRef(false);

  useEffect(() => {
    if (!hasUserEditedRef.current) {
      hasUserEditedRef.current = true;
      return;
    }

    const timeoutId = window.setTimeout(function autosaveTimerCallback() {
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

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [draft, onError, onSaved]);

  return {
    cancelPendingAutosave() {
      // Broken version intentionally leaves the scheduled autosave in place.
    },
  };
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
