// Rate Limiting Utility for Client-Side Protection
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs?: number;
}

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number; blockedUntil?: number }> = new Map();

  isAllowed(key: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    // Check if currently blocked
    if (entry?.blockedUntil && now < entry.blockedUntil) {
      return false;
    }

    // Reset if window expired
    if (!entry || now > entry.resetTime) {
      this.attempts.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return true;
    }

    // Increment attempts
    entry.count++;

    // Check if exceeded limit
    if (entry.count > config.maxAttempts) {
      if (config.blockDurationMs) {
        entry.blockedUntil = now + config.blockDurationMs;
      }
      return false;
    }

    return true;
  }

  getRemainingAttempts(key: string, config: RateLimitConfig): number {
    const entry = this.attempts.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return config.maxAttempts;
    }
    return Math.max(0, config.maxAttempts - entry.count);
  }

  getBlockTimeRemaining(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry?.blockedUntil) return 0;
    return Math.max(0, entry.blockedUntil - Date.now());
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter();

// Pre-configured rate limits
export const RATE_LIMITS = {
  AUTH_ATTEMPTS: { maxAttempts: 5, windowMs: 15 * 60 * 1000, blockDurationMs: 15 * 60 * 1000 }, // 5 attempts per 15 min
  QUIZ_SUBMISSIONS: { maxAttempts: 100, windowMs: 60 * 60 * 1000 }, // 100 submissions per hour
  FEEDBACK_SUBMISSIONS: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 feedback per hour
  PASSWORD_RESET: { maxAttempts: 3, windowMs: 60 * 60 * 1000 } // 3 resets per hour
} as const;
