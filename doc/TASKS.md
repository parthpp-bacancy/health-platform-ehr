# TASKS

Legend:
- [ ] todo
- [~] in-progress
- [x] done
- [!] blocked

## Milestone 0 - Project Setup
- [x] Initialize Next.js App Router app with TypeScript, Tailwind, and `pnpm` - 2026-03-14 16:32
- [x] Configure ESLint, strict TypeScript, path aliases, Vitest, Playwright, and Prettier - 2026-03-14 16:32
- [x] Add reusable UI primitives and the Apple-inspired visual system foundations - 2026-03-14 16:32
- [x] Add Supabase client/server/admin/middleware scaffolding - 2026-03-14 14:56
- [x] Create project doc files and initial planning artifacts - 2026-03-14 10:15

## Milestone 1 - Product Foundation
- [x] Define MVP boundaries around virtual primary care operations - 2026-03-14 16:32
- [x] Finalize role model: `admin`, `provider`, `care_coordinator`, `patient` - 2026-03-14 16:32
- [x] Define the route map for auth, dashboards, portal, admin, reporting, and clinical workflows - 2026-03-14 16:32
- [x] Finalize environment variable contract in `.env.example` - 2026-03-14 14:56

## Milestone 2 - Schema & Auth
- [x] Create the initial Supabase migration for organizations, profiles, staff roles, providers, patients, appointments, encounters, notes, care plans, messaging, documents, and audit logs - 2026-03-14 16:32
- [x] Add auth-to-profile sync via `handle_auth_user_sync()` trigger - 2026-03-14 16:32
- [x] Enable RLS on protected tables and add foundation policies - 2026-03-14 16:32
- [x] Add demo auth user seed script for Supabase Auth - 2026-03-14 16:32
- [~] Apply the migration to the remote Supabase project - blocked by missing CLI link, PAT, or direct Postgres connection string
- [x] Document the schema and RLS model in `doc/SCHEMA.md` - 2026-03-14 16:32

## Milestone 3 - Scheduling
- [x] Create `provider_availability` and `appointments` schema - 2026-03-14 16:32
- [x] Add the appointment lifecycle: `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show` - 2026-03-14 16:32
- [x] Build booking API handlers and server actions - 2026-03-14 16:32
- [x] Build the appointments list and detail views - 2026-03-14 16:32
- [x] Build the provider schedule and patient queue views - 2026-03-14 16:32

## Milestone 4 - Clinical Workflow
- [x] Create `encounters`, `soap_notes`, `diagnoses`, `vital_signs`, and `care_plans` schema - 2026-03-14 16:32
- [x] Build the patient chart timeline and chart summary views - 2026-03-14 16:32
- [x] Build the SOAP note editor workflow - 2026-03-14 16:32
- [x] Build the care plan workflow and patient-facing summary surface - 2026-03-14 16:32

## Milestone 5 - Messaging & Documents
- [x] Create `message_threads` and `messages` schema - 2026-03-14 16:32
- [x] Create `documents` and `patient_consents` schema foundations - 2026-03-14 16:32
- [x] Build the secure messaging inbox and thread views - 2026-03-14 16:32
- [x] Add role-aware messaging API handlers and unread tracking foundations - 2026-03-14 16:32
- [ ] Build document upload against Supabase Storage
- [~] Expand consent tracking beyond intake acknowledgement into a full patient-facing workflow

## Milestone 6 - Dashboards
- [x] Build the staff dashboard with metrics, agenda, and documentation queue - 2026-03-14 16:32
- [x] Build the patient portal dashboard - 2026-03-14 16:32
- [x] Build the admin users/settings dashboard - 2026-03-14 16:32
- [x] Add operational reporting and KPI cards - 2026-03-14 16:32
- [x] Improve global text contrast and surface readability across auth, dashboard, forms, and portal views - 2026-03-14 16:52
- [x] Add empty-state and error-state coverage across the primary views - 2026-03-14 16:32

## Milestone 7 - Compliance & Auditability
- [x] Create `audit_logs` table and supporting policies - 2026-03-14 16:32
- [x] Record key write actions in the local runtime audit log - 2026-03-14 16:32
- [x] Enforce role checks in pages, server actions, and API routes - 2026-03-14 16:32
- [ ] Add rate limiting to public endpoints
- [~] Add a fuller security hardening checklist for deployment and manual migration execution

## Milestone 8 - Testing
- [x] Add Vitest setup - 2026-03-14 16:32
- [x] Add role helper and validation schema tests - 2026-03-14 16:32
- [x] Add Playwright E2E scaffolding - 2026-03-14 16:32
- [x] Test auth flow - 2026-03-14 16:32
- [x] Test patient creation flow - 2026-03-14 16:32
- [x] Test appointment booking flow - 2026-03-14 16:32
- [x] Test provider SOAP note workflow - 2026-03-14 16:32
- [ ] Add messaging E2E coverage
- [ ] Add API / server action error-path tests

## Milestone 9 - Phase 2 Backlog
- [ ] Video consult workflow
- [ ] Billing and claims
- [ ] Lab integrations
- [ ] e-prescribing
- [ ] Advanced notifications
- [ ] Multi-tenant organization partitioning
- [ ] Public API / webhook layer

