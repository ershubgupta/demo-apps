export type DebugProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discountLabel: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  badge?: string;
};

export type ProductSearchTiming = {
  requestId: string;
  query: string;
  resultKey: string | null;
  requestStartTime: string;
  responseCompletionTime: string;
  delayMs: number;
};

export type ProductSearchResponse = ProductSearchTiming & {
  products: DebugProduct[];
};
