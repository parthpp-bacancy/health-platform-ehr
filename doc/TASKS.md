# TASKS

Legend:
- [ ] todo
- [~] in-progress
- [x] done
- [!] blocked

## Milestone 0 — Project Setup
- [ ] Initialize Next.js 15 app with TypeScript, Tailwind, pnpm
- [ ] Configure ESLint, strict TypeScript, path aliases
- [ ] Add shadcn/ui base setup
- [ ] Add Supabase client/server/middleware scaffolding
- [x] Create project doc files and initial planning artifacts — 2026-03-14 10:15

## Milestone 1 — Product Foundation
- [ ] Define initial PRD-approved MVP boundaries
- [ ] Finalize role model: org_admin, provider, staff, patient
- [ ] Define initial route map for auth, dashboard, portal, admin
- [ ] Finalize environment variable contract in `.env.example`

## Milestone 2 — Schema & Auth
- [ ] Create initial Supabase migration for organizations, users linkage, memberships
- [ ] Create patient_profiles table
- [ ] Create provider_profiles table
- [ ] Create organization_settings table
- [ ] Enable RLS on all foundation tables
- [ ] Document migration and RLS policies in `doc/SCHEMA.md`

## Milestone 3 — Scheduling
- [ ] Create appointment_types table
- [ ] Create provider_availability table
- [ ] Create appointments table
- [ ] Add appointment status lifecycle
- [ ] Build booking API / server actions
- [ ] Build provider schedule page
- [ ] Build patient booking flow

## Milestone 4 — Clinical Workflow
- [ ] Create encounters table
- [ ] Create clinical_notes table
- [ ] Build encounter creation flow from appointment
- [ ] Build note editor with template-friendly structure
- [ ] Add encounter timeline to patient profile

## Milestone 5 — Messaging & Documents
- [ ] Create conversations table
- [ ] Create conversation_members table
- [ ] Create messages table
- [ ] Create documents table
- [ ] Create consents table
- [ ] Build secure messaging UI and API
- [ ] Build document upload flow
- [ ] Build consent tracking flow

## Milestone 6 — Dashboards
- [ ] Build provider dashboard
- [ ] Build patient portal dashboard
- [ ] Build org admin dashboard
- [ ] Add skeletons, empty states, and error states

## Milestone 7 — Compliance & Auditability
- [ ] Create audit_logs table
- [ ] Track sensitive actions via server-side audit logging
- [ ] Review RLS coverage and access boundaries
- [ ] Add rate limiting to public endpoints
- [ ] Add basic security checklist review

## Milestone 8 — Testing
- [ ] Add Vitest setup
- [ ] Add schema and utility tests
- [ ] Add API / server action happy-path and error-path tests
- [ ] Add Playwright E2E scaffolding
- [ ] Test auth flow
- [ ] Test booking flow
- [ ] Test provider encounter flow
- [ ] Test messaging flow

## Milestone 9 — Phase 2 Backlog
- [ ] Billing and payments
- [ ] Insurance verification
- [ ] Lab integrations
- [ ] eRx integration
- [ ] Reporting expansion
- [ ] Workflow automation
- [ ] Public API / webhook layer
