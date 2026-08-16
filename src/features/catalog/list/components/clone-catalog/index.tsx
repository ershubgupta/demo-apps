"use client";

import { ReactNode, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { AppDrawer } from "@/components/app-drawer";
import { AppField } from "@/components/app-field";
import { AppInput } from "@/components/app-input";
import { Checkbox } from "@/components/ui/checkbox";
import type { DateRange } from "react-day-picker";
import { DatePicker } from "@/components/calendar/date-picker";
import type { Catalog } from "@/features/catalog-ho/types";
import { isBeforeToday } from "@/lib/utils/date-format";
import { useTranslations } from "next-intl";

type CloneCatalogDrawerProps = {
  children?: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  catalog: Catalog | null;
};

type CloneCatalogForm = {
  charge: number;
  periodDate?: DateRange;
  item: boolean;
  customer: boolean;
};

export function CloneCatalogDrawer({
  children,
  open,
  onOpenChange,
  catalog,
}: CloneCatalogDrawerProps) {
  const t = useTranslations();
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CloneCatalogForm & { cloneSelection?: boolean }>({
    defaultValues: {
      charge: 0,
      periodDate: undefined,
      item: false,
      customer: false,
    },
  });

  useEffect(() => {
    if (!catalog || !open) return;

    reset({
      charge: catalog.charge,
      periodDate: undefined,
      item: false,
      customer: false,
    });

    clearErrors();
  }, [catalog, open, reset, clearErrors]);

  const validateCloneSelection = (item: boolean, customer: boolean) => {
    if (!item && !customer) {
      setError("cloneSelection", {
        type: "manual",
        message: t("forms.catalog.selectItemOrCustomer"),
      });
      return false;
    }

    clearErrors("cloneSelection");
    return true;
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
    clearErrors("cloneSelection");
  };

  const onSubmit = (values: CloneCatalogForm) => {
    if (!validateCloneSelection(values.item, values.customer)) {
      return;
    }
    try {
      console.log(values);
      toast.success(t("forms.catalog.catalogCloned"), {
        description: t("forms.catalog.catalogClonedDescription"),
      });
      reset();
      onOpenChange(false);
      clearErrors("cloneSelection");
    } catch (error) {
      console.error(error);
    }
  };

  const trigger = children;

  const renderCloneOption = (
    name: "item" | "customer",
    label: string,
    getSelection: (checked: boolean) => [boolean, boolean]
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            checked={field.value}
            onCheckedChange={(checked: boolean) => {
              field.onChange(checked);
              const [item, customer] = getSelection(checked);
              validateCloneSelection(item, customer);
            }}
            id={`clone-${name}`}
          />
          <span className="text-sm">{label}</span>
        </label>
      )}
    />
  );

  return (
    <AppDrawer
      open={open}
      onOpenChange={onOpenChange}
      trigger={trigger}
      title={t("forms.catalog.catalogMaster")}
      primaryAction={{
        type: "submit",
        form: "clone-catalog-form",
        label: (
          <>
            <Plus className="h-4 w-4" />
            {t("forms.catalog.clone")}
          </>
        ),
      }}
      secondaryAction={{
        label: (
          <>
            <X className="h-4 w-4" />
            {t("common.actions.cancel")}
          </>
        ),
        variant: "outline",
        closeOnClick: true,
        onClick: handleCancel,
      }}
    >
      <form
        id="clone-catalog-form"
        className="flex h-full flex-col"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-6">
            <AppField
              label={t("common.fields.charge")}
              required
              error={errors.charge?.message as string | undefined}
            >
              <Controller
                control={control}
                name="charge"
                rules={{
                  required: t("forms.catalog.chargeRequired"),
                  min: {
                    value: -99,
                    message: t("forms.catalog.chargeRange"),
                  },
                  max: {
                    value: 99,
                    message: t("forms.catalog.chargeRange"),
                  },
                }}
                render={({ field }) => (
                  <AppInput
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    type="number"
                    min={0}
                    step={1}
                  />
                )}
              />
            </AppField>

            <AppField
              label={t("details.catalog.periodDate")}
              required
              error={errors.periodDate?.message as string | undefined}
            >
              <Controller
                control={control}
                name="periodDate"
                rules={{
                  required: t("forms.catalog.periodRequired"),
                  validate: (value) => {
                    if (!value?.to) return true;

                    const lastDay = new Date(
                      value.to.getFullYear(),
                      value.to.getMonth() + 1,
                      0
                    );

                    return (
                      value.to.getDate() === lastDay.getDate() ||
                      t("forms.catalog.monthEndRequired")
                    );
                  },
                }}
                render={({ field }) => (
                  <DatePicker
                    mode="range"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={t("forms.catalog.selectPeriod")}
                    calendarProps={{
                      disabled: isBeforeToday,
                    }}
                  />
                )}
              />
            </AppField>

            <AppField
              label={t("forms.catalog.cloneOptions")}
              error={errors.cloneSelection?.message as string | undefined}
            >
              <div className="flex items-center gap-4">
                {renderCloneOption(
                  "item",
                  t("common.fields.item"),
                  (checked) => [checked, getValues("customer")]
                )}

                {renderCloneOption(
                  "customer",
                  t("common.fields.customer"),
                  (checked) => [getValues("item"), checked]
                )}
              </div>
            </AppField>
          </div>
        </div>
      </form>
    </AppDrawer>
  );
}
