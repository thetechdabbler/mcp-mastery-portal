import { describe, expect, it } from "vitest";
import { decideInspectorUrl, isPrivateHostname } from "../lib/inspector-url";

describe("inspector-url", () => {
  it("allows https public", () => {
    const d = decideInspectorUrl("https://example.com/mcp", { allowLocalhostHttp: false });
    expect(d.ok).toBe(true);
  });
  it("blocks http by default", () => {
    const d = decideInspectorUrl("http://example.com/mcp", { allowLocalhostHttp: false });
    expect(d.ok).toBe(false);
  });
  it("allows localhost http with opt-in", () => {
    const d = decideInspectorUrl("http://localhost:8787/mcp", { allowLocalhostHttp: true });
    expect(d.ok).toBe(true);
  });
  it("detects private-ish hostnames", () => {
    expect(isPrivateHostname("127.0.0.1")).toBe(true);
    expect(isPrivateHostname("example.com")).toBe(false);
  });
});
