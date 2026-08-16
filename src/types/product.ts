export type ProductCategory = "Accessories" | "Audio" | "Bags" | "Footwear" | "Home office" | "Travel" | "Watches";

export type ProductSort = "newest" | "priceAsc" | "priceDesc";

export type StockStatus = "In stock" | "Low stock" | "Backordered";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  stockStatus: StockStatus;
  inventory: number;
  createdAt: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  description: string;
};

export type ProductFilters = {
  search: string;
  category: ProductCategory | "All";
  sort: ProductSort;
};

export type ProductResponse = {
  products: Product[];
  request: {
    search: string;
    category: string;
    sort: string;
  };
};
