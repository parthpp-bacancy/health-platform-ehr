# SCHEMA

## Migration Status
Primary migration file:
- `supabase/migrations/20260314162000_initial_mvp.sql`

Current status:
- SQL migration is complete and ready to apply.
- Remote apply is blocked in this environment because there is no linked Supabase CLI session, personal access token, or direct Postgres connection string.
- `scripts/seed-demo.ts` can already create demo auth users in Supabase Auth.
- Relational seed insertion is intentionally deferred until the migration is applied remotely.

## Schema Shape
Database: Supabase Postgres
Access model: single-organization MVP with tenant-ready `organization_id` scoping and row-level security on protected tables.

### Enums
- `app_role`: `admin`, `provider`, `care_coordinator`, `patient`
- `appointment_status`: `scheduled`, `confirmed`, `completed`, `cancelled`, `no_show`
- `encounter_status`: `in_progress`, `completed`, `cancelled`
- `intake_status`: `invited`, `in_progress`, `completed`
- `consent_status`: `pending`, `acknowledged`, `revoked`
- `care_plan_status`: `draft`, `active`, `completed`, `archived`
- `thread_status`: `open`, `closed`

### Core Organization and Identity Tables
- `organizations`
- `profiles`
- `staff_roles`
- `providers`

### Patient and Intake Tables
- `patients`
- `patient_contacts`
- `patient_insurance`
- `patient_consents`
- `allergies`
- `medications`

### Scheduling Tables
- `provider_availability`
- `appointments`

### Clinical Tables
- `encounters`
- `soap_notes`
- `diagnoses`
- `vital_signs`
- `care_plans`
- `documents`

### Messaging and Compliance Tables
- `message_threads`
- `messages`
- `audit_logs`

## Helper Functions and Triggers
Helper functions in the migration:
- `set_updated_at()`
- `current_organization_id()`
- `has_role(target_org_id uuid, allowed_roles app_role[])`
- `patient_owned_by_current_user(target_org_id uuid, target_patient_id uuid)`
- `handle_auth_user_sync()`

Triggers in the migration:
- `on_auth_user_synced` on `auth.users` to keep `profiles`, `staff_roles`, `providers`, and `patients` aligned with auth metadata
- `*_set_updated_at` triggers across mutable tables to maintain `updated_at`

Default bootstrap data:
- inserts `Luma Virtual Care` as the default organization if it does not already exist

## RLS Model
RLS is enabled on all protected application tables.

Policy posture:
- organization members can read org-scoped records according to role
- patients can only access records tied to their own patient record
- staff roles (`admin`, `provider`, `care_coordinator`) can access org-scoped operational records
- provider-only writes are enforced for SOAP notes
- admin-only visibility is enforced for audit log reads
- staff inserts are allowed for audit log writes

Important policy helpers:
- policies resolve org membership through `profiles.organization_id`
- role checks use `staff_roles`
- patient self-access uses `patient_owned_by_current_user()`

## Indexes
Key indexes included:
- `idx_profiles_org`
- `idx_staff_roles_org_role`
- `idx_providers_org`
- `idx_patients_org`
- `idx_appointments_org_start`
- `idx_encounters_patient`
- `idx_threads_patient`
- `idx_messages_thread_sent`
- `idx_audit_logs_org_created`

## Auth and Seed Notes
`handle_auth_user_sync()` uses auth user metadata to:
- create or update a `profiles` row
- attach staff users to `staff_roles`
- create or update a `providers` row for provider users
- create or update a `patients` row for patient users

`scripts/seed-demo.ts` creates these demo auth users:
- `admin@luma.health`
- `provider@luma.health`
- `care@luma.health`
- `patient@luma.health`

Until the migration is applied, the application uses the local fallback dataset in `data/runtime/demo-db.json` for clinical, scheduling, messaging, reporting, and audit log flows.

## Manual Apply Runbook
Use one of these paths to apply the migration:
1. Link the Supabase project locally and run the migration through the Supabase CLI.
2. Provide a direct Postgres connection string and execute the SQL against the project database.
3. Paste the migration into the Supabase SQL editor and run it manually.

After that:
1. Verify all tables exist.
2. Verify RLS is enabled.
3. Verify `on_auth_user_synced` exists.
4. Extend `scripts/seed-demo.ts` to insert relational demo records that match the local fallback dataset.
