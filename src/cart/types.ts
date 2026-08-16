export type CouponCode = "SAVE10PERCENT" | "SAVE20" | "SAVE30";

export type CouponCartState = {
  appliedCoupon: string | null;
  cartId: string;
};

export type CouponPayload = {
  cartId: string;
  couponCode: string;
};

export type CouponResponse = {
  couponCode: CouponCode;
  discountRate: number;
};
