"use client";

import { useRef } from "react";
import { toast } from "sonner";

import { ConfirmationAlert } from "@/components/ui/confirmation-alert";

type DeleteAllConfirmationProps = {
  catalogId: string;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  target: "items" | "customers";
};

const copy = {
  items: {
    description: "Are you sure you want to remove all catalog items?",
    title: "Delete all items?",
    toastDescription: "All catalog items have been removed.",
    toastTitle: "Catalog items deleted",
  },
  customers: {
    description: "Are you sure you want to remove all catalog customers?",
    title: "Delete all customers?",
    toastDescription: "All catalog customers have been removed.",
    toastTitle: "Catalog customers deleted",
  },
};

export function DeleteAllConfirmation({
  catalogId,
  onOpenChange,
  open,
  target,
}: DeleteAllConfirmationProps) {
  const confirmedRef = useRef(false);
  const confirmationCopy = copy[target];

  return (
    <ConfirmationAlert
      confirmLabel="Delete"
      description={confirmationCopy.description}
      open={open}
      onOpenChange={(next) => {
        if (next) {
          onOpenChange(true);
          return;
        }
        if (confirmedRef.current) {
          confirmedRef.current = false;
          return;
        }
        onOpenChange(false);
      }}
      onConfirm={() => {
        confirmedRef.current = true;
        console.info(`Delete all catalog ${target}`, { catalogId });
        toast.success(confirmationCopy.toastTitle, {
          description: confirmationCopy.toastDescription,
        });
        onOpenChange(false);
      }}
      title={confirmationCopy.title}
      variant="destructive"
    />
  );
}
