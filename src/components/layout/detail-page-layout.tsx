import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cnName";

type DetailPageLayoutProps = {
  /** Main tab panel or content area rendered beside the summary column. */
  children: ReactNode;
  /** Optional layout class for page-level sizing adjustments. */
  className?: string;
  /** Optional header rendered above the two-column detail body. */
  header?: ReactNode;
  /** Summary/sidebar content rendered in the left column on desktop. */
  summary: ReactNode;
  /** Toolbar rendered above the main detail content, usually tabs and actions. */
  toolbar: ReactNode;
};

/**
 * Renders the standard detail-page layout: optional header, summary sidebar,
 * toolbar, and main detail content.
 *
 * @param props - Detail layout slots and optional class name.
 * @returns A responsive detail page shell.
 */
export function DetailPageLayout({
  children,
  className,
  header,
  summary,
  toolbar,
}: DetailPageLayoutProps) {
  return (
    <section className={cn("flex h-full min-h-0 flex-col gap-4", className)}>
      {header}
      <div className="flex min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-[300px_minmax(0,1fr)] lg:overflow-hidden">
        {summary}
        <div className="flex min-h-0 flex-col gap-3 lg:overflow-hidden">
          {toolbar}
          {children}
        </div>
      </div>
    </section>
  );
}
