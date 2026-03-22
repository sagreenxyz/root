# Root

An [Astro](https://astro.build) site hosted on [GitHub Pages](https://pages.github.com), with client-side authentication protection.

## Features

- ⚡ **Astro 4** static site generation
- 🔐 **Authentication** — SHA-256 password hashing via the Web Crypto API, session stored in `sessionStorage`
- ☁️ **GitHub Pages** — automated deployment via GitHub Actions on every push to `main`
- 📊 **Protected pages** — unauthenticated visitors are redirected to the login page

## Default credentials

| Username | Password |
|----------|----------|
| `admin`  | `admin`  |

> **Changing the password:** Compute `sha256("<username>:<password>")` and replace the `VALID_HASH` constant in `src/pages/login.astro`.

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
