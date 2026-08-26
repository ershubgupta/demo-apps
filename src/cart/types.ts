export type CouponCode = "SAVE10PERCENT" | "SAVE20" | "SAVE30";

export type CouponCartState = {
  appliedCoupon: string | null;
  cartId: string;
  discountRate: number;
};

export type CouponPayload = {
  cartId: string;
  currentDiscountRate: number;
  couponCode: string;
  previousCouponCode: string | null;
};

export type CouponResponse = {
  couponCode: CouponCode;
  discountRate: number;
};
