import { ReactNode, useState } from "react";
import { startOfMonth } from "date-fns";
import { useTranslations } from "next-intl";
import { AppDrawer } from "@/components/app-drawer";
import { AppField } from "@/components/app-field";
import { MonthPicker } from "@/components/calendar/month-picker";
import { toast } from "sonner";

type AddNewCatalogDrawerProps = {
  children: ReactNode;
};

export function CreateNewDetailContractDrawer({
  children,
}: AddNewCatalogDrawerProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [monthPeriod, setMonthPeriod] = useState<Date | undefined>();
  const [monthPeriodError, setMonthPeriodError] = useState<string>();

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setMonthPeriod(undefined);
      setMonthPeriodError(undefined);
    }
    setOpen(nextOpen);
  };

  const handleCancel = () => {
    setMonthPeriod(undefined);
    setMonthPeriodError(undefined);
    setOpen(false);
  };

  const handleCreate = () => {
    if (!monthPeriod) {
      setMonthPeriodError(t("forms.catalog.monthPeriodRequired"));
      return;
    }
    toast.success(t("forms.catalog.catalogCreated"), {
      description: t("forms.catalog.catalogCreatedDescription"),
    });
    setMonthPeriod(undefined);
    setMonthPeriodError(undefined);
    setOpen(false);
  };

  return (
    <AppDrawer
      open={open}
      onOpenChange={handleOpenChange}
      title={t("forms.catalog.createTitle")}
      trigger={children}
      size="sm"
      secondaryAction={{
        closeOnClick: true,
        label: t("common.actions.cancel"),
        onClick: handleCancel,
        variant: "outline",
        icon: "cross",
      }}
      primaryAction={{
        label: t("common.actions.create"),
        icon: "plus",
        onClick: handleCreate,
      }}
    >
      <div className="space-y-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-2">
          <AppField label="Catalog Type" required>
            <div className="flex h-9 items-center text-sm font-medium text-foreground">
              Contract Price
            </div>
          </AppField>

          <AppField label="Contract Type">
            <div className="flex h-9 items-center text-sm font-medium text-foreground">
              SGM
            </div>
          </AppField>

          <AppField label="Customer">
            <div className="flex h-9 items-center text-sm font-medium text-foreground">
              0010668215
            </div>
          </AppField>

          <AppField label="Store">
            <div className="flex h-9 items-center text-sm font-medium text-foreground">
              1
            </div>
          </AppField>
        </div>

        <AppField label="Charge">
          <div className="flex h-9 items-center text-sm font-medium text-foreground">
            0
          </div>
        </AppField>

        <AppField
          htmlFor="monthPeriod"
          label={t("forms.catalog.monthPeriod")}
          required
          error={monthPeriodError}
        >
          <MonthPicker
            value={monthPeriod}
            onChange={(value) => {
              setMonthPeriod(value);
              if (value) setMonthPeriodError(undefined);
            }}
            placeholder="MMM yyyy"
            disabled={(date) => date < startOfMonth(new Date())}
          />
        </AppField>
      </div>
    </AppDrawer>
  );
}
