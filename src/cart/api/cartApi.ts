import type { CouponPayload, CouponResponse } from "../types";

export async function applyCouponRequest(payload: CouponPayload): Promise<CouponResponse> {
  const response = await fetch("/api/cart/apply-coupon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Coupon request failed with ${response.status}`);
  }

  return (await response.json()) as CouponResponse;
}
