import { Locator, launch } from "puppeteer"; // v25.0.0 or later

const browser = await launch({
  headless: false,
  slowMo: 50,
});
const page = await browser.newPage();
const timeout = 15000;
page.setDefaultTimeout(timeout);

{
  const targetPage = page;
  await targetPage.setViewport({
    width: 1160,
    height: 443,
  });
}
{
  const targetPage = page;
  await targetPage.goto("http://localhost:3010/debug-demos/cart-recorder", {
    waitUntil: "networkidle0",
  });
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("::-p-aria(Search products)"),
    targetPage.locator("[data-testid='product-search-input']"),
    targetPage.locator(
      '::-p-xpath(//*[@data-testid=\\"product-search-input\\"])'
    ),
    targetPage.locator(":scope >>> [data-testid='product-search-input']"),
  ])
    .setTimeout(timeout)
    .click({
      offset: {
        x: 176.79998779296875,
        y: 28.8125,
      },
    });
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("::-p-aria(Search products)"),
    targetPage.locator("[data-testid='product-search-input']"),
    targetPage.locator(
      '::-p-xpath(//*[@data-testid=\\"product-search-input\\"])'
    ),
    targetPage.locator(":scope >>> [data-testid='product-search-input']"),
  ])
    .setTimeout(timeout)
    .fill("watch");
}
{
  const targetPage = page;
  await targetPage.keyboard.down("Enter");
}
{
  const targetPage = page;
  await targetPage.keyboard.up("Enter");
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("article:nth-of-type(3) p.text-xs"),
    targetPage.locator(
      '::-p-xpath(//*[@data-testid=\\"product-card-sport-chronograph-watch\\"]/div[2]/p[1])'
    ),
    targetPage.locator(":scope >>> article:nth-of-type(3) p.text-xs"),
  ])
    .setTimeout(timeout)
    .click({
      offset: {
        x: 111.20001220703125,
        y: 1.6125030517578125,
      },
    });
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("::-p-aria(Add Sport Chronograph Watch to cart)"),
    targetPage.locator("[data-testid='add-to-cart-button']"),
    targetPage.locator(
      '::-p-xpath(//*[@data-testid=\\"add-to-cart-button\\"])'
    ),
    targetPage.locator(":scope >>> [data-testid='add-to-cart-button']"),
    targetPage.locator("::-p-text(Add to Cart)"),
  ])
    .setTimeout(timeout)
    .click({
      offset: {
        x: 127.20001220703125,
        y: 5.61248779296875,
      },
    });
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("::-p-aria(Promo code)"),
    targetPage.locator("[data-testid='coupon-input']"),
    targetPage.locator('::-p-xpath(//*[@data-testid=\\"coupon-input\\"])'),
    targetPage.locator(":scope >>> [data-testid='coupon-input']"),
  ])
    .setTimeout(timeout)
    .fill("sa");
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("::-p-aria(Promo code)"),
    targetPage.locator("[data-testid='coupon-input']"),
    targetPage.locator('::-p-xpath(//*[@data-testid=\\"coupon-input\\"])'),
    targetPage.locator(":scope >>> [data-testid='coupon-input']"),
  ])
    .setTimeout(timeout)
    .click({
      offset: {
        x: 107.5999755859375,
        y: 26.599990844726562,
      },
    });
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("::-p-aria(Promo code)"),
    targetPage.locator("[data-testid='coupon-input']"),
    targetPage.locator('::-p-xpath(//*[@data-testid=\\"coupon-input\\"])'),
    targetPage.locator(":scope >>> [data-testid='coupon-input']"),
  ])
    .setTimeout(timeout)
    .fill("save10percent");
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("::-p-aria(Apply Coupon)"),
    targetPage.locator("[data-testid='apply-coupon-button']"),
    targetPage.locator(
      '::-p-xpath(//*[@data-testid=\\"apply-coupon-button\\"])'
    ),
    targetPage.locator(":scope >>> [data-testid='apply-coupon-button']"),
    targetPage.locator("::-p-text(Apply)"),
  ])
    .setTimeout(timeout)
    .click({
      offset: {
        x: 37.7125244140625,
        y: 7.5999908447265625,
      },
    });
}
{
  const targetPage = page;
  await targetPage.waitForFunction(
    () =>
      document
        .querySelector('[data-testid="cart-total"]')
        ?.textContent?.includes("3,240"),
    { timeout }
  );
}
{
  const targetPage = page;
  await Locator.race([
    targetPage.locator("::-p-aria(Increase Quantity)"),
    targetPage.locator("[data-testid='increase-quantity-button']"),
    targetPage.locator(
      '::-p-xpath(//*[@data-testid=\\"increase-quantity-button\\"])'
    ),
    targetPage.locator(":scope >>> [data-testid='increase-quantity-button']"),
  ])
    .setTimeout(timeout)
    .click({
      offset: {
        x: 27.20001220703125,
        y: 20.612503051757812,
      },
    });
}
{
  //   const targetPage = page;
  try {
    await page.waitForFunction(
      `document.querySelector('[data-testid="cart-total"]')?.textContent?.trim() === '₹6,480'`,
      { timeout: 5000 }
    );

    console.log("✅ Cart total is correct: ₹6,480");
  } catch {
    console.error("❌ Cart total verification failed. Expected ₹6,480");
    await page.screenshot({ path: "cart-total-failure.png" });
    process.exitCode = 1;
  }
}

await browser.close();
