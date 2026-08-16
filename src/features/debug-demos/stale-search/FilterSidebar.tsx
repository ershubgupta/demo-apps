import { SlidersHorizontal } from "lucide-react";

const departments = ["Deals", "Footwear", "Audio", "Fitness", "Travel"];
const brands = ["Aster", "Northline", "Pulse", "Stride Co.", "Vela"];
const deliveryOptions = ["Free shipping", "Same-day pickup", "In stock today"];

export function FilterSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 lg:block">
      <div className="sticky top-24 rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-sm font-semibold">Filters</h2>
          <SlidersHorizontal className="size-4 text-muted-foreground" aria-hidden="true" />
        </div>

        <FilterGroup title="Department" options={departments} />
        <FilterGroup title="Brand" options={brands} />
        <FilterGroup title="Delivery" options={deliveryOptions} />

        <div className="border-t pt-5">
          <h3 className="text-sm font-semibold">Price range</h3>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-9 flex-1 items-center rounded-md border bg-secondary px-3">$50</div>
            <span>to</span>
            <div className="flex h-9 flex-1 items-center rounded-md border bg-secondary px-3">$200</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div className="border-b py-5 last:border-b-0">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 space-y-2">
        {options.map((option, index) => (
          <label key={option} className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              defaultChecked={index === 0}
              className="size-4 rounded border-input accent-primary"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
