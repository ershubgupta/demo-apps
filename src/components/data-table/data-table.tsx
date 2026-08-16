"use client";

import { useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { AppDropdown } from "@/components/app-dropdown";
import { TABLE_PAGE_SIZE_OPTIONS } from "@/constant";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useTranslations } from "next-intl";
import type { Translate } from "@/i18n/types";
import { cn } from "@/lib/utils/cnName";

declare module "@tanstack/react-table" {
  // TanStack requires these generic names to match its original declaration.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    align?: "left" | "center" | "right";
    width?: number | string;
    noWrap?: boolean;
    isNumeric?: boolean;
    stickyLeft?: boolean;
    cellClassName?: string;
  }
}

/**
 * Describes one label/value pair inside the mobile card representation of a row.
 * Keep this data-focused: layout belongs to the DataTable mobile card shell, while
 * the field decides what value from the row should be shown.
 */
export type DataTableMobileField<TData> = {
  /** Optional layout class for this field wrapper, for example column span only. */
  className?: string;
  /** Reader-facing field label shown above the rendered value. */
  label: ReactNode;
  /** Renders the value for this field from the original row object. */
  render: (row: TData) => ReactNode;
  /** Makes this field span the full mobile card grid width. */
  fullWidth?: boolean;
};

/**
 * Configuration for rendering table rows as mobile cards below the md breakpoint.
 * Providing this object is the opt-in switch: with `mobileCard` the component
 * renders cards on mobile and the normal table on desktop; without it, the table
 * remains horizontally scrollable on mobile.
 */
export type DataTableMobileCard<TData> = {
  /** Secondary fields shown in the card body. */
  fields: DataTableMobileField<TData>[];
  /** Optional row-level actions rendered in the card header, beside selection. */
  renderActions?: (row: TData) => ReactNode;
  /** Optional status pill or indicator rendered near the subtitle. */
  renderStatus?: (row: TData) => ReactNode;
  /** Optional supporting text below the card title. */
  renderSubtitle?: (row: TData) => ReactNode;
  /** Primary card title, usually the row identifier or name. */
  renderTitle: (row: TData) => ReactNode;
};

type DataTableProps<TData, TValue> = {
  /** Layout class for the outer table/card container. Prefer sizing classes only. */
  className?: string;
  /** TanStack column definitions used for the desktop table. */
  columns: ColumnDef<TData, TValue>[];
  /** Rows to render. Each object is also passed to mobile card render callbacks. */
  data: TData[];
  /** Shows the loading empty row/card state while data is being fetched. */
  isLoading?: boolean;
  /** Message shown when there are no rows after loading completes. */
  emptyMessage?: string;
  /** Initial client-side page size when server pagination is not provided. */
  initialPageSize?: number;
  /** Controls row/header padding density without custom class overrides. */
  density?: "comfortable" | "compact";
  /** Expands the table to the available width while still respecting minWidth. */
  fillWidth?: boolean;
  /** Minimum desktop table width before horizontal scrolling appears. */
  minWidth?: number;
  /** Optional accent strip class, commonly derived from row status. */
  getRowAccentClassName?: (row: TData) => string | undefined;
  /** Makes body rows/cards clickable and receives the original row object. */
  onRowClick?: (row: TData) => void;
  /** Adds the shared select-all and row selection checkboxes. */
  enableRowSelection?: boolean;
  /** Controlled TanStack row selection state. Omit for uncontrolled selection. */
  rowSelection?: RowSelectionState;
  /** Called whenever row selection changes, controlled or uncontrolled. */
  onRowSelectionChange?: OnChangeFn<RowSelectionState>;
  /** Keeps the generated selection column pinned on the left for wide tables. */
  stickySelectionColumn?: boolean;
  /** Stable row id factory. Required when selection should survive row reorder. */
  getRowId?: (row: TData, index: number) => string;
  /** When provided, DataTable renders rows as cards on mobile and table on md+. */
  mobileCard?: DataTableMobileCard<TData>;
  /** Shows the rows-per-page selector in the footer when pagination can change page size. */
  showPageSizeSelector?: boolean;
  /** Server pagination contract. When omitted, DataTable paginates client-side. */
  pagination?: {
    /** Current 1-based page number. */
    page: number;
    /** Number of rows requested for the current page. */
    pageSize: number;
    /** Total rows across every server page. */
    totalItems: number;
    /** Requests a new 1-based page number from the parent. */
    onPageChange: (page: number) => void;
    /** Requests a new page size from the parent for server pagination. */
    onPageSizeChange?: (pageSize: number) => void;
  };
  /** Controls whether the pagination footer is rendered. Defaults to true. */
  showPagination?: boolean;
};

