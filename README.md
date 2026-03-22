# sagreenxyz.github.io

https://sagreenxyz.github.io

An [Astro](https://astro.build) site hosted on [GitHub Pages](https://pages.github.com), with client-side authentication protection.

## Features

- ⚡ **Astro 5** static site generation
- 🔐 **Authentication** — SHA-256 password hashing via the Web Crypto API, session stored in `sessionStorage`
- ☁️ **GitHub Pages** — automated deployment via GitHub Actions on every push to `main`
- 📊 **Protected pages** — unauthenticated visitors are redirected to the login page

## Credentials — GitHub Actions Secret

Credentials are **not** stored in source code. Instead, the site is built with a `AUTH_HASH` GitHub Actions secret that contains the SHA-256 hex digest of `<username>:<password>`. This value is injected into the static site at build time and never committed to the repository.

### Step 1 — Compute your hash

Run one of the following commands, replacing `youruser` and `yourpassword` with your chosen credentials:

**Linux / macOS / WSL:**
```bash
echo -n "youruser:yourpassword" | sha256sum
```

**PowerShell (Windows):**
```powershell
[System.BitConverter]::ToString(
  [System.Security.Cryptography.SHA256]::Create().ComputeHash(
    [System.Text.Encoding]::UTF8.GetBytes("youruser:yourpassword")
  )
).Replace("-","").ToLower()
```

**Node.js (any platform):**
```js
node -e "
const { createHash } = require('crypto');
console.log(createHash('sha256').update('youruser:yourpassword').digest('hex'));
"
```

Copy the 64-character hex string that is printed — this is your `AUTH_HASH` value.

### Step 2 — Add the secret to GitHub

1. Open your repository on GitHub.
2. Go to **Settings → Secrets and variables → Actions**.
3. Click **New repository secret**.
4. Set **Name** to `AUTH_HASH`.
5. Paste the 64-character hex string from Step 1 into the **Secret** field.
6. Click **Add secret**.

### Step 3 — Trigger a deploy

Push any commit to `main` (or trigger a manual run via **Actions → Deploy to GitHub Pages → Run workflow**). The build will pick up `AUTH_HASH` automatically and embed it in the generated site.

### Changing credentials later

Repeat Steps 1–3 with your new credentials, then trigger a new deploy. The old hash is replaced automatically.

## Local development

```bash
npm install
npm run dev        # http://localhost:4321/root
```

To test authentication locally, set `AUTH_HASH` in a `.env` file at the project root:

```
AUTH_HASH=<your 64-char sha256 hex digest>
```

## Build

```bash
npm run build      # output in dist/
npm run preview    # preview the built site locally
```

## Deployment

Push to `main` — GitHub Actions will build and deploy to GitHub Pages automatically.

Ensure **GitHub Pages** is enabled for the repository (Settings → Pages → Source: GitHub Actions).
