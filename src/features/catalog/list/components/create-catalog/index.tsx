"use client";

import { ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { DateRange } from "react-day-picker";

import { AppDrawer } from "@/components/app-drawer";
import { AppField } from "@/components/app-field";
import { AppInput } from "@/components/app-input";
import { StoreMasterListField } from "./draggable-store-list";
import { StoreMasterItem } from "@/features/catalog-ho/types";
import { DatePicker } from "@/components/calendar/date-picker";
import { isBeforeToday } from "@/lib/utils/date-format";
import { useTranslations } from "next-intl";

type AddNewCatalogDrawerProps = {
  children: ReactNode;
};

type AddCatalogForm = {
  charge: number;
  storeMasterList: StoreMasterItem[];
  periodDate?: DateRange;
  priceStartDate?: Date;
  priceEndDate?: Date;
};

export function AddNewCatalogDrawer({ children }: AddNewCatalogDrawerProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const formId = "createCatalogForm";

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitted },
  } = useForm<AddCatalogForm>({
    defaultValues: {
      charge: 0,
      storeMasterList: [],
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) reset();
    setOpen(nextOpen);
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (values: AddCatalogForm) => {
    try {
      console.log(values);
      toast.success(t("forms.catalog.catalogCreated"), {
        description: t("forms.catalog.catalogCreatedDescription"),
      });
      reset();
      setOpen(false);
    } catch (error) {
      toast.error(t("forms.catalog.unableToCreate"), {
        description:
          error instanceof Error
            ? error.message
            : t("forms.catalog.checkDetails"),
      });
    }
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
        form: formId,
        label: t("common.actions.create"),
        icon: "plus",
        type: "submit",
      }}
    >
      <form
        id={formId}
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-2 gap-4">
          <AppField label={t("forms.catalog.catalogType")} required>
            <div className="flex h-9 items-center text-sm font-medium text-foreground">
              {t("forms.catalog.catalogHo")}
            </div>
          </AppField>

          <AppInput
            type="number"
            {...register("charge", {
              required: t("forms.catalog.chargeRequired"),
              valueAsNumber: true,
              min: {
                value: -99,
                message: t("forms.catalog.chargeRange"),
              },
              max: {
                value: 99,
                message: t("forms.catalog.chargeRange"),
              },
            })}
            error={errors.charge?.message}
            label={t("common.fields.charge")}
            required
          />
        </div>

        <Controller
          control={control}
          name="storeMasterList"
          rules={{
            validate: (value) =>
              value.length > 0 || t("forms.catalog.storeMasterListRequired"),
          }}
          render={({ field, fieldState }) => (
            <StoreMasterListField
              value={field.value}
              onChange={field.onChange}
              error={fieldState.error?.message}
              showValidation={isSubmitted}
            />
          )}
        />

        <AppField
          label={t("details.catalog.periodDate")}
          required
          error={errors.periodDate?.message}
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

        <div className="grid grid-cols-2 gap-4">
          <AppField
            label={t("common.fields.priceStartDate")}
            error={errors.priceStartDate?.message}
          >
            <Controller
              control={control}
              name="priceStartDate"
              rules={{
                validate: (value, formValues) => {
                  if (!value || !formValues.priceEndDate) return true;

                  return (
                    value.getTime() <= formValues.priceEndDate.getTime() ||
                    t("forms.catalog.startBeforeEnd")
                  );
                },
              }}
              render={({ field }) => (
                <DatePicker
                  placeholder={t("forms.catalog.startDate")}
                  mode="single"
                  value={field.value}
                  onChange={field.onChange}
                  calendarProps={{
                    disabled: isBeforeToday,
                  }}
                />
              )}
            />
          </AppField>

          <AppField
            label={t("common.fields.priceEndDate")}
            error={errors.priceEndDate?.message}
          >
            <Controller
              control={control}
              name="priceEndDate"
              rules={{
                validate: (value, formValues) => {
                  if (!value) return true;

                  if (
                    formValues.priceStartDate &&
                    value.getTime() < formValues.priceStartDate.getTime()
                  ) {
                    return t("forms.catalog.endOnOrAfterStart");
                  }

                  const lastDay = new Date(
                    value.getFullYear(),
                    value.getMonth() + 1,
                    0
                  );

                  return (
                    value.getDate() === lastDay.getDate() ||
                    t("forms.catalog.monthEndRequired")
                  );
                },
              }}
              render={({ field }) => (
                <DatePicker
                  placeholder={t("forms.catalog.endDate")}
                  mode="single"
                  value={field.value}
                  onChange={field.onChange}
                  calendarProps={{
                    disabled: isBeforeToday,
                  }}
                />
              )}
            />
          </AppField>
        </div>
      </form>
    </AppDrawer>
  );
}
