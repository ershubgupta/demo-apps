"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";

import { AppDrawer } from "@/components/app-drawer";
import { AppField } from "@/components/app-field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { AppInput } from "@/components/app-input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { STORE_OPTIONS } from "@/constant";
import {
  mockItemSeeds,
  type CatalogItemSeed,
} from "@/features/catalog-ho/api/mock";
import { AppReadOnlyField } from "@/components/app-read-only-field";
import type { CatalogItem } from "@/features/catalog-ho/types";
import { cn } from "@/lib/utils/cnName";
import { useTranslations } from "next-intl";

type EditCatalogItemFormValues = {
  finalPriceInVat: string;
};

type AddCatalogItemFormValues = {
  storeMaster: string;
  itemCode: string;
  shelfPriceInVat: string;
  finalPriceInVat: string;
};

type ItemCodeLookupResult = {
  exists: boolean;
  item: CatalogItemSeed | null;
  itemCode: string;
  itemDescription: string;
  storeMaster: string;
};

const emptyAddDefaults: AddCatalogItemFormValues = {
  storeMaster: "",
  itemCode: "",
  shelfPriceInVat: "0.00",
  finalPriceInVat: "0.00",
};

const itemCodeLookupDelayMs = 700;

function formatPrice(value: number) {
  return value.toFixed(2);
}

function toEditDefaults(item: CatalogItem): EditCatalogItemFormValues {
  return {
    finalPriceInVat: String(item.finalPriceInVat),
  };
}

type ItemDrawerProps = {
  mode: "add" | "edit";
  item: CatalogItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEdit: boolean;
};

