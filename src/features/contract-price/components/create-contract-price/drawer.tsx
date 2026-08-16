"use client";

import { ReactNode, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { startOfMonth } from "date-fns";

import { useTranslations } from "next-intl";
import { AppDrawer } from "@/components/app-drawer";
import { MonthPicker } from "@/components/calendar/month-picker";
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxChips,
  ComboboxChip,
  ComboboxChipsInput,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { DataTable } from "@/components/data-table/data-table";
import { AppDropdown } from "@/components/app-dropdown";
import { AppField } from "@/components/app-field";
import { CustomerOption } from "../../types";
import {
  CONTRACT_TYPE_OPTIONS,
  CUSTOMER_OPTIONS,
  CUSTOMER_SELECTION_TYPE_OPTIONS,
} from "../../api/mock";
import { createCustomerTableColumns } from "./customer-table-columns";

type CreateNewContractDrawerProps = {
  children: ReactNode;
};

type CreateNewContractForm = {
  contractType: string;
  customerSelectionType: string;
  customer: CustomerOption[];
  charge: number;
  monthPeriod?: Date;
};

export function CreateNewContractDrawer({
  children,
}: CreateNewContractDrawerProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<CustomerOption[]>(
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<CreateNewContractForm>({
    defaultValues: {
      contractType: "B2B",
      customerSelectionType: "Single",
      customer: [],
      charge: 0,
      monthPeriod: undefined,
    },
  });

  const customerSelectionType = useWatch({
    control,
    name: "customerSelectionType",
  });

  const isMulti = customerSelectionType === "Multi";

  const handleDeleteCustomer = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.filter((customer) => customer.id !== id)
    );
  };

  const customerTableData = isMulti
    ? selectedCustomers
    : selectedCustomers.slice(0, 1);

  const anchor = useComboboxAnchor();

  const handleCancel = () => {
    reset();
    setSelectedCustomers([]);
    setOpen(false);
  };

  const onSubmit = (values: CreateNewContractForm) => {
    if (selectedCustomers.length === 0) {
      setError("customer", {
        type: "required",
        message: t("forms.catalog.customerRequired"),
      });
      return;
    }
    try {
      console.log(values);
      toast.success(t("forms.catalog.catalogCreated"), {
        description: t("forms.catalog.catalogCreatedDescription"),
      });
      setSelectedCustomers([]);
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

  const updateSelectedCustomers = (customers: CustomerOption[]) => {
    setSelectedCustomers(customers);
    setValue("customer", customers, {
      shouldValidate: true,
      shouldDirty: true,
    });

    if (customers.length > 0) {
      clearErrors("customer");
    }
  };

  return (
    <AppDrawer
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title={t("forms.catalog.createTitle")}
      size="xl"
      primaryAction={{
        type: "submit",
        form: "create-contract-form",
        label: (
          <>
            <Plus className="h-4 w-4" />
            {t("common.actions.create")}
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
        id="create-contract-form"
        className="flex h-full flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4">
            <Controller
              control={control}
              name="contractType"
              rules={{
                required: t("forms.catalog.contractType") + " is required",
              }}
              render={({ field }) => (
                <AppField
                  htmlFor="contractType"
                  label={t("forms.catalog.contractType")}
                  required
                  error={errors?.contractType?.message}
                >
                  <AppDropdown
                    required
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder={t("forms.catalog.contractType")}
                    options={CONTRACT_TYPE_OPTIONS.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                </AppField>
              )}
            />

            <Controller
              control={control}
              name="customerSelectionType"
              rules={{
                required:
                  t("forms.catalog.customerSelectionType") + " is required",
              }}
              render={({ field }) => (
                <AppField
                  htmlFor="customerSelectionType"
                  label={t("forms.catalog.customerSelectionType")}
                  required
                  error={errors?.customerSelectionType?.message}
                >
                  <AppDropdown
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedCustomers([]);
                      setValue("customer", [], {
                        shouldValidate: false,
                        shouldDirty: false,
                      });
                      clearErrors("customer");
                    }}
                    placeholder={t("forms.catalog.customerSelectionType")}
                    options={CUSTOMER_SELECTION_TYPE_OPTIONS.map((option) => ({
                      label: option,
                      value: option,
                    }))}
                  />
                </AppField>
              )}
            />

            <Controller
              control={control}
              name="customer"
              rules={{
                validate: (value) =>
                  (Array.isArray(value) ? value.length > 0 : value != null) ||
                  t("forms.catalog.customerRequired"),
              }}
              render={() => (
                <AppField
                  htmlFor="customer"
                  label={t("common.fields.customer")}
                  required
                  error={errors?.customer?.message}
                >
                  {isMulti ? (
                    <Combobox
                      key="multi-customer-combobox"
                      multiple
                      autoHighlight
                      items={CUSTOMER_OPTIONS}
                      value={selectedCustomers}
                      onValueChange={(values) => {
                        const nextValue = values ?? [];
                        updateSelectedCustomers(nextValue);
                      }}
                      itemToStringLabel={(item: CustomerOption) => item.label}
                      itemToStringValue={(item: CustomerOption) => item.id}
                      isItemEqualToValue={(
                        a: CustomerOption,
                        b: CustomerOption
                      ) => a.id === b.id}
                    >
                      <ComboboxChips ref={anchor} className="w-full">
                        <ComboboxValue>
                          {(
                            values: CustomerOption | CustomerOption[] | null
                          ) => {
                            const selectedValues = Array.isArray(values)
                              ? values
                              : values
                                ? [values]
                                : [];

                            return (
                              <>
                                {selectedValues.map((customer) => (
                                  <ComboboxChip key={customer.id}>
                                    {customer.label}
                                  </ComboboxChip>
                                ))}
                                <ComboboxChipsInput
                                  placeholder={
                                    selectedValues.length === 0
                                      ? t("common.fields.customer")
                                      : undefined
                                  }
                                />
                              </>
                            );
                          }}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {(customer: CustomerOption) => (
                            <ComboboxItem key={customer.id} value={customer}>
                              {customer.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  ) : (
                    <Combobox
                      key="single-customer-combobox"
                      autoHighlight
                      items={CUSTOMER_OPTIONS}
                      value={selectedCustomers[0] ?? null}
                      onValueChange={(value) => {
                        if (!value) {
                          setSelectedCustomers([]);
                          setValue("customer", [] as CustomerOption[], {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          return;
                        }

                        updateSelectedCustomers([value]);
                      }}
                      onOpenChange={(open) => {
                        if (!open && selectedCustomers.length === 0) {
                          clearErrors("customer");
                        }
                      }}
                      itemToStringLabel={(item: CustomerOption) => item.label}
                      itemToStringValue={(item: CustomerOption) => item.id}
                      isItemEqualToValue={(
                        a: CustomerOption,
                        b: CustomerOption
                      ) => a.id === b.id}
                    >
                      <ComboboxChips ref={anchor} className="w-full">
                        <ComboboxValue>
                          {(
                            value: CustomerOption | CustomerOption[] | null
                          ) => {
                            const customer = Array.isArray(value)
                              ? value[0]
                              : value;

                            if (customer) {
                              return (
                                <ComboboxChip showRemove={false}>
                                  {customer.label}
                                </ComboboxChip>
                              );
                            }

                            return (
                              <ComboboxChipsInput
                                placeholder={t("common.fields.customer")}
                              />
                            );
                          }}
                        </ComboboxValue>
                      </ComboboxChips>
                      <ComboboxContent anchor={anchor}>
                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                        <ComboboxList>
                          {(customer: CustomerOption) => (
                            <ComboboxItem key={customer.id} value={customer}>
                              {customer.label}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  )}
                </AppField>
              )}
            />

            {customerTableData.length > 0 && (
              <div className="overflow-x-auto">
                <DataTable
                  columns={createCustomerTableColumns({
                    isMulti,
                    onDeleteCustomer: handleDeleteCustomer,
                  })}
                  data={customerTableData}
                  fillWidth={false}
                  minWidth={540}
                  showPagination={false}
                  density="compact"
                />
              </div>
            )}

            <AppField
              htmlFor="monthPeriod"
              label={t("forms.catalog.monthPeriod")}
              required
              error={errors?.monthPeriod?.message}
            >
              <Controller
                control={control}
                name="monthPeriod"
                rules={{ required: t("forms.catalog.monthPeriodRequired") }}
                render={({ field }) => (
                  <MonthPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="MMM yyyy"
                    disabled={(date) => date < startOfMonth(new Date())}
                  />
                )}
              />
            </AppField>
          </div>
        </div>
      </form>
    </AppDrawer>
  );
}
