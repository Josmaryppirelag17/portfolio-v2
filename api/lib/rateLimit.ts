import type { VercelRequest } from "@vercel/node";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  reset: number;
  skipped: boolean;
}

let ratelimitInstance: Ratelimit | null = null;

function getMaxPerHour(): number {
  const raw = process.env.RATE_LIMIT_MAX_PER_HOUR;
  const parsed = raw ? Number.parseInt(raw, 10) : 10;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10;
}

function getRatelimit(): Ratelimit | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  if (!ratelimitInstance) {
    ratelimitInstance = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(getMaxPerHour(), "1 h"),
      prefix: "portfolio:contact",
      analytics: true,
    });
  }
  return ratelimitInstance;
}

export function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  if (Array.isArray(forwarded) && forwarded[0]) {
    return String(forwarded[0]).trim();
  }
  const realIp = req.headers["x-real-ip"];
  if (typeof realIp === "string" && realIp) return realIp;
  return req.socket?.remoteAddress ?? "unknown";
}

/**
 * Límite por IP/hora con Upstash Redis.
 * Si no hay credenciales Upstash, no bloquea (útil en dev local).
 */
export async function checkContactRateLimit(
  req: VercelRequest
): Promise<RateLimitResult> {
  const limiter = getRatelimit();
  const max = getMaxPerHour();

  if (!limiter) {
    if (process.env.VERCEL === "1") {
      console.warn(
        "[rate-limit] UPSTASH no configurado en producción — límite desactivado"
      );
    }
    return {
      allowed: true,
      limit: max,
      remaining: max,
      reset: Date.now() + 3600_000,
      skipped: true,
    };
  }

  const ip = getClientIp(req);
  const { success, limit, remaining, reset } = await limiter.limit(
    `contact:${ip}`
  );

  return {
    allowed: success,
    limit,
    remaining,
    reset,
    skipped: false,
  };
}
