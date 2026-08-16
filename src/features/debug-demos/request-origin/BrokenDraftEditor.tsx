"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { ArrowLeft, RotateCcw, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { resetDraftSaves, saveDraft } from "./draftApi";
import { useBrokenDraftAutosave } from "./useBrokenDraftAutosave";

export function BrokenDraftEditor() {
  const [title, setTitle] = useState("Weekly account notes");
  const [body, setBody] = useState(
    "Confirm renewal timeline and send the revised summary to the team."
  );
  const [history, setHistory] = useState<string[]>([]);
  const [status, setStatus] = useState("No unsaved changes.");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const draft = useMemo(() => ({ title, body }), [title, body]);

  const handleSaved = useCallback((message: string) => {
    setHistory((current) => [message, ...current].slice(0, 8));
    setStatus("Draft saved.");
  }, []);

  const handleError = useCallback((message: string) => {
    setStatus(message);
  }, []);

  const { cancelPendingAutosave } = useBrokenDraftAutosave({
    draft,
    onSaved: handleSaved,
    onError: handleError,
  });

  function handleTitleChange(value: string) {
    setTitle(value);
    setHasUnsavedChanges(true);
    setStatus("Unsaved changes.");
  }

  function handleBodyChange(value: string) {
    setBody(value);
    setHasUnsavedChanges(true);
    setStatus("Unsaved changes.");
  }

  async function handleManualSave() {
    cancelPendingAutosave();
    setStatus("Saving draft...");

    try {
      const result = await saveDraft(draft);
      handleSaved(`Saved ${result.saveId} at ${formatTime(result.savedAt)}`);
      setHasUnsavedChanges(false);
    } catch (error) {
      handleError(error instanceof Error ? error.message : "Draft save failed");
    }
  }

  async function handleReset() {
    await resetDraftSaves();
    setHistory([]);
    setStatus("Save history reset.");
  }

  return (
    <WorkspaceShell
      badge="Active"
      badgeClassName="bg-primary/10 text-primary"
      title="Draft workspace"
      description="Prepare client-facing notes and keep the latest version saved."
      otherModeHref="/debug-demos/request-origin/fixed"
      otherModeLabel="Open review workspace"
      onReset={handleReset}
    >
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Client update draft</CardTitle>
          <CardDescription>
            Update the note and save the latest client summary.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="draft-title">
              Title
            </label>
            <Input
              id="draft-title"
              value={title}
              onChange={(event) => handleTitleChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="draft-body">
              Notes
            </label>
            <Textarea
              id="draft-body"
              value={body}
              rows={7}
              onChange={(event) => handleBodyChange(event.target.value)}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              className="gap-2"
              disabled={!hasUnsavedChanges}
              onClick={handleManualSave}
            >
              <Save aria-hidden="true" />
              Save Draft
            </Button>
            <p className="text-sm text-muted-foreground">{status}</p>
          </div>
        </CardContent>
      </Card>
      <SaveHistory history={history} />
    </WorkspaceShell>
  );
}

type WorkspaceShellProps = {
  badge: string;
  badgeClassName: string;
  title: string;
  description: string;
  otherModeHref: string;
  otherModeLabel: string;
  onReset: () => void;
  children: ReactNode;
};

function WorkspaceShell({
  badge,
  badgeClassName,
  title,
  description,
  otherModeHref,
  otherModeLabel,
  onReset,
  children,
}: WorkspaceShellProps) {
  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeClassName}`}>
                {badge}
              </span>
              <span className="text-sm text-muted-foreground">
                Client Workspace
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">
              {title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/debug-demos">
                <ArrowLeft aria-hidden="true" />
                Workspace
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={otherModeHref}>{otherModeLabel}</Link>
            </Button>
            <Button type="button" variant="outline" className="gap-2" onClick={onReset}>
              <RotateCcw aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}

function SaveHistory({ history }: { history: string[] }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Save history</CardTitle>
        <CardDescription>Recent successful saves from this page.</CardDescription>
      </CardHeader>
      <CardContent>
        {history.length > 0 ? (
          <ol className="space-y-2">
            {history.map((item, index) => (
              <li key={`${item}-${index}`} className="rounded-lg border px-3 py-2 text-sm">
                {item}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm text-muted-foreground">No saves yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
