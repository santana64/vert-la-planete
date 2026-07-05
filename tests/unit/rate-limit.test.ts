import { describe, expect, it } from "vitest";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

describe("rate limiting", () => {
  it("autorise jusqu'à la limite puis bloque", () => {
    const key = `t1:${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("réinitialise la clé (après connexion réussie)", () => {
    const key = `t2:${Math.random()}`;
    for (let i = 0; i < 4; i++) checkRateLimit(key, 3, 60_000);
    expect(checkRateLimit(key, 3, 60_000).allowed).toBe(false);
    resetRateLimit(key);
    expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true);
  });

  it("isole les clés entre elles", () => {
    const a = `t3a:${Math.random()}`;
    const b = `t3b:${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(a, 3, 60_000);
    expect(checkRateLimit(b, 3, 60_000).allowed).toBe(true);
  });
});
