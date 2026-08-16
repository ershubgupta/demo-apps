import { Locator, launch } from "puppeteer"; // v25.0.0 or later

const demoUrl = process.env.CART_DEMO_URL ?? "http://127.0.0.1:5173/debug-demos/cart-recorder";
const timeout = 15000;
const couponRequests = [];

const browser = await launch({
  headless: false,
  slowMo: 50
});

const page = await browser.newPage();
page.setDefaultTimeout(timeout);

page.on("request", (request) => {
  if (request.method() === "POST" && request.url().includes("/api/cart/apply-coupon")) {
    couponRequests.push(JSON.parse(request.postData() ?? "{}"));
  }
});

await page.setViewport({
  height: 720,
  width: 900
});

await page.goto(demoUrl);

await Locator.race([
  page.locator("::-p-aria(Search products)"),
  page.locator("[data-testid='product-search-input']"),
  page.locator(":scope >>> [data-testid='product-search-input']")
])
  .setTimeout(timeout)
  .fill("watch");

await Locator.race([
  page.locator("::-p-aria(Open Sport Chronograph Watch)"),
  page.locator("[data-testid='product-card-sport-chronograph-watch']"),
  page.locator(":scope >>> [data-testid='product-card-sport-chronograph-watch']")
])
  .setTimeout(timeout)
  .click();

await Locator.race([
  page.locator("::-p-aria(Add Sport Chronograph Watch to cart)"),
  page.locator("[data-testid='add-to-cart-button']"),
  page.locator(":scope >>> [data-testid='add-to-cart-button']"),
  page.locator("::-p-text(Add to Cart)")
])
  .setTimeout(timeout)
  .click();

await Locator.race([
  page.locator("::-p-aria(Promo code)"),
  page.locator("[data-testid='coupon-input']"),
  page.locator(":scope >>> [data-testid='coupon-input']")
])
  .setTimeout(timeout)
  .fill("SAVE10PERCENT");

await Locator.race([
  page.locator("::-p-aria(Apply Coupon)"),
  page.locator("[data-testid='apply-coupon-button']"),
  page.locator(":scope >>> [data-testid='apply-coupon-button']"),
  page.locator("::-p-text(Apply)")
])
  .setTimeout(timeout)
  .click();

await page.waitForFunction(
  `document.querySelector('[data-testid="cart-discount"]')?.textContent?.includes('360')`,
  { timeout: 5000 }
);

await Locator.race([
  page.locator("::-p-aria(Promo code)"),
  page.locator("[data-testid='coupon-input']"),
  page.locator(":scope >>> [data-testid='coupon-input']")
])
  .setTimeout(timeout)
  .fill("SAVE20");

await Locator.race([
  page.locator("::-p-aria(Apply Coupon)"),
  page.locator("[data-testid='apply-coupon-button']"),
  page.locator(":scope >>> [data-testid='apply-coupon-button']"),
  page.locator("::-p-text(Apply)")
])
  .setTimeout(timeout)
  .click();

try {
  await page.waitForFunction(
    `document.querySelector('[data-testid="coupon-input"]')?.value === 'SAVE20' && document.querySelector('[data-testid="cart-discount"]')?.textContent?.includes('360')`,
    { timeout: 5000 }
  );

  const firstPayload = couponRequests[0]?.couponCode;
  const secondPayload = couponRequests[1]?.couponCode;
  if (firstPayload !== "SAVE10PERCENT" || secondPayload !== "SAVE20") {
    throw new Error(`Unexpected coupon payloads: ${JSON.stringify(couponRequests)}`);
  }

  console.log("Verified stale cart summary: second request sends SAVE20, but the cart keeps the first 10% discount");
} catch (error) {
  console.error(error);
  await page.screenshot({ path: "cart-coupon-bug-failure.png" });
  process.exitCode = 1;
}

await browser.close();
