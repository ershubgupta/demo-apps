import type { CouponCartState, CouponPayload } from "../types";

export function buildCouponPayload(cart: CouponCartState, enteredCoupon: string): CouponPayload {
  return {
    cartId: cart.cartId,
    couponCode: enteredCoupon.trim().toUpperCase()
  };
}
