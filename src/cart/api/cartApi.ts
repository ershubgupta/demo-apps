import type { CouponPayload, CouponResponse } from "../types";
import { normalizeCouponCode } from "../utils/buildCouponPayload";

const discountRates: Record<string, number> = {
  SAVE10PERCENT: 0.1,
  SAVE20: 0.2,
  SAVE30: 0.3,
};

function isCouponResponse(value: unknown): value is CouponResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    "couponCode" in value &&
    "discountRate" in value &&
    typeof value.discountRate === "number" &&
    value.discountRate >= 0 &&
    value.discountRate <= 1
  );
}

function sendCouponRequest(payload: CouponPayload): Promise<Response> {
  return Promise.resolve(mockCouponResponse(payload));
}

function mockCouponResponse(payload: CouponPayload): Response {
  const couponCode = normalizeCouponCode(payload.couponCode);
  const discountRate = discountRates[couponCode];
  const headers = { "Content-Type": "application/json" };

  if (typeof discountRate !== "number") {
    return new Response(
      JSON.stringify({ message: "Coupon code is not valid" }),
      { status: 422, headers }
    );
  }

  return new Response(JSON.stringify({ couponCode, discountRate }), {
    status: 200,
    headers,
  });
}

export async function applyCouponRequest(
  payload: CouponPayload
): Promise<CouponResponse> {
  try {
    const response = await sendCouponRequest(payload);

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
    discountRate,
  };
}
