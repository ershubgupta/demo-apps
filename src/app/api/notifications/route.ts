import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json(
    {
      unreadCount: 4,
      requestedAt: new Date().toISOString(),
      notifications: [
        {
          id: "approval-ready",
          title: "Approval ready",
          description: "The Q3 renewal package is ready for final review.",
          timeAgo: "2 min ago",
          unread: true,
        },
        {
          id: "payment-confirmed",
          title: "Payment confirmed",
          description: "Brightline Studio completed the outstanding invoice.",
          timeAgo: "18 min ago",
          unread: true,
        },
        {
          id: "team-mention",
          title: "You were mentioned",
          description: "Maya asked for your input on the onboarding checklist.",
          timeAgo: "42 min ago",
          unread: true,
        },
        {
          id: "document-signed",
          title: "Document signed",
          description: "North Pier Group signed the updated service agreement.",
          timeAgo: "1 hr ago",
          unread: true,
        },
        {
          id: "workspace-sync",
          title: "Workspace synced",
          description: "All account updates were synced successfully.",
          timeAgo: "Yesterday",
          unread: false,
        },
      ],
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}