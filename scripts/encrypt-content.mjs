#!/usr/bin/env node
/**
 * encrypt-content.mjs
 *
 * Encrypts a plaintext file into an AES-GCM JSON blob that can be committed to
 * the repository and decrypted by authenticated users in the web app.
 *
 * The encryption key is derived (PBKDF2-SHA256) from the same credential hash
 * that the login page uses, so the user's login password is the only key
 * material needed — nothing extra has to be stored or remembered.
 *
 * Usage:
 *   node scripts/encrypt-content.mjs <username> <password> <input-file> [output.json]
 *
 * Examples:
 *   node scripts/encrypt-content.mjs alice s3cr3t notes.txt
 *       → writes notes.json next to notes.txt
 *
 *   node scripts/encrypt-content.mjs alice s3cr3t notes.txt src/data/encrypted/notes.json
 *       → writes to the specified output path
 *
 * The resulting JSON file is safe to commit; it contains only ciphertext plus
 * the public PBKDF2 parameters (salt, IV, iterations).  Without the correct
 * username / password combination the content cannot be decrypted.
 */

import { createHash } from 'node:crypto';
import { webcrypto } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, basename, extname, dirname } from 'node:path';

const { subtle } = webcrypto;

// ── helpers ──────────────────────────────────────────────────────────────────

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/** SHA-256 hex digest of a string (sync via Node's crypto module). */
function sha256Hex(str) {
  return createHash('sha256').update(str, 'utf8').digest('hex');
}

/**
 * Derive a 256-bit AES-GCM key from an auth token (hex string) + salt.
 * The auth token itself is SHA-256(username + ':' + password), which matches
 * exactly what the login page stores in sessionStorage as `auth_token`.
 */
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

const [, , username, password, inputArg, outputArg] = process.argv;

if (!username || !password || !inputArg) {
  console.error(
    'Usage: node scripts/encrypt-content.mjs <username> <password> <input-file> [output.json]',
  );
  process.exit(1);
}

const inputPath = resolve(inputArg);
const outputPath = outputArg
  ? resolve(outputArg)
  : inputPath.replace(/\.[^.]+$/, '.json');

const plaintext = await readFile(inputPath, 'utf8');

// Derive the same token the login page creates
const authToken = sha256Hex(`${username}:${password}`);

// Random salt (16 bytes) and IV (12 bytes)
const salt = webcrypto.getRandomValues(new Uint8Array(16));
const iv = webcrypto.getRandomValues(new Uint8Array(12));

const key = await deriveKey(authToken, salt);
const cipherBuffer = await subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plaintext));

const result = {
  version: 1,
  algorithm: 'AES-GCM',
  keyDerivation: 'PBKDF2-SHA256',
  iterations: 100_000,
  salt: toHex(salt),
  iv: toHex(iv),
  ciphertext: toHex(cipherBuffer),
  title: basename(inputPath, extname(inputPath)),
  encryptedAt: new Date().toISOString(),
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, JSON.stringify(result, null, 2) + '\n', 'utf8');

console.log(`✅  Encrypted "${inputArg}" → "${outputArg ?? outputPath}"`);
console.log(`    Auth hash : ${authToken}`);
console.log(`    Algorithm : AES-256-GCM / PBKDF2-SHA256 (${result.iterations.toLocaleString()} iterations)`);
console.log();
console.log('    Commit the output JSON file.  Do NOT commit the plaintext source.');
