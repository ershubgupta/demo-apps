"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, CalendarDays, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
  cleanupCalendarPopup,
  openCalendarPopup,
  removeCalendarPopup,
} from "./brokenCalendarPopup";

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "long",
  year: "numeric",
});

export function BrokenDatePickerDemo() {
  const datePickerWrapperRef = useRef<HTMLDivElement>(null);
  const [monthIndex, setMonthIndex] = useState(7);

  useEffect(() => {
    return cleanupCalendarPopup;
  }, []);

  function handleOpenCalendar() {
    const datePickerWrapper = datePickerWrapperRef.current;

    if (!datePickerWrapper) {
      return;
    }

    openCalendarPopup({
      datePickerWrapper,
      monthIndex,
      onMonthChange: setMonthIndex,
    });
  }

  function handleReset() {
    removeCalendarPopup();
    setMonthIndex(7);
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
                Broken
              </span>
              <span className="text-sm text-muted-foreground">
                Schedule Planner
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-normal">
              Unexpected DOM Removal
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Open the calendar and click Next Month.
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
              <Link href="/debug-demos/dom-removal/fixed">
                Open review workspace
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={handleReset}
            >
              <RotateCcw aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>

        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle>Service appointment</CardTitle>
            <CardDescription>
              Choose a target date for the follow-up appointment.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div ref={datePickerWrapperRef} className="max-w-sm space-y-2">
              <label className="text-sm font-medium" htmlFor="appointment-date">
                Appointment month
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="appointment-date"
                  readOnly
                  value={monthFormatter.format(new Date(2026, monthIndex, 1))}
                  onFocus={handleOpenCalendar}
                />
                <Button
                  type="button"
                  className="gap-2"
                  onClick={handleOpenCalendar}
                >
                  <CalendarDays aria-hidden="true" />
                  Open Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
