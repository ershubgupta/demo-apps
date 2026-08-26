import type { CouponResponse } from "../types";

type CouponCartState = {
  appliedCoupon: string | null;
  couponCode: string;
  discountRate: number;
  lastAppliedCoupon: string | null;
};

export function applyCouponToCartState<TCart extends CouponCartState>(
  currentCart: TCart,
  enteredCoupon: string,
  response: CouponResponse
) {
  return {
    ...currentCart,
    appliedCoupon: response.couponCode,
    couponCode: enteredCoupon,
    discountRate: response.discountRate,
    lastAppliedCoupon: response.couponCode,
  };
}
