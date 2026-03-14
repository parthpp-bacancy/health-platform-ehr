---
name: pr-review
description: >
  Explicit-only skill for final review before commit or merge.
  Checks correctness, type safety, security, architecture compliance, and documentation updates.
allow_implicit_invocation: false
---

# PR Review Skill

## Review checklist
- Code matches PRD and current task scope.
- No `any`, no client-side service role exposure, no skipped validation.
- RLS and tenant boundaries are respected.
- Tests cover the changed behavior appropriately.
- `/doc` files were updated.
- Deliverables listed in handoff records exist on disk.

## Output format
Append a short review note to `/doc/CHANGELOG.md` and write a handoff line in `/doc/PROGRESS.md`.
