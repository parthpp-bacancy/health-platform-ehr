---
name: new-session
description: >
  Use at the start of every Codex session.
  Reads the `/doc` folder, summarizes current state, blockers, and next task.
allow_implicit_invocation: true
---

# New Session Skill

## Required steps
1. Read `/doc/TASKS.md`, `/doc/PROGRESS.md`, and `/doc/BLOCKERS.md`.
2. Summarize completed work, in-progress work, and blockers.
3. Identify the next highest-priority uncompleted task.
4. Suggest which specialist skill should be invoked next.
