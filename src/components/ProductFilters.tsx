import type { ProductCategory, ProductFilters as ProductFiltersValue, ProductSort } from "../types/product";
import { SORT_LABELS } from "../utils/productQuery";

const categories: Array<ProductCategory | "All"> = [
  "All",
  "Accessories",
  "Audio",
  "Bags",
  "Footwear",
  "Home office",
  "Travel",
  "Watches"
];
const sorts: ProductSort[] = ["newest", "priceAsc", "priceDesc"];

type ProductFiltersProps = {
  value: ProductFiltersValue;
  onChange: (value: ProductFiltersValue) => void;
};

export function ProductFilters({ value, onChange }: ProductFiltersProps) {
  return (
    <section className="filters" aria-label="Catalog filters">
      <label className="field search-field">
        <span>Search</span>
        <input
          value={value.search}
          placeholder="Search products"
          onChange={(event) => onChange({ ...value, search: event.target.value })}
        />
      </label>

      <label className="field">
        <span>Category</span>
        <select
          value={value.category}
          onChange={(event) => onChange({ ...value, category: event.target.value as ProductCategory | "All" })}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <div className="sort-control">
        <span>Sort</span>
        <div className="sort-options" role="radiogroup" aria-label="Sort products">
          {sorts.map((sort) => (
            <button
              key={sort}
              type="button"
              className={sort === value.sort ? "sort-option sort-option-active" : "sort-option"}
              aria-pressed={sort === value.sort}
              onClick={() => onChange({ ...value, sort })}
            >
              {SORT_LABELS[sort]}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
