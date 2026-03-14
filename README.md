# Luma Health OS

Luma Health OS is a virtual-first primary care MVP built with Next.js, TypeScript, Supabase Auth, Tailwind, Zod, React Hook Form, TanStack Query, TanStack Table, Vitest, and Playwright.

The current implementation delivers:
- role-aware auth and protected navigation
- patient onboarding and chart views
- appointment scheduling
- provider dashboard and schedule
- SOAP note editing
- care plan management
- secure messaging foundation
- reporting and admin surfaces
- Supabase migration and RLS assets

## Current Runtime Model

Supabase Auth is live and validated.

Clinical, scheduling, messaging, and reporting data currently run through a local development fallback store in `data/runtime/demo-db.json`.

Why:
- the repo has valid Supabase project credentials
- the current environment does not have a Supabase CLI link, personal access token, or Postgres connection string
- that prevents applying the SQL migration remotely from this environment

The migration files are ready in `supabase/migrations/`. Once they are applied manually or via a linked CLI session, the relational seed path can be extended against the real database.

## Local Setup

1. Install dependencies:

```bash
pnpm install
```

2. Create `.env` or `.env.local` from `.env.example` and provide:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

3. Optional: seed demo auth users in Supabase Auth:

```bash
pnpm seed:demo
```

4. Start the app:

```bash
pnpm dev
```

5. Open `http://localhost:3000`

## Demo Auth Users

If `pnpm seed:demo` has been run, these accounts are available:

- `admin@luma.health` / `LumaAdmin123!`
- `provider@luma.health` / `LumaProvider123!`
- `care@luma.health` / `LumaCoordinator123!`
- `patient@luma.health` / `LumaPatient123!`

## Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm seed:demo
```

## Route Map

User-facing routes:
- `/sign-in`
- `/dashboard`
- `/portal`
- `/patients`
- `/patients/new`
- `/patients/[patientId]`
- `/appointments`
- `/appointments/[appointmentId]`
- `/schedule`
- `/notes/[encounterId]`
- `/care-plans/[patientId]`
- `/messages`
- `/messages/[threadId]`
- `/admin/users`
- `/reports`

API routes:
- `GET /api/auth/profile`
- `GET /api/patients`
- `POST /api/patients`
- `GET /api/appointments`
- `POST /api/appointments`
- `GET /api/encounters`
- `POST /api/notes`
- `GET /api/care-plans`
- `POST /api/care-plans`
- `GET /api/messages`
- `POST /api/messages`
- `GET /api/reports`

## Architecture Notes

App structure:
- `src/app/(auth)` contains the sign-in and patient sign-up entry
- `src/app/(dashboard)` contains protected operational and patient routes
- `src/app/api` exposes the API-first surface
- `src/app/actions` contains server actions for major write flows
- `src/components` contains the shell, form, table, and messaging UI
- `src/lib/demo` contains the local fallback runtime data store
- `src/lib/server/health-data.ts` is the shared domain service layer
- `src/lib/validations/health.ts` is the source of truth for form contracts
- `supabase/migrations` contains the relational schema and RLS setup

Design:
- calm Apple-inspired neutral palette
- soft rounded surfaces and restrained shadows
- card-based dashboard layout
- role-aware shell and navigation

## Testing

Unit coverage:
- role helpers
- validation schemas

Playwright coverage:
- sign-in page load
- patient sign-up surface
- provider workflow for patient creation, appointment scheduling, and SOAP note signing

## Migration Status

Ready:
- `supabase/migrations/20260314162000_initial_mvp.sql`

Blocked in this environment:
- remote migration execution
- remote relational seed insertion

Required to unblock:
- Supabase personal access token with linked CLI context, or
- direct Postgres connection string, or
- manual execution in the Supabase SQL editor

## Roadmap

Deferred roadmap items:
- video consults
- billing and claims
- lab integrations
- e-prescribing
- advanced notifications
- full multi-tenant org partitioning
