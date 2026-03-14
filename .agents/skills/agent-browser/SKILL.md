---
name: agent-browser
description: >
  Use for end-to-end browser validation after frontend or critical workflow changes.
  Triggers after auth, onboarding, scheduling, note-taking, or messaging UI changes.
allow_implicit_invocation: true
---

# Agent Browser Skill

## Purpose
Create or run Playwright E2E tests for critical flows.

## Required steps
1. Read the changed feature scope from `/doc/TASKS.md` and `/doc/PROGRESS.md`.
2. Add or update specs in `tests/e2e/`.
3. Cover at least the primary happy path and one failure/validation case.
4. Record any unresolved failures in `/doc/BLOCKERS.md`.
5. Write a handoff entry in `/doc/PROGRESS.md`.
