# Root

An [Astro](https://astro.build) site hosted on [GitHub Pages](https://pages.github.com), with client-side authentication protection.

## Features

- ⚡ **Astro 4** static site generation
- 🔐 **Authentication** — SHA-256 password hashing via the Web Crypto API, session stored in `sessionStorage`
- ☁️ **GitHub Pages** — automated deployment via GitHub Actions on every push to `main`
- 📊 **Protected pages** — unauthenticated visitors are redirected to the login page

## Credentials setup

Credentials are stored as **GitHub Repository secrets** and injected at build time. No plaintext passwords are ever committed to the repository.

### Required secrets

| Secret name         | Description                                      |
|---------------------|--------------------------------------------------|
| `AUTH_USERNAME`     | The login username                               |
| `AUTH_PASSWORD_HASH`| SHA-256 hex digest of the password               |

### Setting secrets

1. Go to your repository on GitHub → **Settings → Secrets and variables → Actions**.
2. Add a new secret named `AUTH_USERNAME` with your chosen username.
3. Compute the SHA-256 hash of your password and add it as `AUTH_PASSWORD_HASH`.

```bash
# Generate AUTH_PASSWORD_HASH (Linux / macOS / Git Bash)
echo -n "yourpassword" | sha256sum | cut -d' ' -f1
```

> **Note:** Use `echo -n` (no trailing newline) to ensure the hash matches what the browser computes.

### Local development

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
# Edit .env.local with your username and password hash
```

## Local development

```bash
npm install
npm run dev        # http://localhost:4321/root
```

## Build

```bash
npm run build      # output in dist/
npm run preview    # preview the built site locally
```

## Deployment

Push to `main` — GitHub Actions will build and deploy to GitHub Pages automatically.

Ensure **GitHub Pages** is enabled for the repository (Settings → Pages → Source: GitHub Actions).

