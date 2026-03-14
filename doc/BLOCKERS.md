# BLOCKERS

[2026-03-14] BLOCKER - codex
Problem:   The repository can reach Supabase with the project URL, publishable key, and service-role key, but there is no Supabase CLI link, personal access token, or database connection string available to apply SQL migrations from this environment.
Attempted: Verified the current env contract, checked for a local `supabase` CLI, confirmed service-role API access, and completed all app-side work with a local fallback runtime dataset.
Needs:     A Supabase personal access token plus linked CLI context, or a direct Postgres connection string, or manual execution of the generated SQL migration in the Supabase SQL editor.

Use this format when needed:

[YYYY-MM-DD] BLOCKER - <agent>
Problem:   <what failed or is unclear>
Attempted: <what was tried>
Needs:     <what human input is required>
