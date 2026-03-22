#!/usr/bin/env node
/**
 * encrypt-with-hash.mjs
 *
 * Build-time script: reads AUTH_HASH from the environment and encrypts every
 * plaintext file found in src/data/plaintext/ into src/data/encrypted-auto/.
 *
 * This ensures that encrypted content always matches the site's configured
 * credentials, regardless of who runs the build. Run automatically via the
 * "prebuild" and "predev" npm lifecycle scripts.
 *
 * The AUTH_HASH value must be the SHA-256 hex digest of "<username>:<password>"
 * — the same value stored as the AUTH_HASH GitHub Actions secret and used by
 * the login page to verify credentials.
 *
 * Usage (manual):
 *   AUTH_HASH=<64-char-hex> node scripts/encrypt-with-hash.mjs
 *
 * Or set AUTH_HASH in a local .env file and npm scripts will pick it up
 * automatically via Astro's env loading during "npm run dev" / "npm run build".
 */

import { webcrypto } from 'node:crypto';
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { resolve, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const { subtle } = webcrypto;

// Load .env manually so this script can be run outside Astro's build
try {
  const { readFileSync } = await import('node:fs');
  const envPath = resolve(fileURLToPath(new URL('..', import.meta.url)), '.env');
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
} catch {
  // .env file is optional
}

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const plaintextDir = resolve(__dirname, '../src/data/plaintext');
// Separate output directory so build-generated files don't mix with
// manually-encrypted files committed to git via encrypt-content.mjs.
const encryptedDir = resolve(__dirname, '../src/data/encrypted-auto');

// ── helpers ──────────────────────────────────────────────────────────────────

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function deriveKey(authTokenHex, salt) {
  const keyMaterial = await subtle.importKey(
    'raw',
    new TextEncoder().encode(authTokenHex),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

const authHash = process.env.AUTH_HASH ?? '';

if (!authHash) {
  console.warn('⚠️  AUTH_HASH is not set — skipping build-time content encryption.');
  console.warn('    Set AUTH_HASH in your .env file or environment to enable encrypted content.');
  process.exit(0);
}

let files;
try {
  files = await readdir(plaintextDir);
} catch {
  // No plaintext directory — nothing to encrypt
  process.exit(0);
}

const textFiles = files.filter(f => !f.startsWith('.'));
if (textFiles.length === 0) {
  process.exit(0);
}

// Ensure the output directory exists
await mkdir(encryptedDir, { recursive: true });

for (const file of textFiles) {
  const inputPath = resolve(plaintextDir, file);
  const stem = basename(file, extname(file));
  const outputPath = resolve(encryptedDir, `${stem}.json`);

  const plaintext = await readFile(inputPath, 'utf8');

  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(authHash, salt);
  const cipherBuffer = await subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(plaintext),
  );

  const result = {
    version: 1,
    algorithm: 'AES-GCM',
    keyDerivation: 'PBKDF2-SHA256',
    iterations: 100_000,
    salt: toHex(salt),
    iv: toHex(iv),
    ciphertext: toHex(cipherBuffer),
    title: stem,
    encryptedAt: new Date().toISOString(),
  };

  await writeFile(outputPath, JSON.stringify(result, null, 2) + '\n', 'utf8');
  console.log(`✅  Encrypted "${file}" → "${outputPath}"`);
}
