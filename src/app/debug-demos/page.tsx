import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  FilePenLine,
  MousePointerClick,
  Search,
  ShoppingCart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const demos = [
  {
    title: "Client Notes",
    description:
      "Draft client updates and keep recent saves visible for review.",
    icon: FilePenLine,
    brokenHref: "/debug-demos/request-origin/broken",
    fixedHref: "/debug-demos/request-origin/fixed",
  },
  {
    title: "Task Intake",
    description: "Create follow-up tasks and review recently added items.",
    icon: MousePointerClick,
    brokenHref: "/debug-demos/slow-submit/broken",
    fixedHref: "/debug-demos/slow-submit/fixed",
  },
  {
    title: "Product Search",
    description: "Search product categories and compare matching results.",
    icon: Search,
    brokenHref: "/debug-demos/stale-search/broken",
    fixedHref: "/debug-demos/stale-search/fixed",
  },
  {
    title: "Cart Checkout",
    description:
      "Record a login, product search, cart coupon, and quantity update flow.",
    icon: ShoppingCart,
    brokenHref: "/debug-demos/cart-recorder",
  },
  {
    title: "Schedule Planner",
    description:
      "Open a calendar panel and move through upcoming appointment months.",
    icon: CalendarDays,
    brokenHref: "/debug-demos/dom-removal/broken",
    fixedHref: "/debug-demos/dom-removal/fixed",
  },
];

export default function DebugDemosPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-5 sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Northstar workspace
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-normal">
            Workflow hub
          </h1>
          <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
            Jump into common operations workflows for client notes, team tasks,
            schedule planning, product search, cart checkout, and notifications.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {demos.map((demo) => (
            <Card key={demo.title} className="rounded-lg">
              <CardHeader>
                <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <demo.icon className="size-4" aria-hidden="true" />
                </div>
                <CardTitle>{demo.title}</CardTitle>
                <CardDescription>{demo.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <Button asChild className="justify-between">
                  <Link href={demo.brokenHref}>
                    Open workspace
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
                {demo.fixedHref ? (
                  <Button asChild variant="outline" className="justify-between">
                    <Link href={demo.fixedHref}>
                      Open review workspace
                      <ArrowRight aria-hidden="true" />
                    </Link>
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="rounded-lg">
          <CardHeader>
            <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Bell className="size-4" aria-hidden="true" />
            </div>
            <CardTitle>Operations Overview</CardTitle>
            <CardDescription>
              Open the operations dashboard with the notifications drawer.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 sm:flex-row">
            <Button asChild>
              <Link href="/debug-api-request/broken">Open workspace</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/debug-api-request/fixed">Open review workspace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
