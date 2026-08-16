"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Plus, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { createTask, fetchTasks, resetTasks, type DebugTask } from "./taskApi";

export function FixedTaskForm() {
  const [title, setTitle] = useState("Follow up with client");
  const [tasks, setTasks] = useState<DebugTask[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("Ready to create a task.");
  const submissionInFlightRef = useRef(false);

  useEffect(() => {
    async function loadTasks() {
      const result = await fetchTasks();
      setTasks(result.tasks);
    }

    void loadTasks();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInFlightRef.current) {
      return;
    }

    submissionInFlightRef.current = true;
    setIsSubmitting(true);
    setStatus("Creating...");

    try {
      const result = await createTask(title);
      setTasks(result.tasks);
      setStatus("Task created.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Task create failed");
    } finally {
      submissionInFlightRef.current = false;
      setIsSubmitting(false);
    }
  }

  async function handleReset() {
    await resetTasks();
    setTasks([]);
    setStatus("Task list reset.");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-status-active/10 px-2.5 py-1 text-xs font-medium text-status-active">
                Active
              </span>
              <span className="text-sm text-muted-foreground">
                Task Queue
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">
              Task intake
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Create and track follow-up tasks for the team.
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
              <Link href="/debug-demos/slow-submit/broken">
                Open standard workspace
              </Link>
            </Button>
            <Button type="button" variant="outline" className="gap-2" onClick={handleReset}>
              <RotateCcw aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Create task</CardTitle>
            <CardDescription>
              Add a follow-up item to the shared queue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="task-title">
                  Task title
                </label>
                <Input
                  id="task-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button type="submit" className="gap-2" disabled={isSubmitting}>
                  <Plus aria-hidden="true" />
                  {isSubmitting ? "Creating..." : "Create Task"}
                </Button>
                <p className="text-sm text-muted-foreground">{status}</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Recently created items appear at the top.</CardDescription>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <ol className="space-y-2">
                {tasks.map((task) => (
                  <li key={task.id} className="rounded-lg border px-3 py-2">
                    <p className="text-sm font-medium">{task.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Created {new Date(task.createdAt).toLocaleTimeString()}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">No tasks created yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}