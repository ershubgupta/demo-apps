"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cnName";
import { useTranslations } from "next-intl";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  /** Optional action area aligned to the right on desktop. */
  actions?: ReactNode;
  /** Optional href for the circular back button before the title. */
  backHref?: string;
  /** Optional breadcrumb trail rendered above the page title. */
  breadcrumbs?: BreadcrumbItem[];
  /** Supporting copy below the title. */
  subtitle?: string;
  /** Main page title. */
  title: string;
};

/**
 * Standard page title/header region.
 *
 * @component
 * @param {object} props - The props for the page header.
 * @param {ReactNode} [props.actions] - Optional action area aligned to the right on desktop.
 * @param {string} [props.backHref] - Optional href for the circular back button before the title.
 * @param {BreadcrumbItem[]} [props.breadcrumbs] - Optional breadcrumb trail rendered above the page title.
 * @param {string} [props.subtitle] - Supporting copy below the title.
 * @param {string} props.title - Main page title.
 * @returns {JSX.Element} The rendered page header component.
 */
export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumbs,
  backHref,
}: PageHeaderProps) {
  const t = useTranslations();
  return (
    <div className="space-y-3">
      {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            {backHref ? (
              <Button
                asChild
                className="mt-1 h-9 w-9 shrink-0 rounded-full p-0"
                variant="secondary"
              >
                <Link href={backHref} aria-label={t("common.actions.goBack")}>
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            ) : null}
            <h1 className="min-w-0 truncate text-2xl font-bold leading-tight text-foreground">
              {title}
            </h1>
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
        {subtitle ? (
          <p className="max-w-3xl text-sm font-medium text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {item.href && !isLast ? (
              <Link className="hover:text-primary" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast && "text-foreground")}>
                {item.label}
              </span>
            )}
            {!isLast ? <ChevronRight className="h-4 w-4" /> : null}
          </span>
        );
      })}
    </nav>
  );
}
