import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";

import { DataTable } from "@/components/data-table/data-table";

type TestRow = {
  id: string;
  name: string;
};

const rows: TestRow[] = [
  { id: "one", name: "One" },
  { id: "two", name: "Two" },
];

const columns: ColumnDef<TestRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
];

function ControlledSelectionTable() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  return (
    <DataTable
      columns={columns}
      data={rows}
      enableRowSelection
      getRowId={(row) => row.id}
      onRowSelectionChange={setRowSelection}
      rowSelection={rowSelection}
    />
  );
}

function getSelectAllCheckbox() {
  return screen.getByRole("checkbox", {
    name: "Select all rows on page",
  });
}

function getRowCheckboxes() {
  return screen.getAllByRole("checkbox", { name: "Select row" });
}

describe("DataTable", () => {
  it("selects and unselects all visible rows from the header checkbox", async () => {
    const user = userEvent.setup();
    render(<ControlledSelectionTable />);

    expect(getSelectAllCheckbox()).toBeEnabled();

    await user.click(getSelectAllCheckbox());
    expect(getSelectAllCheckbox()).toBeChecked();
    getRowCheckboxes().forEach((checkbox) => expect(checkbox).toBeChecked());

    await user.click(getSelectAllCheckbox());
    expect(getSelectAllCheckbox()).not.toBeChecked();
    getRowCheckboxes().forEach((checkbox) =>
      expect(checkbox).not.toBeChecked()
    );
  });

  it("renders configured mobile card content", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        mobileCard={{
          renderTitle: (row) => row.name,
          fields: [{ label: "Identifier", render: (row) => row.id }],
        }}
      />
    );

    expect(screen.getAllByText("Identifier")).toHaveLength(rows.length);
    expect(screen.getByText("one")).toBeInTheDocument();
  });

  it("keeps mobile as a table when no mobile card is configured", () => {
    render(
      <DataTable columns={columns} data={rows} getRowId={(row) => row.id} />
    );

    expect(screen.queryByText("Identifier")).not.toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("applies the configured minimum width to the table", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        minWidth={1400}
      />
    );

    expect(screen.getByRole("table")).toHaveStyle({ minWidth: "1400px" });
  });

  it("shows the rows-per-page selector by default for client pagination", () => {
    render(
      <DataTable columns={columns} data={rows} getRowId={(row) => row.id} />
    );

    expect(screen.getByText("Rows per page")).toBeInTheDocument();
  });

  it("hides the rows-per-page selector when disabled", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        showPageSizeSelector={false}
      />
    );

    expect(screen.queryByText("Rows per page")).not.toBeInTheDocument();
  });

  it("does not show the rows-per-page selector for server pagination without a handler", () => {
    render(
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        pagination={{
          page: 1,
          pageSize: 10,
          totalItems: 20,
          onPageChange: () => {},
        }}
      />
    );

    expect(screen.queryByText("Rows per page")).not.toBeInTheDocument();
  });
});
