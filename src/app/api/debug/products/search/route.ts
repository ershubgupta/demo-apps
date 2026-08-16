import { NextResponse } from "next/server";

import { productResults } from "@/features/debug-demos/stale-search/mock-products";

export const dynamic = "force-dynamic";

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function noStoreJson(data: unknown) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

function resolveProductResultKey(query: string) {
  if (query.length < 3) {
    return undefined;
  }

  return Object.keys(productResults).find(
    (resultKey) => resultKey === query || resultKey.startsWith(query)
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q")?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();
  const resultKey = resolveProductResultKey(normalizedQuery);
  const requestStartTime = new Date().toISOString();
  const requestId = crypto.randomUUID();

  const delayMs =
    resultKey === "shoes" ? 2500 : resultKey === "buds" ? 500 : 800;

  await wait(delayMs);

  const responseCompletionTime = new Date().toISOString();

  return noStoreJson({
    requestId,
    query,
    resultKey: resultKey ?? null,
    requestStartTime,
    responseCompletionTime,
    delayMs,
    products: resultKey ? productResults[resultKey] : [],
  });
}