export function ItemDrawer({
  mode,
  item,
  open,
  onOpenChange,
  canEdit,
}: ItemDrawerProps) {
  const t = useTranslations();
  const isAddMode = mode === "add";
  const isDisabled = !canEdit;
  const addFormRef = useRef<HTMLFormElement | null>(null);
  const [itemCodeLookupResult, setItemCodeLookupResult] =
    useState<ItemCodeLookupResult | null>(null);

  const editForm = useForm<EditCatalogItemFormValues>({
    defaultValues: item ? toEditDefaults(item) : undefined,
  });

  const addForm = useForm<AddCatalogItemFormValues>({
    defaultValues: emptyAddDefaults,
  });
  const addItemCode = useWatch({
    control: addForm.control,
    name: "itemCode",
  });
  const addStoreMaster = useWatch({
    control: addForm.control,
    name: "storeMaster",
  });
  const addShelfPriceInVat = useWatch({
    control: addForm.control,
    name: "shelfPriceInVat",
  });
  const addItemCodeValue = addItemCode.trim();
  const isLookupReady =
    open && isAddMode && !!addItemCodeValue && !!addStoreMaster;
  const isLookupResultCurrent =
    itemCodeLookupResult?.itemCode === addItemCodeValue &&
    itemCodeLookupResult?.storeMaster === addStoreMaster;
  const isItemCodeLoading = isLookupReady && !isLookupResultCurrent;
  const itemDescription =
    isLookupResultCurrent && itemCodeLookupResult.exists
      ? itemCodeLookupResult.itemDescription
      : "";
  const addItemDetails =
    isLookupResultCurrent && itemCodeLookupResult.item
      ? itemCodeLookupResult.item
      : null;

  useEffect(() => {
    if (!open) return;
    if (isAddMode) {
      addForm.reset(emptyAddDefaults);
      return;
    }
    if (item) editForm.reset(toEditDefaults(item));
  }, [open, isAddMode, item, addForm, editForm]);

  useEffect(() => {
    if (!open || !isAddMode) return;

    if (!addItemCodeValue) {
      addForm.clearErrors(["itemCode", "storeMaster"]);
      return;
    }

    if (!addStoreMaster) {
      addForm.clearErrors("itemCode");
      addForm.setError("storeMaster", {
        type: "manual",
        message: t("details.drawers.pleaseSelectStoreMaster"),
      });
      return;
    }

    addForm.clearErrors(["itemCode", "storeMaster"]);

    const lookupTimeoutId = window.setTimeout(() => {
      const item =
        mockItemSeeds.find((seed) => seed.itemNo === addItemCodeValue) ?? null;
      const exists = !!item;
      setItemCodeLookupResult({
        exists,
        item,
        itemCode: addItemCodeValue,
        itemDescription: item?.itemDescription ?? "",
        storeMaster: addStoreMaster,
      });

      if (item) {
        addForm.setValue(
          "shelfPriceInVat",
          formatPrice(item.regularPriceInVat),
          { shouldDirty: true }
        );
        addForm.setValue("finalPriceInVat", formatPrice(item.finalPriceInVat), {
          shouldDirty: true,
        });
        addForm.clearErrors("itemCode");
        return;
      }

      addForm.setError("itemCode", {
        type: "manual",
        message: t("details.drawers.itemCodeMissing"),
      });
    }, itemCodeLookupDelayMs);

    return () => window.clearTimeout(lookupTimeoutId);
  }, [addForm, addItemCodeValue, addStoreMaster, isAddMode, open, t]);

  const onEditSubmit = (values: EditCatalogItemFormValues) => {
    console.info("Save catalog item", { id: item?.id, values });
    onOpenChange(false);
  };

  const onAddSubmit = (values: AddCatalogItemFormValues) => {
    if (isItemCodeLoading) return;
    if (!values.storeMaster) {
      addForm.setError("storeMaster", {
        type: "manual",
        message: t("details.drawers.pleaseSelectStoreMaster"),
      });
      return;
    }

    if (!mockItemSeeds.some((seed) => seed.itemNo === values.itemCode.trim())) {
      addForm.setError("itemCode", {
        type: "manual",
        message: t("details.drawers.itemCodeMissing"),
      });
      return;
    }

    console.info("Add catalog item", { values });
    toast.success(t("details.drawers.itemAdded"), {
      description: t("details.drawers.itemAddedDescription"),
    });
    onOpenChange(false);
  };

  if (!isAddMode && !item) return null;

  const editItem = item;
  const formId = isAddMode ? "addCatalogItemForm" : "editCatalogItemForm";
  const storeMasterOptions = STORE_OPTIONS.map((store) => store.storeId);
  const addFormErrors = addForm.formState.errors;

  return (
    <AppDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={
        isAddMode
          ? t("details.drawers.addItemPrice")
          : t("details.drawers.editItemPrice")
      }
      size="md"
      headerExtra={
        !isAddMode && !canEdit ? (
          <span className="w-fit rounded-full bg-app-surface-subtle px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-app-muted-foreground">
            {t("details.drawers.readOnly")}
          </span>
        ) : null
      }
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
      {isAddMode ? (
        <form
          ref={addFormRef}
          id={formId}
          className="flex flex-col gap-6"
          onSubmit={addForm.handleSubmit(onAddSubmit)}
        >
          <AppField
            label={t("common.fields.storeMaster")}
            required
            error={addFormErrors.storeMaster?.message}
          >
            <Controller
              control={addForm.control}
              name="storeMaster"
              rules={{ required: t("details.drawers.pleaseSelectStoreMaster") }}
              render={({ field }) => (
                <Combobox
                  items={storeMasterOptions}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value ?? "");
                    if (value) addForm.clearErrors("storeMaster");
                  }}
                >
                  <ComboboxInput
                    aria-invalid={!!addFormErrors.storeMaster}
                    disabled={isDisabled}
                    placeholder={t("details.drawers.pleaseSelectStoreMaster")}
                    showClear
                  />
                  <ComboboxContent portalContainer={addFormRef}>
                    <ComboboxEmpty>
                      {t("details.drawers.noStoreMasterFound")}
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(storeId) => (
                        <ComboboxItem key={storeId} value={storeId}>
                          {storeId}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
          </AppField>

          <AppField
            htmlFor="itemCode"
            label={t("common.fields.itemCode")}
            required
            error={addFormErrors.itemCode?.message}
          >
            <InputGroup>
              <InputGroupInput
                id="itemCode"
                placeholder={t("details.drawers.enterItemCode")}
                disabled={isDisabled || !addStoreMaster}
                aria-invalid={!!addFormErrors.itemCode}
                {...addForm.register("itemCode", {
                  required: t("details.drawers.itemCodeRequired"),
                  validate: (value, formValues) => {
                    if (!formValues.storeMaster) return true;
                    return (
                      mockItemSeeds.some(
                        (seed) => seed.itemNo === value.trim()
                      ) || t("details.drawers.itemCodeMissing")
                    );
                  },
                })}
              />
              {isItemCodeLoading ? (
                <InputGroupAddon align="inline-end">
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                </InputGroupAddon>
              ) : null}
            </InputGroup>
          </AppField>

          {addItemDetails ? (
            <>
              <AppReadOnlyField
                label={t("common.fields.itemDescription")}
                value={itemDescription}
              />

              <div className="grid grid-cols-2 gap-4">
                <AppReadOnlyField
                  label={t("details.drawers.shelfPriceInVat")}
                  value={addShelfPriceInVat}
                />
                <AppReadOnlyField
                  label={t("details.drawers.shelfPriceInVatPlusCharge")}
                  value={formatPrice(addItemDetails.shelfPriceInVatPlusCharge)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <AppField
                  htmlFor="addFinalPriceInVat"
                  label={t("common.fields.finalPriceInVat")}
                  error={addFormErrors.finalPriceInVat?.message}
                >
                  <AppInput
                    id="addFinalPriceInVat"
                    inputMode="decimal"
                    disabled={isDisabled}
                    aria-invalid={!!addFormErrors.finalPriceInVat}
                    {...addForm.register("finalPriceInVat", {
                      required: t("details.drawers.finalPriceInVatRequired"),
                    })}
                  />
                </AppField>
                <AppReadOnlyField
                  label={t("common.fields.finalPriceExVat")}
                  value={formatPrice(addItemDetails.finalPriceExVat)}
                />
              </div>

              <AppReadOnlyField
                label={t("common.fields.vat")}
                value={formatPrice(addItemDetails.vat)}
              />
            </>
          ) : null}
        </form>
      ) : editItem ? (
        <form
          id={formId}
          className="flex flex-col gap-6"
          onSubmit={editForm.handleSubmit(onEditSubmit)}
        >
          <AppReadOnlyField
            label={t("common.fields.itemCode")}
            value={editItem.itemNo}
          />
          <AppReadOnlyField
            label={t("common.fields.itemDescription")}
            value={editItem.itemDescription}
          />

          <div className="grid grid-cols-2 gap-4">
            <AppReadOnlyField
              label={t("details.drawers.shelfPriceInVat")}
              value={editItem.regularPriceInVat.toFixed(2)}
            />
            <AppReadOnlyField
              label={t("details.drawers.shelfPriceInVatPlusCharge")}
              value={editItem.shelfPriceInVatPlusCharge.toFixed(2)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isDisabled ? (
              <AppReadOnlyField
                label={t("common.fields.finalPriceInVat")}
                value={editItem.finalPriceInVat.toFixed(2)}
              />
            ) : (
              <AppField
                htmlFor="finalPriceInVat"
                label={t("common.fields.finalPriceInVat")}
                error={editForm.formState.errors.finalPriceInVat?.message}
              >
                <AppInput
                  id="finalPriceInVat"
                  inputMode="decimal"
                  aria-invalid={!!editForm.formState.errors.finalPriceInVat}
                  {...editForm.register("finalPriceInVat", {
                    required: t("details.drawers.finalPriceInVatRequired"),
                  })}
                />
              </AppField>
            )}
            <AppReadOnlyField
              label={t("common.fields.finalPriceExVat")}
              value={editItem.finalPriceExVat.toFixed(2)}
            />
          </div>

          <AppReadOnlyField
            label={t("common.fields.vat")}
            value={editItem.vat.toFixed(2)}
          />
        </form>
      ) : null}
    </AppDrawer>
  );
}
