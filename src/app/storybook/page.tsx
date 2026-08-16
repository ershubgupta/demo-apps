"use client";

import { useState, type ReactNode } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  DownloadIcon,
  MoreHorizontalIcon,
  PlusIcon,
  SearchIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";

import { ActionsMenu } from "@/components/actions-menu";
import { AppBadge, type AppBadgeVariant } from "@/components/app-badge";
import { AppDrawer } from "@/components/app-drawer";
import { AppDropdown } from "@/components/app-dropdown";
import { AppField } from "@/components/app-field";
import { AppTooltip } from "@/components/app-tooltip";
import { DataTable } from "@/components/data-table/data-table";
import { AppErrorState } from "@/components/error-state";
import { FileUploadDialog } from "@/components/file-uploader/file-upload-dialog";
import { FileUploader } from "@/components/file-uploader/file-uploader";
import { PrioritySequence } from "@/components/priority-sequence/priority-sequence";
import { Tabs, type Tab } from "@/components/tabs/tabs";
import { TabActions } from "@/components/tabs/tab-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { AppInput } from "@/components/app-input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils/cnName";
import { DatePicker } from "@/components/calendar/date-picker";
import { DateRange } from "react-day-picker";
import { MonthPicker } from "@/components/calendar/month-picker";
import { startOfMonth } from "date-fns";

const statusVariants: AppBadgeVariant[] = [
  "neutral",
  "primary",
  "info",
  "success",
  "warning",
  "danger",
];

