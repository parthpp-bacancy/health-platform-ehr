# SCHEMA

## Schema Direction
Database: Supabase Postgres
Access model: organization-scoped multi-tenancy with RLS on every table.

## Foundation Principles
- Every tenant-bound table includes `organization_id`
- Every table includes `created_at` and `updated_at`
- Sensitive actions are logged to `audit_logs`
- Access is enforced with RLS, not only application logic
- Public/client code never uses service-role credentials

## Initial Tables (Planned)

### organizations
Top-level tenant record for each clinic or healthcare organization.
- id
- name
- slug
- status
- created_at
- updated_at

### organization_settings
Org-level preferences and defaults.
- id
- organization_id
- timezone
- branding_json
- scheduling_json
- created_at
- updated_at

### memberships
Maps authenticated users into organizations and roles.
- id
- organization_id
- user_id
- role
- status
- created_at
- updated_at

### patient_profiles
Patient identity and demographic record within an organization.
- id
- organization_id
- user_id
- first_name
- last_name
- date_of_birth
- phone
- email
- status
- created_at
- updated_at

### provider_profiles
Provider/staff profile for scheduling and care delivery.
- id
- organization_id
- user_id
- first_name
- last_name
- title
- specialty
- status
- created_at
- updated_at

### appointment_types
Defines appointment offerings.
- id
- organization_id
- name
- duration_minutes
- is_virtual
- is_active
- created_at
- updated_at

### provider_availability
Availability windows used for booking.
- id
- organization_id
- provider_profile_id
- weekday
- start_time
- end_time
- timezone
- created_at
- updated_at

### appointments
Patient-provider booking records.
- id
- organization_id
- patient_profile_id
- provider_profile_id
- appointment_type_id
- starts_at
- ends_at
- status
- video_room_ref
- created_by
- created_at
- updated_at

### encounters
Clinical visit record, usually linked to an appointment.
- id
- organization_id
- appointment_id
- patient_profile_id
- provider_profile_id
- status
- started_at
- completed_at
- created_at
- updated_at

### clinical_notes
Structured or semi-structured note linked to an encounter.
- id
- organization_id
- encounter_id
- note_type
- content_json
- signed_at
- created_by
- created_at
- updated_at

### conversations
Messaging container for secure communication.
- id
- organization_id
- patient_profile_id
- subject
- created_at
- updated_at

### conversation_members
Tracks which users can access a conversation.
- id
- conversation_id
- user_id
- member_role
- created_at

### messages
Individual secure messages.
- id
- organization_id
- conversation_id
- sender_user_id
- body
- sent_at
- created_at

### documents
Uploaded files and generated documents.
- id
- organization_id
- patient_profile_id
- encounter_id
- storage_path
- document_type
- uploaded_by
- created_at

### consents
Consent versioning and signature tracking.
- id
- organization_id
- patient_profile_id
- consent_type
- version
- status
- signed_at
- document_id
- created_at
- updated_at

### audit_logs
Append-only record of sensitive actions.
- id
- organization_id
- actor_user_id
- entity_type
- entity_id
- action
- metadata_json
- created_at

## Initial RLS Strategy
- users read records only for organizations they belong to
- patients read only their own allowed records
- providers access assigned and org-authorized records
- writes for sensitive operations route through validated server-side actions
- all clinical and messaging access is tenant-scoped

## Migration Policy
All schema changes go in:
`supabase/migrations/YYYYMMDDHHMMSS_name.sql`

Every migration must also update this file with:
- tables changed
- policies added or changed
- backfill notes if applicable

## Migration Backlog
1. foundation_organizations_memberships
2. patient_and_provider_profiles
3. scheduling_tables
4. encounters_and_notes
5. messaging_tables
6. documents_and_consents
7. audit_logs
