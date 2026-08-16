import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { getProductsForRequest } from "./mock-products.mjs";

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"]
]);

export function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(body, null, 2));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

export function handleApiRequest(request, response) {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");

  if (url.pathname !== "/api/products") {
    if (url.pathname !== "/api/cart/apply-coupon") {
      return false;
    }

    if (request.method !== "POST") {
      sendJson(response, 405, { error: "Method not allowed" });
      return true;
    }

    void readRequestBody(request)
      .then((rawBody) => {
        const payload = JSON.parse(String(rawBody || "{}"));
        const couponCode = String(payload.couponCode ?? "").trim().toUpperCase();
        const discountRates = {
          SAVE10PERCENT: 0.1,
          SAVE20: 0.2,
          SAVE30: 0.3
        };
        const discountRate = discountRates[couponCode];

        if (typeof discountRate !== "number") {
          sendJson(response, 422, { error: "Coupon code is not valid" });
          return;
        }

        sendJson(response, 200, {
          cartId: payload.cartId,
          couponCode,
          discountRate
        });
      })
      .catch(() => {
        sendJson(response, 400, { error: "Invalid coupon request" });
      });

    return true;
  }

  sendJson(response, 200, getProductsForRequest(url));
  return true;
}

export async function serveStaticFile(request, response, rootDirectory, options = {}) {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");
  const pathname = decodeURIComponent(url.pathname);
  const cleanPath = normalize(pathname).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = pathname === "/" || cleanPath === "/" || cleanPath === "\\" ? "/index.html" : cleanPath;
  const absoluteRoot = resolve(rootDirectory);
  const filePath = resolve(join(absoluteRoot, requestedPath));

  if (!filePath.startsWith(absoluteRoot)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  let candidate = filePath;
  if (!existsSync(candidate)) {
    candidate = resolve(join(absoluteRoot, "index.html"));
  }

  try {
    const fileStat = await stat(candidate);

    if (!fileStat.isFile()) {
      candidate = resolve(join(absoluteRoot, "index.html"));
    }

    const headers = {
      "Content-Type": contentTypes.get(extname(candidate)) ?? "application/octet-stream",
      "Cache-Control": options.cacheControl ?? "no-store"
    };

    if (options.cors) {
      headers["Access-Control-Allow-Origin"] = "*";
    }

    response.writeHead(200, headers);
    createReadStream(candidate).pipe(response);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}
