---
name: api-endpoint
description: >
  Use for new API routes, Server Actions, and backend mutations.
  Triggers on form submissions, CRUD handlers, webhook endpoints, and validation-heavy flows.
allow_implicit_invocation: true
---

# API Endpoint Skill

## Purpose
Implement secure backend endpoints and server actions for the Next.js + Supabase app.

## Required steps
1. Read `/doc/PRD.md`, `/doc/TASKS.md`, `/doc/SCHEMA.md`, and `/doc/DECISIONS.md`.
2. Define Zod schemas first in `lib/validations/`.
3. Keep simple CRUD in Server Actions; use `/app/api/` for complex or public routes.
4. Validate all input before writes.
5. Use server-only Supabase clients for sensitive operations.
6. Add happy-path and error-path tests where practical.
7. Log deliverables in `/doc/PROGRESS.md`.

## Guardrails
- No service-role exposure in browser code.
- No unvalidated DB writes.
- Public endpoints must be rate-limited.
