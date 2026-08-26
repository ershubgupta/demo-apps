import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function importTypeScriptModule(moduleUrl) {
  const source = await readFile(moduleUrl, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  });

  return import(
    `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`
  );
}

const { applyCouponToCartState } = await importTypeScriptModule(
  new URL("./couponCartState.ts", import.meta.url)
);

test("applies the fresh coupon response rate to cart totals", () => {
  const currentCart = {
    appliedCoupon: null,
    cartId: "cart-1001",
    couponCode: "SAVE10PERCENT",
    discountRate: 0,
    lastAppliedCoupon: null,
    product: {
      id: "wireless-headphones",
      price: 2000,
    },
    quantity: 1,
  };

  const nextCart = applyCouponToCartState(currentCart, "SAVE10PERCENT", {
    couponCode: "SAVE10PERCENT",
    discountRate: 0.1,
  });
  const discountAmount = nextCart.product.price * nextCart.quantity * nextCart.discountRate;

  assert.equal(nextCart.appliedCoupon, "SAVE10PERCENT");
  assert.equal(nextCart.couponCode, "SAVE10PERCENT");
  assert.equal(nextCart.lastAppliedCoupon, "SAVE10PERCENT");
  assert.equal(nextCart.discountRate, 0.1);
  assert.equal(discountAmount, 200);
});
