/**
 * Build-time reveal-token generation.
 * Runs in Node.js during `astro build` ONLY – never shipped to the client bundle.
 * The REVEAL_SECRET env var is consumed here and the resulting token (a short
 * HMAC-SHA256 hex string) is safe to embed in the pre-rendered HTML because it
 * is scoped to a single page and expires with every site rebuild.
 */
import { createHmac } from 'crypto';

/**
 * Returns the UTC calendar date as "YYYY-MM-DD".
 * Used as the fallback build ID in local development when REVEAL_BUILD_ID is
 * not set.
 */
function utcDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Derives a per-build, per-page reveal token.
 *
 * @param secret   - Value of the REVEAL_SECRET build-time environment variable.
 * @param pageSlug - Stable identifier for the page (e.g. "nursing-process").
 * @param buildId  - Unique identifier for the current build (e.g. the GitHub
 *                   Actions run ID).  When omitted or empty the UTC calendar
 *                   date is used as a fallback so local `astro dev` sessions
 *                   still produce a stable, predictable token.
 * @returns        32-character lowercase hex string (first 128 bits of HMAC-SHA256).
 */
export function getRevealToken(secret: string, pageSlug: string, buildId?: string): string {
  if (!secret) {
    // Warn clearly in the build log so developers know reveals are insecure.
    // Never throw here because local `astro dev` runs without production secrets.
    console.warn(
      '[revealToken] WARNING: REVEAL_SECRET is not set. ' +
      'Reveal tokens will use an insecure placeholder. ' +
      'Set REVEAL_SECRET in your environment for production builds.'
    );
  }
  // In CI, buildId is the GitHub Actions run ID (unique per build).
  // In local dev, fall back to the UTC date so the token is still predictable.
  const id = buildId || utcDateString();
  return createHmac('sha256', secret || 'insecure-dev-placeholder')
    .update(`${id}:${pageSlug}`)
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
