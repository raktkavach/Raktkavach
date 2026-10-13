# Rakt Kavach

Progressive web app for India's emergency blood and health network, with donor and facility dashboards, an SOS flow, and module explorer.

## Run & Operate

- `pnpm --filter @workspace/rakt-kavach run dev` — run the PWA (defaults to port 3000; managed preview supplies its port)
- `pnpm --filter @workspace/rakt-kavach run typecheck` — typecheck the PWA
- `pnpm --filter @workspace/rakt-kavach run build` — typecheck and build the PWA
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/rakt-kavach/src/App.tsx` — application routes and page shell
- `artifacts/rakt-kavach/src/pages/` — role dashboards, emergency SOS, and module explorer
- `artifacts/rakt-kavach/src/index.css` — app styles and theme
- `artifacts/rakt-kavach/vite.config.ts` — Vite and PWA configuration
- `lib/api-spec/openapi.yaml` — shared API contract (currently only the health endpoint)

## Architecture decisions

- The Rakt Kavach artifact is currently frontend-only; its dashboard content is not connected to a database or external service.
- The app is a root-path static Vite artifact with SPA route fallback and a generated Workbox service worker.

## Product

- Donor, hospital, lab, authority, and founder experiences.
- Emergency SOS flow and advanced/full module explorers.
- Installable PWA shell with 192px and 512px icons.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
