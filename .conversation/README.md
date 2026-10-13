# Rakt Kavach (रक्त कवच)

National Emergency Blood & Health Network — a React/Vite progressive web app with donor, hospital, laboratory, authority, founder, emergency SOS, and module-explorer routes.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

The development server binds to `0.0.0.0:3000`. Replit runs the same command through `.replit`.

```sh
npm run typecheck
npm run build
npm run preview
```

## Project layout

- `src/pages/` — role dashboards, emergency SOS, and module views
- `src/components/` — shared app and UI components
- `public/icons/` — installed-app icon sizes derived from the uploaded Rakt Kavach emblem artwork
- `vite.config.ts` — Vite server settings, PWA manifest, and Workbox service-worker generation
- `vercel.json` — Vite build output and client-side route fallback

The production build emits `dist/manifest.webmanifest` and a Workbox service worker. Supabase environment placeholders are present for future integration; the current client does not yet connect to Supabase.
