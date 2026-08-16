"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { AppField } from "@/components/app-field";
import { Button } from "@/components/ui/button";
import { StoreMasterItem } from "@/features/catalog-ho/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  PrioritySequence,
  type PrioritySequenceItem,
} from "@/components/priority-sequence/priority-sequence";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { STORE_OPTIONS } from "@/constant";
import { useTranslations } from "next-intl";
import type { Translate } from "@/i18n/types";

type StoreMasterListFieldProps = {
  value: StoreMasterItem[];
  onChange: (items: StoreMasterItem[]) => void;
  error?: string;
  showValidation?: boolean;
};

function SortableRow({
  item,
  index,
  onStoreChange,
  onDelete,
  selectedStoreIds,
  showRequiredError,
  t,
}: {
  item: StoreMasterItem;
  index: number;
  onStoreChange: (id: string, storeId: string) => void;
  onDelete: (id: string) => void;
  selectedStoreIds: string[];
  showRequiredError: boolean;
  t: Translate;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="flex flex-col gap-1">
      <div className="grid grid-cols-[60px_1fr_40px] items-center gap-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Button
            type="button"
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
            size="icon-sm"
            variant="ghost"
          >
            <GripVertical className="h-4 w-4" />
          </Button>
          <span className="w-4 text-center text-sm font-medium">
            {index + 1}
          </span>
        </div>

        <Select
          value={item.storeId}
          onValueChange={(storeId) => onStoreChange(item.id, storeId)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("forms.catalog.selectStore")} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="" disabled>
              {t("forms.catalog.selectStore")}
            </SelectItem>
            {STORE_OPTIONS.map((store) => (
              <SelectItem
                key={store.storeId}
                value={store.storeId}
                disabled={
                  selectedStoreIds.includes(store.storeId) &&
                  store.storeId !== item.storeId
                }
              >
                {store.storeId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      {showRequiredError && (
        <span className="pl-[80px] text-[10px] text-destructive">
          {t("forms.catalog.storeRequired")}
        </span>
      )}
    </div>
  );
}

export function StoreMasterListField({
  value,
  onChange,
  error,
  showValidation = false,
}: StoreMasterListFieldProps) {
  const t = useTranslations();
  const summaryItems: PrioritySequenceItem[] = value
    ?.filter((item) => item.storeId)
    ?.map((item, index) => ({
      label: String(index + 1),
      value: item.storeId,
    }));

  const selectedStoreIds = value
    ?.filter((item) => item.storeId)
    ?.map((item) => item.storeId);

  const handleAdd = () => {
    onChange([
      ...value,
      {
        id: crypto.randomUUID(),
        storeId: "",
      },
    ]);
  };

  const handleStoreChange = (id: string, storeId: string) => {
    onChange(
      value.map((item) => (item.id === id ? { ...item, storeId } : item))
    );
  };

  const handleDelete = (id: string) => {
    onChange(value.filter((item) => item.id !== id));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = value.findIndex((item) => item.id === active.id);
    const newIndex = value.findIndex((item) => item.id === over.id);

    onChange(arrayMove(value, oldIndex, newIndex));
  };

  return (
    <AppField label={t("details.catalog.storeMasterPriceSequence")} required>
      <div className="flex gap-2">
        <div className="flex min-h-9 flex-1 items-center rounded-md border border-input bg-card px-3 text-sm shadow-xs">
          {summaryItems.length > 0 ? (
            <PrioritySequence items={summaryItems} />
          ) : (
            <span className="text-sm text-muted-foreground">
              {t("forms.catalog.selectStoreMasterList")}
            </span>
          )}
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={handleAdd}
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {error && <span className="text-[10px] text-destructive">{error}</span>}

      {value.length > 0 && (
        <div className="mt-2 flex flex-col gap-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={value.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {value.map((item, index) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  index={index}
                  onStoreChange={handleStoreChange}
                  onDelete={handleDelete}
                  selectedStoreIds={selectedStoreIds}
                  showRequiredError={showValidation && !item.storeId}
                  t={t}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </AppField>
  );
}
