import type { CouponCartState, CouponPayload } from "../types";

export function normalizeCouponCode(couponCode: string) {
  return couponCode.trim().toUpperCase();
}

export function buildCouponPayload(cart: CouponCartState, enteredCoupon: string): CouponPayload {
  return {
    cartId: cart.cartId,
    couponCode: normalizeCouponCode(enteredCoupon)
  };
}
