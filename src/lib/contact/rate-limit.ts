import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Sliding-window rate limit keyed by IP. Set UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN to activate; without them, the limiter no-ops
 * (returns success=true). This lets the form work locally without a Redis
 * instance, while still gating production submissions.
 */
let limiter: Ratelimit | null = null;

function getLimiter(): Ratelimit | null {
  if (limiter) return limiter;
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return null;
  }
  limiter = new Ratelimit({
    redis: Redis.fromEnv(),
    // 5 submissions per IP per hour. Sliding window so a burst at minute
    // 59 followed by another at minute 61 still counts together.
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    analytics: false,
    prefix: "rl:contact",
  });
  return limiter;
}

export async function checkContactRateLimit(ip: string): Promise<boolean> {
  const rl = getLimiter();
  if (!rl) return true;
  const { success } = await rl.limit(ip);
  return success;
}
