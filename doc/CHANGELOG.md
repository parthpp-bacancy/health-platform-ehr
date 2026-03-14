# CHANGELOG

## 2026-03-14
- Removed remaining non-monochrome link styling so the black-and-white theme is consistent across tables.
- Replaced the entire visual system with a monochrome black-and-white palette, including global tokens, buttons, badges, and surface treatments.
- Improved global contrast and readability with stronger surface tokens, darker secondary text, clearer form fields, refined shell panels, and updated auth/dashboard/portal card treatments.
- Tightened the staff Playwright workflow assertions so patient and appointment redirects must land on real detail routes instead of matching /new pages.
- Added the full MVP route surface for auth, staff dashboards, patient portal, patient charts, scheduling, care plans, messaging, admin, and reporting under `src/app/`.
- Added reusable UI primitives, shell components, forms, and table components with an Apple-inspired healthcare SaaS visual system.
- Added a local fallback runtime data layer in `src/lib/demo/` backed by `data/runtime/demo-db.json` so the app remains functional until remote Supabase migrations are applied.
- Added server-side domain services in `src/lib/server/health-data.ts` for dashboards, charts, scheduling, care plans, messaging, reporting, and audit activity.
- Added Supabase migration `supabase/migrations/20260314162000_initial_mvp.sql` covering organizations, profiles, staff roles, providers, patients, scheduling, clinical records, messaging, documents, and audit logs.
- Added auth/profile sync logic, RLS policies, helper functions, and table triggers in the migration.
- Added `scripts/seed-demo.ts` to create demo auth users in Supabase Auth.
- Added server actions and API handlers for patients, appointments, notes, care plans, messaging, reporting, and auth profile retrieval.
- Hardened access control by enforcing role checks in protected pages, server actions, and route handlers.
- Added runtime audit logging for patient creation, appointment creation, SOAP note writes, care plan writes, and sent messages, plus an audit activity panel on the admin page.
- Added Vitest config, Playwright config, unit tests, and E2E coverage for auth, patient creation, appointment booking, and SOAP note signing.
- Rewrote `README.md` with local setup, demo credentials, route map, architecture notes, migration status, and roadmap items.



