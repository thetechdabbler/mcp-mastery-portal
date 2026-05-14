const PRIVATE = [
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^127\./,
  /^0\.0\.0\.0$/,
  /^169\.254\./,
  /^fc00:/i,
  /^fe80:/i,
  /^::1$/,
];

export type ProxyDecision =
  | { ok: true; url: URL }
  | { ok: false; reason: string };

export function decideInspectorUrl(raw: string, opts: { allowLocalhostHttp: boolean }): ProxyDecision {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return { ok: false, reason: "Invalid URL" };
  }
  if (u.protocol === "https:") {
    return { ok: true, url: u };
  }
  if (opts.allowLocalhostHttp && u.protocol === "http:" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) {
    return { ok: true, url: u };
  }
  if (u.protocol === "http:" && !opts.allowLocalhostHttp) {
    return { ok: false, reason: "HTTP only allowed for localhost with opt-in" };
  }
  return { ok: false, reason: "Unsupported scheme" };
}

export function isPrivateHostname(hostname: string): boolean {
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;
  for (const re of PRIVATE) {
    if (re.test(hostname)) return true;
  }
  return false;
}
