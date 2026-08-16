import type { DestructiveCatalogAction } from "./row-actions";
import type { Catalog } from "@/features/catalog-ho/types";

export function getDestructiveActionConfirmation(
  action: DestructiveCatalogAction,
  catalog: Catalog
) {
  if (action === "Delete") {
    return {
      variant: "destructive" as const,
      title: "Delete catalog?",
      description: (
        <>
          Are you sure you want to delete catalog{" "}
          <strong>{catalog.number}</strong>? This action cannot be undone.
        </>
      ),
      confirmLabel: "Delete",
      successTitle: "Catalog deleted",
      successDescription: `Catalog ${catalog.number} has been deleted.`,
    };
  }

  if (action === "Inactive EOD") {
    return {
      variant: "destructive" as const,
      title: "Deactivate catalog at EOD?",
      description: (
        <>
          Are you sure you want to deactivate catalog{" "}
          <strong>{catalog.number}</strong> at the end of the day?
        </>
      ),
      confirmLabel: "Deactivate",
      successTitle: "Catalog deactivation scheduled",
      successDescription: `Catalog ${catalog.number} will be deactivated at the end of the day.`,
    };
  }

  return {
    variant: "destructive" as const,
    title: "Deactivate catalog now?",
    description: (
      <>
        Are you sure you want to deactivate catalog{" "}
        <strong>{catalog.number}</strong> immediately?
      </>
    ),
    confirmLabel: "Deactivate",
    successTitle: "Catalog deactivated",
    successDescription: `Catalog ${catalog.number} has been deactivated.`,
  };
}
