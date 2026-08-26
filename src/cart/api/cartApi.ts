import type { CouponPayload, CouponResponse } from "../types";
import { normalizeCouponCode } from "../utils/buildCouponPayload";

const discountRates: Record<string, number> = {
  SAVE10PERCENT: 0.1,
  SAVE20: 0.2,
  SAVE30: 0.3
};

function isCouponResponse(value: unknown): value is CouponResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "couponCode" in value &&
    "discountRate" in value
  );
}

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

    const couponResponse = await response.json();

    if (!isCouponResponse(couponResponse)) {
      return applyCouponLocally(payload);
    }

    return couponResponse;
  } catch {
    return applyCouponLocally(payload);
  }
}

function applyCouponLocally(payload: CouponPayload): CouponResponse {
  const couponCode = normalizeCouponCode(payload.couponCode);
  const discountRate = discountRates[couponCode];

  if (typeof discountRate !== "number") {
    throw new Error("Coupon code is not valid");
  }

  return {
    couponCode: couponCode as CouponResponse["couponCode"],
    discountRate
  };
}
