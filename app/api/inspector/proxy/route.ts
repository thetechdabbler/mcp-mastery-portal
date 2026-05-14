import { NextResponse } from "next/server";
import { decideInspectorUrl, isPrivateHostname } from "@/lib/inspector-url";

export const runtime = "nodejs";

const buckets = new Map<string, { tokens: number; ts: number }>();

function rateLimit(ip: string) {
  const now = Date.now();
  const b = buckets.get(ip) ?? { tokens: 30, ts: now };
  const refill = Math.floor((now - b.ts) / 1000);
  const tokens = Math.min(30, b.tokens + refill);
  if (tokens <= 0) return false;
  buckets.set(ip, { tokens: tokens - 1, ts: now });
  return true;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const body = (await req.json()) as {
    url?: string;
    allowLocalhostHttp?: boolean;
    forwardAuth?: boolean;
    authHeader?: string;
    payload?: unknown;
  };
  const decision = decideInspectorUrl(body.url ?? "", { allowLocalhostHttp: !!body.allowLocalhostHttp });
  if (!decision.ok) return NextResponse.json({ error: decision.reason }, { status: 400 });
  const { url } = decision;
  if (isPrivateHostname(url.hostname) && !(body.allowLocalhostHttp && url.protocol === "http:")) {
    return NextResponse.json({ error: "blocked_private_host" }, { status: 400 });
  }
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (body.forwardAuth && body.authHeader) {
    headers.authorization = body.authHeader;
  }
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body.payload ?? {}),
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") ?? "text/plain" },
  });
}
