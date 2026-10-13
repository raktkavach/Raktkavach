# Rakt Kavach (रक्त कवच)

National Emergency Blood & Health Network — a React/Vite progressive web app with donor, hospital, laboratory, authority, founder, emergency SOS, and module-explorer routes.

## Run locally

Requires Node.js 20 or newer and the project pnpm workspace.

From the workspace root:

```sh
pnpm --filter @workspace/rakt-kavach run dev
pnpm --filter @workspace/rakt-kavach run typecheck
pnpm --filter @workspace/rakt-kavach run build
```

The Vite server binds to `0.0.0.0` and defaults to port `3000` when no `PORT` is provided. The managed Replit preview supplies its assigned port and base path automatically.

## Project layout

- `src/pages/` — donor, hospital, laboratory, authority, and founder dashboards; SOS and module views
- `src/components/` — shared app and UI components
- `public/icons/` — 192px and 512px installed-app icons derived from the Rakt Kavach emblem
- `vite.config.ts` — Vite settings, PWA manifest, and Workbox service-worker generation
- `../../vercel.json` — workspace-root Vercel build and client-side route fallback

The production build emits `dist/public/manifest.webmanifest` and a Workbox service worker. The current client remains frontend-only; Supabase placeholders are not wired to a backend.
