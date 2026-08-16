import type { CouponPayload, CouponResponse } from "../types";

const discountRates: Record<string, number> = {
  SAVE10PERCENT: 0.1,
  SAVE20: 0.2,
  SAVE30: 0.3
};

export async function applyCouponRequest(payload: CouponPayload): Promise<CouponResponse> {
  try {
    const response = await fetch("/api/cart/apply-coupon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });

    const contentType = response.headers.get("content-type") ?? "";

    if (!response.ok || !contentType.includes("application/json")) {
      return applyCouponLocally(payload);
    }

    return (await response.json()) as CouponResponse;
  } catch {
    return applyCouponLocally(payload);
  }
}

function applyCouponLocally(payload: CouponPayload): CouponResponse {
  const couponCode = payload.couponCode.trim().toUpperCase();
  const discountRate = discountRates[couponCode];

  if (typeof discountRate !== "number") {
    throw new Error("Coupon code is not valid");
  }

  return {
    couponCode: couponCode as CouponResponse["couponCode"],
    discountRate
  };
}