/**
 * A reusable data table component for catalog-style lists.
 *
 * @component
 * @param {object} props - The props for the data table.
 * @param {string} [props.className] - Layout class for the outer table/card container. Prefer sizing classes only.
 * @param {ColumnDef<TData, TValue>[]} props.columns - TanStack column definitions used for the desktop table.
 * @param {TData[]} props.data - Rows to render. Each object is also passed to mobile card render callbacks.
 * @param {boolean} [props.isLoading=false] - Shows the loading empty row/card state while data is being fetched.
 * @param {string} [props.emptyMessage="No records found."] - Message shown when there are no rows after loading completes.
 * @param {number} [props.initialPageSize=10] - Initial client-side page size when server pagination is not provided.
 * @param {"comfortable" | "compact"} [props.density="comfortable"] - Controls row/header padding density without custom class overrides.
 * @param {boolean} [props.fillWidth=true] - Expands the table to the available width while still respecting minWidth.
 * @param {number} [props.minWidth=1180] - Minimum desktop table width before horizontal scrolling appears.
 * @param {(row: TData) => string | undefined} [props.getRowAccentClassName] - Optional accent strip class, commonly derived from row status.
 * @param {(row: TData) => void} [props.onRowClick] - Makes body rows/cards clickable and receives the original row object.
 * @param {boolean} [props.enableRowSelection=false] - Adds the shared select-all and row selection checkboxes.
 * @param {RowSelectionState} [props.rowSelection] - Controlled TanStack row selection state. Omit for uncontrolled selection.
 * @param {OnChangeFn<RowSelectionState>} [props.onRowSelectionChange] - Called whenever row selection changes, controlled or uncontrolled.
 * @param {boolean} [props.stickySelectionColumn=false] - Keeps the generated selection column pinned on the left for wide tables.
 * @param {(row: TData, index: number) => string} [props.getRowId] - Stable row id factory. Required when selection should survive row reorder.
 * @param {DataTableMobileCard<TData>} [props.mobileCard] - When provided, DataTable renders rows as cards on mobile and table on md+.
 * @param {object} [props.pagination] - Server pagination contract. When omitted, DataTable paginates client-side.
 * @param {number} props.pagination.page - Current 1-based page number.
 * @param {number} props.pagination.pageSize - Number of rows requested for the current page.
 * @param {number} props.pagination.totalItems - Total rows across every server page.
 * @param {(page: number) => void} props.pagination.onPageChange - Requests a new 1-based page number from the parent.
 * @param {boolean} [props.showPagination=true] - Controls whether the pagination footer is rendered.
 * @returns {JSX.Element} The rendered data table component.
 */
