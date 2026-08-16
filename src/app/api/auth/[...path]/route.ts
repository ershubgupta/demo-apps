import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";

async function forwardAuthRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const authPath = path.join("/");
  const prefix = env.AUTH_API_PATH_PREFIX.replace(/\/$/, "");
  const targetUrl = new URL(`${prefix}/${authPath}`, env.AUTH_API_URL);
  targetUrl.search = request.nextUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");

  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers,
    body: ["GET", "HEAD"].includes(request.method)
      ? undefined
      : await request.arrayBuffer(),
    redirect: "manual",
  });

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

export const GET = forwardAuthRequest;
export const POST = forwardAuthRequest;
export const PUT = forwardAuthRequest;
export const PATCH = forwardAuthRequest;
export const DELETE = forwardAuthRequest;
