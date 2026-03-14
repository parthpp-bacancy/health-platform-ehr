# DECISIONS

## 2026-03-14 - Scope the MVP to virtual primary care operations
Decision:
Build the first release around virtual-first primary care workflows instead of a broader all-purpose health platform.

Why:
The current product target is patient onboarding, scheduling, provider workflow, clinical documentation, messaging, reporting, and role-aware operations. That keeps the MVP credible without taking on billing, labs, or prescribing before the operational core is stable.

## 2026-03-14 - Keep the schema single-organization but tenant-ready
Decision:
Use a single-organization MVP with `organization_id` on tenant-bound records and role tables from day one.

Why:
The product only needs one organization right now, but adding the org boundary later would be expensive. Keeping the schema tenant-aware now preserves the future multi-tenant path with less rework.

## 2026-03-14 - Use Supabase Auth immediately, but keep local clinical data fallback until migrations are applied
Decision:
Run authentication against the real Supabase project now, while the clinical, scheduling, messaging, and reporting domain data flows through a local fallback store in `data/runtime/demo-db.json`.

Why:
The environment has valid Supabase auth credentials, but not enough access to apply the SQL migration remotely. This hybrid model keeps the app functional, testable, and wired for the final schema instead of stalling on infrastructure access.

## 2026-03-14 - Enforce access control on the server even in fallback mode
Decision:
Role checks are enforced in protected pages, server actions, and API routes instead of trusting navigation alone.

Why:
UI-only role gating is not sufficient for healthcare workflows. The fallback runtime still needs the same access model shape as the real Supabase-backed version.

## 2026-03-14 - Treat the patient chart as the center of clinical workflow
Decision:
Appointments lead into encounters, SOAP notes, diagnoses, vitals, care plans, documents, and timeline review through the patient chart.

Why:
That keeps provider work coherent and gives the patient portal a clear path for selectively shared summaries later.

## 2026-03-14 - Use client-side navigation after server actions for form workflows
Decision:
Server actions return created entity identifiers, and client forms navigate with `router.push()` instead of relying on thrown redirects.

Why:
These forms already catch errors for toast handling. Catching Next.js redirect exceptions makes the navigation behavior fragile. Returning IDs keeps the flow deterministic and simpler to test.

## 2026-03-14 - Stage advanced healthcare infrastructure behind the roadmap
Decision:
Leave video visits, billing, lab integrations, e-prescribing, advanced notifications, and full multi-tenant controls out of the current release.

Why:
Those capabilities require substantial integration and compliance work. The current release needs a stable operating core first.

## 2026-03-14 - Use semantic surface tokens instead of raw translucent white utilities
Decision:
Favor shared surface and field tokens for panel backgrounds, muted text, and form controls instead of scattering raw `bg-white/*` translucency across the app.

Why:
The original palette looked refined but reduced legibility on secondary text and nested cards. Centralizing the surface system keeps the Apple-inspired tone while preserving readable contrast across dashboards, forms, and portal views.

## 2026-03-14 - Move the UI to a strict black-and-white palette
Decision:
Replace the previous accent-based palette with a pure monochrome system (black, white, and neutral opacity layers).

Why:
The request explicitly calls for a black-and-white interface. Using opacity-based surfaces preserves depth and readability while staying within the monochrome constraint.