export function DataTable<TData, TValue>({
  className,
  columns,
  data,
  isLoading = false,
  emptyMessage,
  initialPageSize = 10,
  density = "comfortable",
  fillWidth = true,
  minWidth = 1180,
  getRowAccentClassName,
  mobileCard,
  showPageSizeSelector = true,
  onRowClick,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
  stickySelectionColumn = false,
  getRowId,
  pagination,
  showPagination = true,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations();
  const resolvedEmptyMessage = emptyMessage ?? t("common.states.noRecords");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [internalRowSelection, setInternalRowSelection] =
    useState<RowSelectionState>({});
  const isServerPaginated = Boolean(pagination);
  const pageCount = pagination
    ? Math.max(1, Math.ceil(pagination.totalItems / pagination.pageSize))
    : undefined;

  const isRowSelectionControlled = rowSelection !== undefined;
  const effectiveRowSelection = isRowSelectionControlled
    ? rowSelection
    : internalRowSelection;
  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = (updater) => {
    const next =
      typeof updater === "function" ? updater(effectiveRowSelection) : updater;
    if (!isRowSelectionControlled) setInternalRowSelection(next);
    onRowSelectionChange?.(next);
  };

  const finalColumns = enableRowSelection
    ? [selectionColumn<TData, TValue>(stickySelectionColumn, t), ...columns]
    : columns;

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      sorting,
      rowSelection: effectiveRowSelection,
    },
    initialState: {
      pagination: {
        pageSize: initialPageSize,
      },
    },
    manualPagination: isServerPaginated,
    pageCount,
    enableRowSelection,
    getRowId,
    onSortingChange: setSorting,
    onRowSelectionChange: handleRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tableRows = table.getRowModel().rows;
  const totalRows = pagination?.totalItems ?? tableRows.length;
  const currentPage =
    pagination?.page ?? table.getState().pagination.pageIndex + 1;
  const currentPageSize =
    pagination?.pageSize ?? table.getState().pagination.pageSize;
  const currentPageStart =
    totalRows === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
  const currentPageEnd = Math.min(totalRows, currentPage * currentPageSize);
  const canPreviousPage = pagination
    ? pagination.page > 1
    : table.getCanPreviousPage();
  const canNextPage = pagination
    ? pagination.page < pageCount!
    : table.getCanNextPage();
  const canChangePageSize =
    showPageSizeSelector &&
    (!pagination || Boolean(pagination.onPageSizeChange));
  const handlePageSizeChange = (value: string) => {
    const nextPageSize = Number(value);
    if (!Number.isInteger(nextPageSize) || nextPageSize <= 0) return;
    handleRowSelectionChange({});
    if (pagination) {
      pagination.onPageSizeChange?.(nextPageSize);
      return;
    }
    table.setPageSize(nextPageSize);
    table.setPageIndex(0);
  };

  const goToPage = (page: number) => {
    if (page === currentPage) return;
    handleRowSelectionChange({});
    if (pagination) {
      pagination.onPageChange(page);
      return;
    }
    table.setPageIndex(page - 1);
  };

  const paginationFooter = (
    <div className="shrink-0 sticky md:relative bottom-0 border-border bg-card border-t px-4 py-2 text-xs text-muted-foreground mt-3 md:mt-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="whitespace-nowrap">
            {t("common.pagination.range", {
              from: currentPageStart,
              to: currentPageEnd,
              total: totalRows,
            })}
          </span>
          {canChangePageSize ? (
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap">
                {t("common.pagination.rowsPerPage")}
              </span>
              <AppDropdown
                contentClassName="min-w-20"
                onValueChange={handlePageSizeChange}
                options={TABLE_PAGE_SIZE_OPTIONS.map((option) => ({
                  label: String(option),
                  value: String(option),
                }))}
                triggerClassName="h-8 w-16"
                value={String(currentPageSize)}
              />
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            disabled={!canPreviousPage}
            onClick={() => goToPage(1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            disabled={!canPreviousPage}
            onClick={() => goToPage(currentPage - 1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            disabled={!canNextPage}
            onClick={() => goToPage(currentPage + 1)}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            disabled={!canNextPage}
            onClick={() => goToPage(pageCount ?? table.getPageCount())}
            size="icon-sm"
            type="button"
            variant="outline"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const isCompact = density === "compact";
  const mobileCardConfig = mobileCard;
  const showMobileCards = Boolean(mobileCardConfig);
  const headerPaddingClass = isCompact ? "px-3 py-2" : "px-4 py-3";
  const cellPaddingClass = isCompact ? "px-3 py-1.5" : "px-4 py-3";
  const isRowClickable = Boolean(onRowClick);
  const nonClickableColumnIds = new Set(["actions", "select"]);

  return (
    <div
      className={cn(
        "flex min-h-0 flex-col sm:rounded-xl border-border md:bg-card md:border md:shadow-sm md:overflow-hidden",
        className
      )}
    >
      {mobileCardConfig ? (
        <div className="space-y-3 p-0 md:hidden">
          {isLoading ? (
            <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
              {t("common.states.loadingRecords")}
            </div>
          ) : tableRows.length === 0 ? (
            <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
              {resolvedEmptyMessage}
            </div>
          ) : (
            tableRows.map((row) => (
              <article
                className={cn(
                  "relative rounded-xl border border-border bg-card p-4 shadow-sm",
                  isRowClickable && "cursor-pointer"
                )}
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
              >
                <span
                  className={cn(
                    "absolute left-0 top-0 h-full w-1 rounded-l-xl",
                    getRowAccentClassName?.(row.original)
                  )}
                />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 break-words text-base font-bold text-primary">
                    {mobileCardConfig.renderTitle(row.original)}
                  </div>
                  {enableRowSelection || mobileCardConfig.renderActions ? (
                    <div
                      className="flex shrink-0 items-center gap-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {enableRowSelection ? (
                        <Checkbox
                          aria-label={t("common.selection.selectRow")}
                          checked={row.getIsSelected()}
                          disabled={!row.getCanSelect()}
                          onCheckedChange={(checked) =>
                            row.toggleSelected(checked === true)
                          }
                          onClick={(event) => event.stopPropagation()}
                        />
                      ) : null}
                      {mobileCardConfig.renderActions?.(row.original)}
                    </div>
                  ) : null}
                </div>

                {mobileCardConfig.renderSubtitle ||
                mobileCardConfig.renderStatus ? (
                  <div className="mt-1.5 flex flex-wrap items-start gap-x-2 gap-y-1 text-xs font-medium text-muted-foreground">
                    {mobileCardConfig.renderSubtitle ? (
                      <div className="min-w-0 flex-1 break-words leading-relaxed">
                        {mobileCardConfig.renderSubtitle(row.original)}
                      </div>
                    ) : null}
                    {mobileCardConfig.renderStatus ? (
                      <div className="shrink-0">
                        {mobileCardConfig.renderStatus(row.original)}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 pl-1 text-xs">
                  {mobileCardConfig.fields.map((field, index) => (
                    <div
                      className={cn(
                        "min-w-0",
                        field.fullWidth && "col-span-2",
                        field.className
                      )}
                      key={index}
                    >
                      <div className="text-[11px] uppercase tracking-[0.03em] text-muted-foreground">
                        {field.label}
                      </div>
                      <div className="mt-1 break-words font-semibold text-foreground">
                        {field.render(row.original)}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      ) : null}

      <ScrollArea
        type="auto"
        className={cn(
          "w-full md:flex-none lg:min-h-0 lg:flex-1",
          showMobileCards && "hidden md:block"
        )}
      >
        <table
          className={cn(
            "border-collapse text-sm text-foreground",
            fillWidth && "w-full"
          )}
          style={{ minWidth }}
        >
          <thead className="sticky top-0 z-40">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-secondary">
                {headerGroup.headers.map((header) => {
                  const align = header.column.columnDef.meta?.align ?? "left";
                  const width = header.column.columnDef.meta?.width;
                  const canSort = header.column.getCanSort();
                  const stickyStyle = getStickyLeftStyle(
                    header.column.id,
                    "header"
                  );
                  const headerContent = (
                    <span className="max-h-[2.4em] overflow-hidden break-words leading-[1.2] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </span>
                  );

                  return (
                    <th
                      className={cn(
                        "border-border border-b bg-secondary align-top text-left text-[11px] font-bold uppercase tracking-[0.03em] text-muted-foreground",
                        headerPaddingClass,
                        align === "center" && "text-center",
                        align === "right" && "text-right",
                        stickyStyle &&
                          "sticky after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border"
                      )}
                      key={header.id}
                      style={{
                        ...getColumnWidthStyle(width),
                        ...stickyStyle,
                      }}
                    >
                      {canSort ? (
                        <Button
                          className={cn(
                            "w-full whitespace-normal leading-tight",
                            align === "left" && "justify-start text-left",
                            align === "center" && "justify-center",
                            align === "right" && "justify-end"
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          size="sm"
                          type="button"
                          variant="ghost"
                        >
                          {headerContent}
                          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" />
                        </Button>
                      ) : (
                        <div
                          className={cn(
                            "flex w-full items-center gap-1.5 whitespace-normal leading-tight",
                            align === "center" && "justify-center",
                            align === "right" && "justify-end"
                          )}
                        >
                          {headerContent}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  className="border-input border px-4 py-10 text-center text-muted-foreground"
                  colSpan={table.getAllLeafColumns().length}
                >
                  {t("common.states.loadingRecords")}
                </td>
              </tr>
            ) : tableRows.length === 0 ? (
              <tr>
                <td
                  className="border-input border px-4 py-10 text-center text-muted-foreground"
                  colSpan={table.getAllLeafColumns().length}
                >
                  {resolvedEmptyMessage}
                </td>
              </tr>
            ) : (
              tableRows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    "group relative border-border border-b bg-card hover:bg-accent/30 last:border-b-0",
                    isRowClickable && "cursor-pointer"
                  )}
                  onClick={() => {
                    onRowClick?.(row.original);
                  }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const align = cell.column.columnDef.meta?.align ?? "left";
                    const width = cell.column.columnDef.meta?.width;
                    const noWrap = cell.column.columnDef.meta?.noWrap ?? false;
                    const isNumeric =
                      cell.column.columnDef.meta?.isNumeric ?? false;
                    const stickyStyle = getStickyLeftStyle(
                      cell.column.id,
                      "body"
                    );
                    return (
                      <td
                        className={cn(
                          "relative z-0 bg-card align-middle text-foreground group-hover:bg-accent/30",
                          cellPaddingClass,
                          align === "center" && "text-center",
                          align === "right" && "text-right",
                          noWrap && "whitespace-nowrap",
                          isNumeric && "font-mono tabular-nums",
                          cell.column.columnDef.meta?.cellClassName,
                          stickyStyle &&
                            "sticky overflow-hidden group-hover:bg-accent after:absolute after:right-0 after:top-0 after:h-full after:w-px after:bg-border"
                        )}
                        key={cell.id}
                        style={{
                          ...getColumnWidthStyle(width),
                          ...stickyStyle,
                        }}
                        onClick={
                          nonClickableColumnIds.has(cell.column.id)
                            ? (event) => event.stopPropagation()
                            : undefined
                        }
                      >
                        {cell.column.id === table.getAllLeafColumns()[0]?.id ? (
                          <span
                            className={cn(
                              "absolute left-0 top-0 h-full w-1",
                              getRowAccentClassName?.(row.original)
                            )}
                          />
                        ) : null}
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {showPagination ? paginationFooter : null}
    </div>
  );

  function getStickyLeftStyle(columnId: string, layer: "header" | "body") {
    const leafColumns = table.getAllLeafColumns();
    const columnIndex = leafColumns.findIndex(
      (column) => column.id === columnId
    );
    const column = leafColumns[columnIndex];
    if (!column?.columnDef.meta?.stickyLeft) return undefined;

    const left = leafColumns
      .slice(0, columnIndex)
      .reduce(
        (offset, previousColumn) =>
          offset +
          (typeof previousColumn.columnDef.meta?.width === "number"
            ? previousColumn.columnDef.meta.width
            : 0),
        0
      );

    return {
      left,
      // Keep corner sticky headers pinned under vertical scroll as well.
      ...(layer === "header" ? { top: 0 } : null),
      position: "sticky" as const,
      // Header sticky cells must stay above body sticky cells (z-30).
      zIndex: layer === "header" ? 50 : 30,
    };
  }

  function getColumnWidthStyle(width: number | string | undefined) {
    if (!width) return {};
    return { width, minWidth: typeof width === "number" ? width : undefined };
  }
}

function selectionColumn<TData, TValue>(
  stickyLeft: boolean,
  t: Translate
): ColumnDef<TData, TValue> {
  return {
    id: "select",
    enableSorting: false,
    header: ({ table }) => {
      const allSelected = table.getIsAllPageRowsSelected();
      const someSelected = table.getIsSomePageRowsSelected();
      return (
        <Checkbox
          aria-label={t("common.selection.selectAllRowsOnPage")}
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={(checked) =>
            table.toggleAllPageRowsSelected(checked === true)
          }
        />
      );
    },
    cell: ({ row }: { row: Row<TData> }) => (
      <Checkbox
        aria-label={t("common.selection.selectRow")}
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
        onClick={(event) => event.stopPropagation()}
      />
    ),
    meta: { width: 40, align: "center", stickyLeft },
  };
}
