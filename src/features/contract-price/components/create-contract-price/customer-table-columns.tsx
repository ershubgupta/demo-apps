import { ColumnDef } from "@tanstack/react-table";
import { Trash } from "lucide-react";

import { CustomerOption } from "../../types";

type CreateCustomerTableColumnsProps = {
  isMulti: boolean;
  onDeleteCustomer: (id: string) => void;
};

export function createCustomerTableColumns({
  isMulti,
  onDeleteCustomer,
}: CreateCustomerTableColumnsProps): ColumnDef<CustomerOption>[] {
  const singleCustomerColumns: ColumnDef<CustomerOption>[] = [
    {
      accessorKey: "charge",
      header: () => <span className="text-xs">Charge</span>,
      meta: {
        align: "center",
        width: 30,
        cellClassName: "text-xs",
      },
    },
    {
      accessorKey: "primaryStore",
      header: () => <span className="text-xs">Primary Store</span>,
      meta: {
        align: "center",
        width: 10,
        cellClassName: "text-xs",
      },
    },
    {
      accessorKey: "storeOperation",
      header: () => <span className="text-xs">Store Operation</span>,
      meta: {
        align: "center",
        width: 10,
        cellClassName: "text-xs",
      },
    },
  ];

  const multiCustomerColumns: ColumnDef<CustomerOption>[] = [
    {
      accessorKey: "cvCode",
      header: () => <span className="text-xs">CV code</span>,
      meta: {
        align: "center",
        width: 40,
        cellClassName: "text-xs",
      },
    },
    {
      accessorKey: "customerName",
      header: () => <span className="text-xs">Customer name</span>,
      meta: {
        align: "center",
        width: 50,
        cellClassName: "text-xs",
      },
    },
    {
      accessorKey: "primaryStore",
      header: () => <span className="text-xs">Primary</span>,
      meta: {
        align: "center",
        width: 10,
        cellClassName: "text-xs",
      },
    },
    {
      accessorKey: "tier",
      header: () => <span className="text-xs">Tier</span>,
      meta: {
        align: "center",
        width: 10,
        cellClassName: "text-xs",
      },
    },
    {
      id: "actions",
      header: () => <span className="text-xs">Actions</span>,
      meta: {
        align: "center",
        width: 10,
        cellClassName: "text-xs",
      },
      cell: ({ row }) => (
        <button
          type="button"
          onClick={() => onDeleteCustomer(row.original.id)}
          aria-label="Delete customer"
          className="text-destructive hover:text-destructive/80"
        >
          <Trash className="h-4 w-4" />
        </button>
      ),
    },
  ];

  return isMulti ? multiCustomerColumns : singleCustomerColumns;
}
