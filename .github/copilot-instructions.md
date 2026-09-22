## Quick orientation — what this app is

- Expo React Native app using Expo Router (file-based routing under `app/`).
- Purpose: team "multe" (fines) management with two user roles: `mister` and `player`.
- Persistence is backed by Supabase; SQLite is legacy and no longer used as the active app storage layer.

## High-level architecture

- UI: `app/` — Expo Router layouts and screens. Example entry: `app/_layout.tsx` and `app/index.tsx` (role selection).
- State & role: `contexts/RoleContext.tsx` provides `useRole()` (role and playerIdentity) used to decide navigation and visibility.
- Persistence: `database/database.ts` re-exports the Supabase implementation in `database/database.supabase.ts`; the app uses `teamsDB`, `playersDB`, `finesDB`, `chatsDB`, and related modules directly against Supabase.
- Hooks: `hooks/useDatabase.ts` provides composable hooks (`useTeams`, `usePlayers`, `useFines`, `useDashboardStats`) that call the Supabase-backed DB layer and return loading/data/refresh helpers.

Why this structure: UI-only code calls hooks, hooks call the Supabase data service. Keep UI code out of raw data access and use hooks for side-effect management and caching.

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
- Supabase is the live backend. Do not reintroduce SQLite as the primary storage mechanism unless a clear migration plan is explicitly approved.
- DB API shape: Supabase methods return data/error objects and error handling should be done with safe defaults and user-facing alerts where needed. Hooks expect these semantics and call `refresh` loaders after mutating operations.

## SQL / DB conventions to follow

- Data model lives in Supabase tables such as `teams`, `players`, `fines`, `attendance`, and related tables. When adding fields, update:
  - the Supabase table schema and relevant RPCs/functions
  - all queries in `database/database.supabase.ts` that assume column names
  - any hook that reshapes the returned rows for the UI
- Prefer Supabase query patterns and typed accessors. Do not rely on legacy SQLite helper conventions (`getFirstAsync`, `getAllAsync`, `runAsync`) for new work.
- For schema changes, prefer additive migration and verify RLS/permissions in Supabase.

## How screens talk to the DB

- UI components import hooks from `hooks/useDatabase.ts` and call methods returned by them. Example: `useTeams()` exposes `teams, loading, addTeam, deleteTeam, refreshTeams`.
- After any mutation (create/delete/update) the hook re-runs the loader (the hooks call the DB layer and then update local state). Keep this pattern to avoid stale UI.

## Common pitfalls for code changes

- Do not reintroduce SQLite initialization flow when working on the current app; the active storage layer is Supabase.
- When editing SQL, update the corresponding Supabase query or RPC that shapes results for components (e.g., players queries that compute attendance/fine stats).
- Keep the export names in `database/database.ts` stable as a re-export layer, and make sure the actual implementation is kept in `database/database.supabase.ts`.

## Files to inspect first when making a change

- `app/_layout.tsx` — app bootstrap and auth/role gating
- `app/index.tsx` — role selection and navigation
- `database/database.supabase.ts` — active schema, queries, and DB helpers
- `database/database.ts` — compatibility re-export layer
- `hooks/useDatabase.ts` — hook-side logic, loading/refresh patterns
- `contexts/RoleContext.tsx` — role management (mister/player)
- `components/` — reusable presentational components and modals (follow existing prop shapes)

## Example: Adding a `getTeamById` helper

Follow existing patterns in `database/database.supabase.ts`: add a Supabase query or RPC helper in the relevant module and call it from a hook or screen, keeping the `loading`/`refresh` pattern from `hooks/useDatabase.ts`.

---

If anything here is unclear or you'd like more examples (e.g., a small PR that adds a new DB read operation and a screen using it), tell me which area to expand and I will iterate.
