/**
 * Build-time reveal-token generation.
 * Runs in Node.js during `astro build` ONLY – never shipped to the client bundle.
 * The REVEAL_SECRET env var is consumed here and the resulting token (a short
 * HMAC-SHA256 hex string) is safe to embed in the pre-rendered HTML because it
 * is scoped to a single page and expires with every nightly rebuild.
 */
import { createHmac } from 'crypto';

/**
 * Returns the UTC calendar date as "YYYY-MM-DD".
 * Using UTC ensures the token is consistent regardless of the build server's
 * local timezone, and aligns with the 06:00 UTC cron schedule.
 */
function utcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Derives a daily, per-page reveal token.
 *
 * @param secret   - Value of the REVEAL_SECRET build-time environment variable.
 * @param pageSlug - Stable identifier for the page (e.g. "nursing-process").
 * @returns        32-character lowercase hex string (first 128 bits of HMAC-SHA256).
 */
export function getDailyRevealToken(secret: string, pageSlug: string): string {
  if (!secret) {
    // Warn clearly in the build log so developers know reveals are insecure.
    // Never throw here because local `astro dev` runs without production secrets.
    console.warn(
      '[revealToken] WARNING: REVEAL_SECRET is not set. ' +
      'Reveal tokens will use an insecure placeholder. ' +
      'Set REVEAL_SECRET in your environment for production builds.'
    );
  }
  const date = utcDateString();
  return createHmac('sha256', secret || 'insecure-dev-placeholder')
    .update(`${date}:${pageSlug}`)
    .digest('hex')
    .slice(0, 32);
}

/** Allowlist of pages that may be revealed via a daily tokenized URL. */
export interface RevealPage {
  /** Stable slug used as part of the HMAC input and in the page URL. */
  slug: string;
  /** Human-readable page title. */
  title: string;
}

export const REVEALABLE_PAGES: RevealPage[] = [
  {
    slug: 'nursing-process',
    title: 'Nursing Process (ADPIE) – D439 Foundations of Nursing',
  },
];
