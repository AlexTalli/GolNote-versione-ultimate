## Quick orientation — what this app is

- Expo React Native app using Expo Router (file-based routing under `app/`).
- Purpose: team "multe" (fines) management with two user roles: `mister` and `player`.
- Local persistent storage is an on-device SQLite DB initialized at runtime (`database/database.ts`).

## High-level architecture

- UI: `app/` — Expo Router layouts and screens. Example entry: `app/_layout.tsx` and `app/index.tsx` (role selection).
- State & role: `contexts/RoleContext.tsx` provides `useRole()` (role and playerIdentity) used to decide navigation and visibility.
- Persistence: `database/database.ts` exports a singleton-like DB accessor (via `getDb()` / `initDatabase`) and grouped modules: `teamsDB`, `playersDB`, `finesDB`, `statsDB`.
- Hooks: `hooks/useDatabase.ts` provides composable hooks (`useTeams`, `usePlayers`, `useFines`, `useDashboardStats`) that call the DB layer and return loading/data/refresh helpers.

Why this structure: UI-only code calls hooks, hooks call a small DB service. Keep UI code out of SQL and use hooks for side-effect management and caching.

## Key developer workflows (how to run / build)

- Start in development (mobile/web via Expo):

```bash
npm run dev
```

- Build/export for web:

```bash
npm run build:web
```

- Linting:

```bash
npm run lint
```

Scripts are found in `package.json` — they invoke `expo` commands (note `EXPO_NO_TELEMETRY=1 expo start` for `dev`).

## Project-specific conventions and patterns

- Path alias `@/` is used in imports (e.g. `@/hooks/useDatabase`). Respect `tsconfig.json` baseUrl when adding files.
- Routing groups: parentheses directories in `app/` define route groups — e.g. `(mister)`, `(player)`. Use the same nested layout pattern when adding screens.
- Role-first navigation: `app/index.tsx` sets `role` in `RoleContext` and routes via `expo-router` (`router.replace('/(mister)')`). Maintain this flow when changing onboarding.
- Database initialization must be awaited. `useDatabase()` calls `await initDatabase()` and Root layout (`app/_layout.tsx`) waits on `isInitialized` before rendering app UI. If you add async DB setup steps, follow the same pattern.
- DB API shape: database functions return primitives or arrays and always handle errors internally (they log and return safe defaults). Hooks expect these semantics and call `refresh` loaders after mutating operations.

## SQL / DB conventions to follow

- Tables: `teams`, `players`, `fines`. When adding fields, update:
  - `database/database.ts` schema in `initDatabase()`
  - all SELECT queries in `teamsDB`, `playersDB`, `finesDB`, and `statsDB` that assume column names
- Use provided helper patterns:
  - Read single: `db.getFirstAsync<T>(query, params)`
  - Read many: `db.getAllAsync<T>(query, params)`
  - Mutate: `db.runAsync(query, params)` and return `lastInsertRowId` when creating
- No migration framework: schema changes are destructive unless you write a migration path. Prefer adding nullable columns or write a migration step in `initDatabase()`.

## How screens talk to the DB

- UI components import hooks from `hooks/useDatabase.ts` and call methods returned by them. Example: `useTeams()` exposes `teams, loading, addTeam, deleteTeam, refreshTeams`.
- After any mutation (create/delete/update) the hook re-runs the loader (the hooks call the DB layer and then update local state). Keep this pattern to avoid stale UI.

## Common pitfalls for code changes

- Don’t forget to await DB initialization. If new code touches `initDatabase()` add any async work there and ensure `useDatabase()` awaits it.
- When editing SQL, update the corresponding hook query that shapes results for components (e.g., `playersDB.getAll()` also computes `active_fines` and `total_unpaid`).
- Keep the export names in `database/database.ts` stable (`teamsDB`, `playersDB`, `finesDB`, `statsDB`, `initDatabase`) — hooks import those exact names.

## Files to inspect first when making a change

- `app/_layout.tsx` — app bootstrap and DB init gating
- `app/index.tsx` — role selection and navigation
- `database/database.ts` — schema, queries, DB helpers (primary place to extend persistence)
- `hooks/useDatabase.ts` — hook-side logic, loading/refresh patterns
- `contexts/RoleContext.tsx` — role management (mister/player)
- `components/` — reusable presentational components and modals (follow existing prop shapes)

## Example: Adding a `getTeamById` helper

Follow existing patterns: add a `getFirstAsync` SQL helper in `teamsDB` and return typed result; call it from a new hook or screen and keep the `loading`/`refresh` pattern from `hooks/useDatabase.ts`.

---

If anything here is unclear or you'd like more examples (e.g., a small PR that adds a new DB read operation and a screen using it), tell me which area to expand and I will iterate.
