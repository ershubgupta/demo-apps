import { useState } from "react";
import { applyCouponRequest } from "../api/cartApi";
import type { CouponCartState, CouponResponse } from "../types";
import { buildCouponPayload } from "../utils/buildCouponPayload";

type UseCouponResult = {
  applyCoupon: (cart: CouponCartState, enteredCoupon: string) => Promise<CouponResponse>;
  error: string | null;
  isApplying: boolean;
};

export function useCoupon(): UseCouponResult {
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function applyCoupon(cart: CouponCartState, enteredCoupon: string) {
    setIsApplying(true);
    setError(null);

    try {
      const payload = buildCouponPayload(cart, enteredCoupon);
      return await applyCouponRequest(payload);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Unable to apply coupon";
      setError(message);
      throw caughtError;
    } finally {
      setIsApplying(false);
    }
  }

  return {
    applyCoupon,
    error,
    isApplying
  };
}
