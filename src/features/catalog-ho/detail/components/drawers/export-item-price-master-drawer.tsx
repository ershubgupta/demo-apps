"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { AppDropdown } from "@/components/app-dropdown";
import { AppDrawer } from "@/components/app-drawer";
import { Button } from "@/components/ui/button";
import { AppInput } from "@/components/app-input";
import { useTranslations } from "next-intl";
import type { Translate } from "@/i18n/types";

type ExportItemPriceMasterFormValues = {
  buyerId: string;
  group: string;
  department: string;
  classNo: string;
  subclass: string;
};

const emptyDefaults: ExportItemPriceMasterFormValues = {
  buyerId: "",
  group: "",
  department: "",
  classNo: "",
  subclass: "",
};

const groupOptions = ["All groups", "Grocery", "Fresh", "Non food"];
const departmentOptions = ["All departments", "16", "17", "18"];
const classOptions = ["All classes", "100", "200", "300"];
const subclassOptions = ["All subclasses", "1001", "2001", "3001"];
const exportDelayMs = 900;

type ExportItemPriceMasterDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ExportItemPriceMasterDrawer({
  open,
  onOpenChange,
}: ExportItemPriceMasterDrawerProps) {
  const t = useTranslations();
  const form = useForm<ExportItemPriceMasterFormValues>({
    defaultValues: emptyDefaults,
  });
  const { handleSubmit, register, reset, setValue, watch } = form;
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (open) {
      reset(emptyDefaults);
      setIsExporting(false);
    }
  }, [open, reset]);

  const onSubmit = async (values: ExportItemPriceMasterFormValues) => {
    setIsExporting(true);
    await new Promise((resolve) => window.setTimeout(resolve, exportDelayMs));
    setIsExporting(false);
    onOpenChange(false);

    const toastId = toast.success(t("details.drawers.exportReady"), {
      description: t("details.drawers.exportReadyDescription"),
      duration: Infinity,
      action: {
        label: t("common.actions.download"),
        onClick: () => {
          console.info("Download catalog item price master export", values);
          toast.dismiss(toastId);
        },
      },
    });
  };
  const formId = "exportItemPriceMasterForm";
  const group = watch("group");
  const department = watch("department");
  const classNo = watch("classNo");
  const subclass = watch("subclass");

  const resetExportForm = () => {
    reset(emptyDefaults);
  };

  const handleGroupChange = (value: string) => {
    setValue("group", value, { shouldDirty: true });
    setValue("department", "", { shouldDirty: true });
    setValue("classNo", "", { shouldDirty: true });
    setValue("subclass", "", { shouldDirty: true });
  };

  const handleDepartmentChange = (value: string) => {
    setValue("department", value, { shouldDirty: true });
    setValue("classNo", "", { shouldDirty: true });
    setValue("subclass", "", { shouldDirty: true });
  };

  const handleClassChange = (value: string) => {
    setValue("classNo", value, { shouldDirty: true });
    setValue("subclass", "", { shouldDirty: true });
  };

  const handleSubclassChange = (value: string) => {
    setValue("subclass", value, { shouldDirty: true });
  };

  return (
    <AppDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t("details.drawers.downloadCatalogItemPrice")}
      size="md"
      headerExtra={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-4 top-4 text-app-muted-foreground hover:text-app-foreground"
          aria-label={t("details.drawers.closeDrawer")}
          disabled={isExporting}
          onClick={() => onOpenChange(false)}
        >
          <X />
        </Button>
      }
      secondaryAction={{
        label: t("common.actions.reset"),
        disabled: isExporting,
        onClick: resetExportForm,
        variant: "outline",
        icon: "update",
      }}
      primaryAction={{
        disabled: isExporting,
        form: formId,
        label: isExporting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t("details.drawers.exporting")}
          </span>
        ) : (
          t("details.drawers.searchExport")
        ),
        icon: isExporting ? undefined : "download",
        type: "submit",
      }}
    >
      <form
        id={formId}
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-4">
          <AppInput
            id="exportBuyerId"
            placeholder={t("details.drawers.buyerName")}
            disabled={isExporting}
            {...register("buyerId")}
            label={t("details.drawers.buyerId")}
            wrapperClassName="w-full"
          />
          <DrawerSelectField
            label={t("details.drawers.group")}
            value={group}
            options={groupOptions}
            disabled={isExporting}
            onValueChange={handleGroupChange}
            onClear={() => handleGroupChange("")}
            t={t}
          />
          <DrawerSelectField
            label={t("common.fields.department")}
            value={department}
            options={departmentOptions}
            disabled={isExporting || !group}
            onValueChange={handleDepartmentChange}
            onClear={() => handleDepartmentChange("")}
            t={t}
          />
          <DrawerSelectField
            label={t("details.drawers.class")}
            value={classNo}
            options={classOptions}
            disabled={isExporting || !department}
            onValueChange={handleClassChange}
            onClear={() => handleClassChange("")}
            t={t}
          />
          <DrawerSelectField
            label={t("details.drawers.subclass")}
            value={subclass}
            options={subclassOptions}
            disabled={isExporting || !classNo}
            onValueChange={handleSubclassChange}
            onClear={() => handleSubclassChange("")}
            t={t}
          />
        </div>
      </form>
    </AppDrawer>
  );
}

function DrawerSelectField({
  label,
  value,
  options,
  disabled,
  onValueChange,
  onClear,
  t,
}: {
  label: string;
  value: string;
  options: string[];
  disabled?: boolean;
  onValueChange: (value: string) => void;
  onClear: () => void;
  t: Translate;
}) {
  return (
    <div className="relative w-full">
      <AppDropdown
        disabled={disabled}
        options={options.map((option) => ({
          label: getOptionLabel(option, t),
          value: option,
        }))}
        placeholder={t("common.filters.select")}
        triggerClassName={value ? "pr-9 [&>svg]:hidden" : undefined}
        value={value}
        onValueChange={onValueChange}
        label={label}
        wrapperClassName="w-full"
      />
      {value && !disabled ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          className="absolute right-2 top-[30px] text-app-muted-foreground hover:text-app-foreground"
          aria-label={t("details.drawers.clearNamed", { label })}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onClear();
          }}
        >
          <X />
        </Button>
      ) : null}
    </div>
  );
}

function getOptionLabel(option: string, t: Translate) {
  const keys: Record<string, string> = {
    "All groups": "details.drawers.allGroups",
    Grocery: "details.drawers.grocery",
    Fresh: "details.drawers.fresh",
    "Non food": "details.drawers.nonFood",
    "All departments": "details.drawers.allDepartments",
    "All classes": "details.drawers.allClasses",
    "All subclasses": "details.drawers.allSubclasses",
  };
  return keys[option] ? t(keys[option]) : option;
}
