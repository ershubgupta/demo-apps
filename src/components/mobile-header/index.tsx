import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type MobileHeaderProps = {
  /** Destination for the mobile back control. Defaults to Home. */
  backHref?: string;
  /** Accessible label for the back control. */
  backAriaLabel?: string;
  /** Page title shown in the mobile header. */
  pageTitle: string;
};

/**
 * A mobile-only header with back link and page title.
 *
 * @component
 * @param {object} props - The props for the mobile header.
 * @param {string} [props.backHref="/"] - Destination for the mobile back control.
 * @param {string} [props.backAriaLabel="Back to Catalog Overview"] - Accessible label for the back control.
 * @param {string} props.pageTitle - Page title shown in the mobile header.
 * @returns {JSX.Element} The rendered mobile header component.
 */
export function MobileHeader({
  backHref = "/",
  backAriaLabel = "Back to Home",
  pageTitle,
}: MobileHeaderProps) {
  return (
    <header className="flex items-center gap-2 md:hidden">
      <Button
        aria-label={backAriaLabel}
        asChild
        className="h-9 w-9 shrink-0"
        size="icon"
        variant="ghost"
      >
        <Link href={backHref}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>
      <h1 className="min-w-0 truncate text-xl font-bold text-foreground">
        {pageTitle}
      </h1>
    </header>
  );
}
