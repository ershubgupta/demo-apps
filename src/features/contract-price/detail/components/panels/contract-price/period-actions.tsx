"use client";

import { Copy, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { ActionMenuItem } from "@/components/actions-menu";
import {
  StatusEnum,
  type ContractPricePeriod,
} from "@/features/contract-price/types";

/** Builds row/menu actions for a contract price period. */
export function getContractPricePeriodActions(
  period: ContractPricePeriod
): ActionMenuItem[] {
  const actions: ActionMenuItem[] = [
    {
      icon: <Copy className="h-4 w-4" />,
      label: "Clone",
      onSelect: () => {
        toast.info("Clone is not available yet", {
          description: `Period ${period.startDate} - ${period.endDate}`,
        });
      },
    },
    {
      icon: <Eye className="h-4 w-4" />,
      label: "Detail",
      onSelect: () => {
        toast.info("Detail is not available yet", {
          description: `Period ${period.startDate} - ${period.endDate}`,
        });
      },
    },
  ];

  if (period.status === StatusEnum.Draft) {
    actions.push({
      icon: <Trash2 className="h-4 w-4" />,
      label: "Delete",
      onSelect: () => {
        toast.info("Delete is not available yet", {
          description: `Period ${period.startDate} - ${period.endDate}`,
        });
      },
      variant: "destructive",
    });
  }

  return actions;
}
