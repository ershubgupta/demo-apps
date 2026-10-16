const discountRates = {
  SAVE10PERCENT: 0.1,
  SAVE20: 0.2,
  SAVE30: 0.3,
};

self.addEventListener("install", () => {
  void self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (
    event.request.method !== "POST" ||
    !requestUrl.pathname.endsWith("/api/cart/apply-coupon")
  ) {
    return;
  }

  event.respondWith(applyCoupon(event.request));
});

async function applyCoupon(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid coupon request" });
  }

  const couponCode = String(payload.couponCode ?? "").trim().toUpperCase();
  const discountRate = discountRates[couponCode];

  if (typeof discountRate !== "number") {
    return jsonResponse(422, { error: "Coupon code is not valid" });
  }

  return jsonResponse(200, {
    cartId: payload.cartId,
    couponCode,
    discountRate,
  });
}

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
