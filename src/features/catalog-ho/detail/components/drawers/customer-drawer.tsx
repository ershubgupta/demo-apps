"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AppDrawer } from "@/components/app-drawer";
import { AppInput } from "@/components/app-input";
import { cn } from "@/lib/utils/cnName";
import { useTranslations } from "next-intl";

type AddCatalogCustomerFormValues = {
  cvCode: string;
  mmid: string;
};

const emptyDefaults: AddCatalogCustomerFormValues = {
  cvCode: "",
  mmid: "",
};

type CustomerDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
};

export function CustomerDrawer({
  open,
  onOpenChange,
  canEdit,
}: CustomerDrawerProps) {
  const t = useTranslations();
  const form = useForm<AddCatalogCustomerFormValues>({
    defaultValues: emptyDefaults,
    mode: "onBlur",
    reValidateMode: "onBlur",
  });

  useEffect(() => {
    if (open) form.reset(emptyDefaults);
  }, [open, form]);

  const onSubmit = (values: AddCatalogCustomerFormValues) => {
    console.info("Add catalog customer", { values });
    toast.success(t("details.drawers.customerAdded"), {
      description: t("details.drawers.customerAddedDescription"),
    });
    onOpenChange(false);
  };

  const formId = "addCatalogCustomerForm";
  const formErrors = form.formState.errors;

  return (
    <AppDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("details.drawers.addCustomer")}
      size="md"
      secondaryAction={{
        closeOnClick: true,
        label: t("common.actions.cancel"),
        onClick: () => onOpenChange(false),
        variant: "outline",
        icon: "cross",
      }}
      primaryAction={{
        className: cn(!canEdit && "hidden"),
        form: formId,
        label: t("details.drawers.save"),
        icon: "plus",
        type: "submit",
      }}
    >
      <form
        id={formId}
        className="flex flex-col gap-6"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <AppInput
          id="customerCvCode"
          aria-invalid={!!formErrors.cvCode}
          {...form.register("cvCode", {
            required: t("details.drawers.cvCodeRequired"),
            validate: (value) =>
              value.trim().length === 10 || t("details.drawers.cvCodeInvalid"),
          })}
          error={formErrors.cvCode?.message}
          label={t("common.fields.cvCode")}
          required
        />

        <AppInput
          id="customerMmid"
          aria-invalid={!!formErrors.mmid}
          {...form.register("mmid", {
            required: t("details.drawers.mmidRequired"),
            validate: (value) =>
              value.trim().length === 14 || t("details.drawers.mmidInvalid"),
          })}
          error={formErrors.mmid?.message}
          label={t("common.fields.mmid")}
          required
        />
      </form>
    </AppDrawer>
  );
}
