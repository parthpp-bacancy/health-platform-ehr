---
name: db-migration
description: >
  Use for any new Supabase table, column, index, trigger, function, or RLS policy.
  Triggers on schema changes, tenant isolation, and migration planning.
allow_implicit_invocation: true
---

# DB Migration Skill

## Purpose
Create safe, auditable Supabase migrations for a multi-tenant healthcare operations platform.

## Required steps
1. Read `/doc/PRD.md`, `/doc/SCHEMA.md`, `/doc/DECISIONS.md`, and `/doc/BLOCKERS.md`.
2. Model changes with `organization_id` unless there is a strong reason not to.
3. Enable RLS on every new table.
4. Write policies using `(select auth.uid())` patterns.
5. Add indexes for tenant and foreign-key access paths.
6. Record the migration in `/doc/SCHEMA.md` and `/doc/CHANGELOG.md`.
7. Add a handoff entry in `/doc/PROGRESS.md`.

## Guardrails
- Never drop data structures without explicit instruction.
- Never create a table without a clear access model.
- Stop and log to `/doc/BLOCKERS.md` if a migration conflicts with existing schema assumptions.