const dropdownOptions = [
  { label: "Draft", value: "draft" },
  { label: "Preview", value: "preview" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired", disabled: true },
];

const comboboxOptions = [
  {
    label: "Modern Trade",
    value: "modern-trade",
    description: "National store master sequence",
  },
  {
    label: "General Trade",
    value: "general-trade",
    description: "Regional catalog pricing",
  },
  {
    label: "E-commerce",
    value: "ecommerce",
    description: "Marketplace catalog list",
  },
];

type StoryTab = "items" | "customers" | "settings";

const storyTabs: Tab<StoryTab>[] = [
  { key: "items", label: "Items", count: 128, panelId: "story-tab-items" },
  {
    key: "customers",
    label: "Customers",
    count: 24,
    panelId: "story-tab-customers",
  },
  { key: "settings", label: "Settings", panelId: "story-tab-settings" },
];

type StoryCatalog = {
  id: string;
  name: string;
  status: "Draft" | "Preview" | "Active";
  items: number;
};

const tableRows: StoryCatalog[] = [
  {
    id: "cat-001",
    name: "North Zone Price List",
    status: "Active",
    items: 248,
  },
  { id: "cat-002", name: "Festival Draft", status: "Draft", items: 96 },
  {
    id: "cat-003",
    name: "Modern Trade Preview",
    status: "Preview",
    items: 132,
  },
];

const tableColumns: ColumnDef<StoryCatalog>[] = [
  { accessorKey: "name", header: "Catalog" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <AppBadge
        showDot
        variant={
          row.original.status === "Active"
            ? "success"
            : row.original.status === "Draft"
              ? "warning"
              : "info"
        }
      >
        {row.original.status}
      </AppBadge>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    meta: { align: "right", isNumeric: true },
  },
];

export default function StoryBookPage() {
  const [checked, setChecked] = useState(true);
  const [radioValue, setRadioValue] = useState("preview");
  const [dropdownValue, setDropdownValue] = useState("preview");
  const [comboboxValue, setComboboxValue] = useState("General Trade");
  const [activeTab, setActiveTab] = useState<StoryTab>("items");
  const activePanelId = storyTabs.find((tab) => tab.key === activeTab)?.panelId;
  const [singleDate, setSingleDate] = useState<Date>();
  const [dateRange, setDateRange] = useState<DateRange>();
  const [month, setMonth] = useState<Date>();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerCatalogType, setDrawerCatalogType] = useState("ho");
  const [drawerComboboxValue, setDrawerComboboxValue] =
    useState("General Trade");
  const [drawerIncludeInactive, setDrawerIncludeInactive] = useState(false);
  const [drawerDate, setDrawerDate] = useState<Date>();

  return (
    <main className="min-h-screen bg-background px-6 py-8 text-foreground lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">Internal UI Kit</p>
          <h1 className="text-3xl font-bold tracking-normal">Storybook</h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            App-level primitives with catalog admin defaults. Controls use 36px
            as the default field height and still accept size, variant, and
            className overrides for local needs.
          </p>
        </header>

        <StorySection
          title="Foundations"
          description="Buttons, icon buttons, and text input defaults."
        >
          <StoryCard title="Buttons">
            <div className="flex flex-wrap items-center gap-3">
              <Button>
                <PlusIcon />
                Default
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Destructive</Button>
              <Button disabled>Disabled</Button>
              <Button size="sm" variant="outline">
                Compact
              </Button>
            </div>
          </StoryCard>

          <StoryCard title="Icon Buttons">
            <div className="flex flex-wrap items-center gap-3">
              <Button aria-label="Search" size="icon" variant="outline">
                <SearchIcon />
              </Button>
              <Button aria-label="More options" size="icon" variant="ghost">
                <MoreHorizontalIcon />
              </Button>
              <Button aria-label="Download" size="icon-sm" variant="secondary">
                <DownloadIcon />
              </Button>
            </div>
          </StoryCard>

          <StoryCard title="Inputs">
            <div className="grid gap-3 sm:grid-cols-2">
              <AppInput placeholder="Catalog name" />
              <AppInput aria-invalid placeholder="Invalid field" />
              <AppInput disabled placeholder="Disabled field" />
              <AppInput disabled placeholder="Disabled compact field" />
              <AppInput value="Read-only catalog" readOnly />
            </div>
          </StoryCard>

          <StoryCard title="Date Picker">
            <div className="grid gap-3 sm:grid-cols-2">
              <DatePicker
                mode="single"
                placeholder="Select date"
                value={singleDate}
                onChange={setSingleDate}
              />

              <DatePicker
                mode="range"
                placeholder="Select period"
                value={dateRange}
                onChange={setDateRange}
              />

              <MonthPicker
                placeholder="Select month"
                value={month}
                onChange={setMonth}
                disabled={(date) => date < startOfMonth(new Date())}
              />
            </div>
          </StoryCard>
        </StorySection>

        <StorySection
          title="Selection"
          description="Reusable app wrappers for common form selection controls."
        >
          <StoryCard title="Checkbox">
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm font-medium">
                <Checkbox
                  checked={checked}
                  onCheckedChange={(nextChecked) =>
                    setChecked(nextChecked === true)
                  }
                />
                Include inactive catalogs
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Checkbox disabled />
                Disabled option
              </label>
            </div>
          </StoryCard>

          <StoryCard title="Radio Group">
            <RadioGroup value={radioValue} onValueChange={setRadioValue}>
              {dropdownOptions.slice(0, 3).map((option) => (
                <label
                  className="flex items-center gap-2 text-sm font-medium"
                  key={option.value}
                >
                  <RadioGroupItem value={option.value} />
                  {option.label}
                </label>
              ))}
            </RadioGroup>
          </StoryCard>

          <StoryCard title="Dropdown">
            <div className="grid gap-3 sm:grid-cols-2">
              <AppDropdown
                options={dropdownOptions}
                value={dropdownValue}
                onValueChange={setDropdownValue}
              />
              <AppDropdown
                invalid
                options={dropdownOptions}
                placeholder="Invalid dropdown"
              />
              <AppDropdown disabled options={dropdownOptions} value="draft" />
              <AppDropdown options={dropdownOptions} value="active" />
            </div>
          </StoryCard>

          <StoryCard title="Combobox">
            <div className="grid gap-3 sm:grid-cols-2">
              <StoryCombobox
                value={comboboxValue}
                onValueChange={setComboboxValue}
              />
              <StoryCombobox placeholder="Invalid combobox" invalid />
              <StoryCombobox value="E-commerce" disabled />
              <StoryCombobox value="Modern Trade" />
            </div>
          </StoryCard>
        </StorySection>

        <StorySection
          title="Feedback"
          description="Base badges and app semantic badges."
        >
          <StoryCard title="Badge">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </StoryCard>

          <StoryCard title="AppBadge">
            <div className="flex flex-wrap gap-2">
              {statusVariants.map((variant) => (
                <AppBadge key={variant} showDot variant={variant}>
                  {variant}
                </AppBadge>
              ))}
            </div>
          </StoryCard>

          <StoryCard title="Error State">
            <AppErrorState
              description="The catalog could not be loaded. Try again after checking the network."
              onRetry={() => undefined}
              title="Failed to load catalog details."
            />
          </StoryCard>
        </StorySection>

        <StorySection
          title="App Components"
          description="Custom reusable components from the app component layer."
        >
          <StoryCard title="Tooltip">
            <div className="flex flex-wrap items-center gap-3">
              <AppTooltip content="Default tooltip content">
                <Button type="button" variant="outline">
                  Default
                </Button>
              </AppTooltip>
              <AppTooltip content="Icon tooltip" variant="icon">
                <Button
                  aria-label="Search with tooltip"
                  size="icon"
                  variant="secondary"
                >
                  <SearchIcon />
                </Button>
              </AppTooltip>
              <AppTooltip content="Sidebar tooltip" variant="sidebar">
                <Button type="button" variant="ghost">
                  Sidebar
                </Button>
              </AppTooltip>
            </div>
          </StoryCard>

          <StoryCard title="Actions Menu">
            <ActionsMenu
              actions={[
                {
                  label: "Add item",
                  icon: <PlusIcon />,
                  onSelect: () => setDrawerOpen(true),
                },
                { label: "Upload price list", icon: <UploadIcon /> },
                { label: "Export all", icon: <DownloadIcon /> },
                {
                  label: "Delete all",
                  icon: <Trash2Icon />,
                  variant: "destructive",
                  separatorBefore: true,
                },
              ]}
              ariaLabel="Story actions menu"
            />
          </StoryCard>

          <StoryCard title="Priority Sequence">
            <PrioritySequence
              maxVisibleItems={3}
              items={[
                { label: "1", value: "North" },
                { label: "2", value: "West" },
                { label: "3", value: "South" },
                { label: "4", value: "East" },
              ]}
            />
          </StoryCard>

          <StoryCard title="AppDrawer">
            <Button type="button" onClick={() => setDrawerOpen(true)}>
              <PlusIcon />
              Open drawer
            </Button>
            <AppDrawer
              open={drawerOpen}
              onOpenChange={setDrawerOpen}
              size="md"
              title="Create Catalog"
              secondaryAction={{
                closeOnClick: true,
                icon: "cross",
                label: "Cancel",
                variant: "outline",
                onClick: () => setDrawerOpen(false),
              }}
              primaryAction={{
                icon: "tick",
                label: "Save",
                onClick: () => setDrawerOpen(false),
              }}
            >
              <div className="flex flex-col gap-6">
                <AppInput
                  label="Catalog name"
                  placeholder="North Zone Price List"
                />

                <AppDropdown
                  options={dropdownOptions}
                  value={dropdownValue}
                  onValueChange={setDropdownValue}
                  label="Status"
                />

                <AppField className="space-y-2" label="Catalog type">
                  <RadioGroup
                    value={drawerCatalogType}
                    onValueChange={setDrawerCatalogType}
                  >
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <RadioGroupItem value="ho" />
                      Catalog HO
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <RadioGroupItem value="store" />
                      Catalog Store
                    </label>
                  </RadioGroup>
                </AppField>

                <AppField label="Customer group">
                  <Combobox
                    items={comboboxOptions.map((option) => option.label)}
                    value={drawerComboboxValue}
                    onValueChange={(nextValue) =>
                      setDrawerComboboxValue(nextValue ?? "")
                    }
                  >
                    <ComboboxInput
                      placeholder="Select customer group"
                      showClear
                    />
                    <ComboboxContent>
                      <ComboboxEmpty>No customer groups found.</ComboboxEmpty>
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                    </ComboboxContent>
                  </Combobox>
                </AppField>

                <DatePicker
                  mode="single"
                  placeholder="Select effective date"
                  value={drawerDate}
                  onChange={setDrawerDate}
                  label="Effective date"
                />

                <label className="flex items-center gap-2 text-sm font-medium">
                  <Checkbox
                    checked={drawerIncludeInactive}
                    onCheckedChange={(nextChecked) =>
                      setDrawerIncludeInactive(nextChecked === true)
                    }
                  />
                  Include inactive catalogs
                </label>
              </div>
            </AppDrawer>
          </StoryCard>

          <StoryCard title="File Upload Dialog">
            <FileUploadDialog
              title="Import Catalog Item Price List"
              onUpload={async () => {
                await new Promise((resolve) => window.setTimeout(resolve, 600));
              }}
            />
          </StoryCard>

          <StoryCard className="sm:col-span-2" title="Inline File Uploader">
            <FileUploader
              multiple
              onUpload={async () => {
                await new Promise((resolve) => window.setTimeout(resolve, 600));
              }}
              uploadLabel="Choose catalog import file"
            />
          </StoryCard>
        </StorySection>

        <StorySection
          title="Data"
          description="Table component with app badges and built-in pagination controls."
        >
          <StoryCard className="sm:col-span-2" title="DataTable">
            <DataTable
              columns={tableColumns}
              data={tableRows}
              density="compact"
              enableRowSelection
              fillWidth
              initialPageSize={3}
              minWidth={640}
              mobileCard={{
                renderTitle: (catalog) => catalog.name,
                renderStatus: (catalog) => (
                  <AppBadge
                    showDot
                    variant={
                      catalog.status === "Active"
                        ? "success"
                        : catalog.status === "Draft"
                          ? "warning"
                          : "info"
                    }
                  >
                    {catalog.status}
                  </AppBadge>
                ),
                fields: [
                  { label: "Items", render: (catalog) => catalog.items },
                ],
              }}
            />
          </StoryCard>
        </StorySection>

        <StorySection
          title="Navigation"
          description="Tabs and tab-level bulk actions."
        >
          <StoryCard className="sm:col-span-2" title="Tabs">
            <Tabs
              active={activeTab}
              actions={
                <TabActions
                  actionsMenu={
                    <ActionsMenu
                      actions={[
                        { label: "Import", icon: <PlusIcon /> },
                        { label: "Export all", icon: <DownloadIcon /> },
                        {
                          label: "Delete all",
                          icon: <Trash2Icon />,
                          variant: "destructive",
                        },
                      ]}
                      ariaLabel="Story tab actions"
                    />
                  }
                  onDeleteSelected={() => undefined}
                  onExport={() => undefined}
                  selectedCount={3}
                />
              }
              getTabId={(tab) => `story-tab-${tab}`}
              onChange={setActiveTab}
              tabs={storyTabs}
            />
            <div
              aria-labelledby={`story-tab-${activeTab}`}
              className="mt-4 rounded-lg border border-border bg-secondary p-4 text-sm text-muted-foreground"
              id={activePanelId}
              role="tabpanel"
            >
              Active tab:{" "}
              <span className="font-semibold text-foreground">{activeTab}</span>
            </div>
          </StoryCard>
        </StorySection>
      </div>
    </main>
  );
}

function StoryCombobox({
  disabled,
  inputClassName,
  invalid,
  onValueChange,
  placeholder = "Select framework",
  value,
}: {
  disabled?: boolean;
  inputClassName?: string;
  invalid?: boolean;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  value?: string;
}) {
  return (
    <Combobox
      items={comboboxOptions.map((option) => option.label)}
      value={value ?? null}
      onValueChange={(nextValue) => onValueChange?.(nextValue ?? "")}
    >
      <ComboboxInput
        aria-invalid={invalid || undefined}
        className={inputClassName}
        disabled={disabled}
        placeholder={placeholder}
        showClear
      />
      <ComboboxContent>
        <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function StorySection({
  children,
  description,
  title,
}: {
  children: ReactNode;
  description: string;
  title: string;
}) {
  return (
    <section className="space-y-4 mt-4">
      <div>
        <h2 className="text-xl font-semibold tracking-normal">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function StoryCard({
  children,
  className,
  title,
}: {
  children: ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm",
        className
      )}
    >
      <h3 className="mb-3 text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}
