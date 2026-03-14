create extension if not exists pgcrypto;

create type public.app_role as enum ('admin', 'provider', 'care_coordinator', 'patient');
create type public.appointment_status as enum ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
create type public.encounter_status as enum ('in_progress', 'completed', 'cancelled');
create type public.intake_status as enum ('invited', 'in_progress', 'completed');
create type public.consent_status as enum ('pending', 'acknowledged', 'revoked');
create type public.care_plan_status as enum ('draft', 'active', 'completed', 'archived');
create type public.thread_status as enum ('open', 'closed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  timezone text not null default 'America/New_York',
  contact_email text,
  phone text,
  status text not null default 'active',
  is_default boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  primary_role public.app_role not null default 'patient',
  first_name text not null default '',
  last_name text not null default '',
  email text not null,
  phone text,
  avatar_url text,
  title text,
  status text not null default 'active',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.staff_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.app_role not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, profile_id, role),
  constraint staff_roles_not_patient check (role <> 'patient')
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  specialty text,
  credentials text,
  bio text,
  is_accepting_new_patients boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.patients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  profile_id uuid unique references public.profiles (id) on delete set null,
  primary_provider_id uuid references public.providers (id) on delete set null,
  mrn text not null,
  first_name text not null,
  last_name text not null,
  date_of_birth date,
  sex text,
  gender_identity text,
  email text,
  phone text,
  address_line_1 text,
  address_line_2 text,
  city text,
  state text,
  postal_code text,
  medical_history_summary text not null default '',
  insurance_notes text not null default '',
  consent_acknowledged boolean not null default false,
  intake_status public.intake_status not null default 'invited',
  portal_access_enabled boolean not null default true,
  last_intake_submitted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (organization_id, mrn)
);

create table if not exists public.patient_contacts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  full_name text not null,
  relationship text not null,
  phone text,
  email text,
  is_emergency_contact boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.patient_insurance (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null unique references public.patients (id) on delete cascade,
  provider_name text,
  plan_name text,
  member_id text,
  group_number text,
  coverage_notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.patient_consents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  consent_type text not null,
  version text not null default 'v1',
  status public.consent_status not null default 'pending',
  acknowledged_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create table if not exists public.allergies (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  allergen text not null,
  reaction text,
  severity text,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.medications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  name text not null,
  dose text,
  frequency text,
  route text,
  status text not null default 'active',
  prescribed_by text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.provider_availability (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  weekday integer not null check (weekday between 0 and 6),
  start_time time not null,
  end_time time not null,
  location_name text not null default 'Virtual',
  visit_mode text not null default 'virtual',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  appointment_type text not null,
  visit_reason text,
  location_name text not null default 'Virtual visit',
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  status public.appointment_status not null default 'scheduled',
  reminder_status text not null default 'pending',
  notes text,
  created_by uuid references public.profiles (id) on delete set null,
  completed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.encounters (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  appointment_id uuid unique references public.appointments (id) on delete set null,
  patient_id uuid not null references public.patients (id) on delete cascade,
  provider_id uuid not null references public.providers (id) on delete cascade,
  status public.encounter_status not null default 'in_progress',
  chief_complaint text,
  visit_summary text,
  shareable_with_patient boolean not null default true,
  started_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.soap_notes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  encounter_id uuid not null unique references public.encounters (id) on delete cascade,
  subjective text not null default '',
  objective text not null default '',
  assessment text not null default '',
  plan text not null default '',
  follow_up text,
  signed_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  updated_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  encounter_id uuid references public.encounters (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  code text,
  title text not null,
  status text not null default 'active',
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.vital_signs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  encounter_id uuid references public.encounters (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  recorded_at timestamptz not null default timezone('utc', now()),
  systolic_bp numeric(5, 2),
  diastolic_bp numeric(5, 2),
  heart_rate numeric(5, 2),
  respiratory_rate numeric(5, 2),
  temperature_f numeric(5, 2),
  oxygen_saturation numeric(5, 2),
  weight_lb numeric(6, 2),
  height_in numeric(5, 2),
  bmi numeric(5, 2),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);
create table if not exists public.care_plans (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  encounter_id uuid references public.encounters (id) on delete set null,
  goal text not null,
  interventions text,
  milestones text,
  status public.care_plan_status not null default 'draft',
  assigned_to uuid references public.profiles (id) on delete set null,
  share_with_patient boolean not null default true,
  next_review_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  encounter_id uuid references public.encounters (id) on delete set null,
  title text not null,
  document_type text not null,
  storage_path text,
  mime_type text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  is_shareable boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  patient_id uuid not null references public.patients (id) on delete cascade,
  owner_profile_id uuid references public.profiles (id) on delete set null,
  subject text not null,
  priority text not null default 'routine',
  status public.thread_status not null default 'open',
  last_message_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  thread_id uuid not null references public.message_threads (id) on delete cascade,
  sender_profile_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  sent_at timestamptz not null default timezone('utc', now()),
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_profile_id uuid references public.profiles (id) on delete set null,
  entity_type text not null,
  entity_id uuid,
  action text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_org on public.profiles (organization_id);
create index if not exists idx_staff_roles_org_role on public.staff_roles (organization_id, role);
create index if not exists idx_providers_org on public.providers (organization_id);
create index if not exists idx_patients_org on public.patients (organization_id);
create index if not exists idx_appointments_org_start on public.appointments (organization_id, scheduled_start);
create index if not exists idx_encounters_patient on public.encounters (patient_id);
create index if not exists idx_threads_patient on public.message_threads (patient_id, last_message_at desc);
create index if not exists idx_messages_thread_sent on public.messages (thread_id, sent_at desc);
create index if not exists idx_audit_logs_org_created on public.audit_logs (organization_id, created_at desc);

insert into public.organizations (name, slug, timezone, contact_email, is_default)
values ('Luma Virtual Care', 'luma-virtual-care', 'America/New_York', 'ops@luma.health', true)
on conflict (slug) do update
set is_default = true,
    updated_at = timezone('utc', now());

create or replace function public.current_organization_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select organization_id from public.profiles where id = (select auth.uid()) limit 1;
$$;

create or replace function public.has_role(target_org_id uuid, allowed_roles public.app_role[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_roles
    where organization_id = target_org_id and profile_id = (select auth.uid()) and role = any (allowed_roles)
  );
$$;

create or replace function public.patient_owned_by_current_user(target_org_id uuid, target_patient_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.patients
    where organization_id = target_org_id and id = target_patient_id and profile_id = (select auth.uid())
  );
$$;
create or replace function public.handle_auth_user_sync()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  resolved_org_id uuid;
  resolved_role public.app_role;
begin
  select id into resolved_org_id from public.organizations where is_default = true order by created_at asc limit 1;
  resolved_role := case
    when coalesce(new.raw_user_meta_data ->> 'role', '') in ('admin', 'provider', 'care_coordinator', 'patient')
      then (new.raw_user_meta_data ->> 'role')::public.app_role
    else 'patient'::public.app_role
  end;

  insert into public.profiles (id, organization_id, primary_role, first_name, last_name, email, phone, avatar_url, title)
  values (
    new.id,
    resolved_org_id,
    resolved_role,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.email, ''),
    nullif(new.phone, ''),
    nullif(new.raw_user_meta_data ->> 'avatar_url', ''),
    nullif(new.raw_user_meta_data ->> 'title', '')
  )
  on conflict (id) do update
  set organization_id = excluded.organization_id,
      primary_role = excluded.primary_role,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      email = excluded.email,
      phone = excluded.phone,
      avatar_url = excluded.avatar_url,
      title = excluded.title,
      updated_at = timezone('utc', now());

  if resolved_role <> 'patient' then
    insert into public.staff_roles (organization_id, profile_id, role, is_primary)
    values (resolved_org_id, new.id, resolved_role, true)
    on conflict (organization_id, profile_id, role) do update
    set is_primary = true,
        updated_at = timezone('utc', now());
  end if;

  if resolved_role = 'provider' then
    insert into public.providers (organization_id, profile_id, specialty, credentials)
    values (resolved_org_id, new.id, nullif(new.raw_user_meta_data ->> 'specialty', ''), nullif(new.raw_user_meta_data ->> 'title', ''))
    on conflict (profile_id) do update
    set specialty = excluded.specialty,
        credentials = excluded.credentials,
        updated_at = timezone('utc', now());
  end if;

  if resolved_role = 'patient' then
    insert into public.patients (organization_id, profile_id, mrn, first_name, last_name, email, phone, intake_status)
    values (
      resolved_org_id,
      new.id,
      concat('PT-', upper(left(replace(new.id::text, '-', ''), 8))),
      coalesce(nullif(new.raw_user_meta_data ->> 'first_name', ''), 'New'),
      coalesce(nullif(new.raw_user_meta_data ->> 'last_name', ''), 'Patient'),
      coalesce(new.email, ''),
      nullif(new.phone, ''),
      'invited'
    )
    on conflict (profile_id) do update
    set first_name = excluded.first_name,
        last_name = excluded.last_name,
        email = excluded.email,
        phone = excluded.phone,
        updated_at = timezone('utc', now());
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_synced on auth.users;
create trigger on_auth_user_synced
after insert or update of email, phone, raw_user_meta_data on auth.users
for each row execute function public.handle_auth_user_sync();

alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.staff_roles enable row level security;
alter table public.providers enable row level security;
alter table public.patients enable row level security;
alter table public.patient_contacts enable row level security;
alter table public.patient_insurance enable row level security;
alter table public.patient_consents enable row level security;
alter table public.allergies enable row level security;
alter table public.medications enable row level security;
alter table public.provider_availability enable row level security;
alter table public.appointments enable row level security;
alter table public.encounters enable row level security;
alter table public.soap_notes enable row level security;
alter table public.diagnoses enable row level security;
alter table public.vital_signs enable row level security;
alter table public.care_plans enable row level security;
alter table public.documents enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.audit_logs enable row level security;

create policy "organizations_select_members" on public.organizations for select using (id = public.current_organization_id());
create policy "organizations_update_admin" on public.organizations for update using (public.has_role(id, array['admin']::public.app_role[])) with check (public.has_role(id, array['admin']::public.app_role[]));
create policy "profiles_select_self_or_staff" on public.profiles for select using (organization_id = public.current_organization_id() and (id = (select auth.uid()) or public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[])));
create policy "profiles_update_self_or_admin" on public.profiles for update using (id = (select auth.uid()) or public.has_role(organization_id, array['admin']::public.app_role[])) with check (id = (select auth.uid()) or public.has_role(organization_id, array['admin']::public.app_role[]));
create policy "staff_roles_select_staff" on public.staff_roles for select using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]));
create policy "staff_roles_admin_all" on public.staff_roles for all using (public.has_role(organization_id, array['admin']::public.app_role[])) with check (public.has_role(organization_id, array['admin']::public.app_role[]));
create policy "providers_select_org" on public.providers for select using (organization_id = public.current_organization_id());
create policy "providers_modify_admin_or_self" on public.providers for all using (public.has_role(organization_id, array['admin']::public.app_role[]) or profile_id = (select auth.uid())) with check (public.has_role(organization_id, array['admin']::public.app_role[]) or profile_id = (select auth.uid()));
create policy "patients_select_access" on public.patients for select using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, id));
create policy "patients_modify_access" on public.patients for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or profile_id = (select auth.uid())) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or profile_id = (select auth.uid()));
create policy "patient_related_access" on public.patient_contacts for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id));
create policy "insurance_access" on public.patient_insurance for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id));
create policy "consents_access" on public.patient_consents for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id));
create policy "allergies_access" on public.allergies for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id));
create policy "medications_access" on public.medications for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id));
create policy "provider_availability_access" on public.provider_availability for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[])) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]));
create policy "appointments_access" on public.appointments for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id));
create policy "encounters_select_access" on public.encounters for select using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id));
create policy "encounters_modify_staff" on public.encounters for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[])) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]));
create policy "soap_notes_select_access" on public.soap_notes for select using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]));
create policy "soap_notes_modify_staff" on public.soap_notes for all using (public.has_role(organization_id, array['admin', 'provider']::public.app_role[])) with check (public.has_role(organization_id, array['admin', 'provider']::public.app_role[]));
create policy "diagnoses_access" on public.diagnoses for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider']::public.app_role[]));
create policy "vitals_access" on public.vital_signs for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]));
create policy "care_plans_select_access" on public.care_plans for select using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or (share_with_patient = true and public.patient_owned_by_current_user(organization_id, patient_id)));
create policy "care_plans_modify_staff" on public.care_plans for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[])) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]));
create policy "documents_access" on public.documents for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]));
create policy "threads_access" on public.message_threads for all using (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id)) with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]) or public.patient_owned_by_current_user(organization_id, patient_id));
create policy "messages_access" on public.messages for all using (organization_id = public.current_organization_id()) with check (organization_id = public.current_organization_id());
create policy "audit_logs_select_admin" on public.audit_logs for select using (public.has_role(organization_id, array['admin']::public.app_role[]));
create policy "audit_logs_insert_staff" on public.audit_logs for insert with check (public.has_role(organization_id, array['admin', 'provider', 'care_coordinator']::public.app_role[]));
create trigger organizations_set_updated_at before update on public.organizations for each row execute function public.set_updated_at();
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger staff_roles_set_updated_at before update on public.staff_roles for each row execute function public.set_updated_at();
create trigger providers_set_updated_at before update on public.providers for each row execute function public.set_updated_at();
create trigger patients_set_updated_at before update on public.patients for each row execute function public.set_updated_at();
create trigger patient_contacts_set_updated_at before update on public.patient_contacts for each row execute function public.set_updated_at();
create trigger patient_insurance_set_updated_at before update on public.patient_insurance for each row execute function public.set_updated_at();
create trigger patient_consents_set_updated_at before update on public.patient_consents for each row execute function public.set_updated_at();
create trigger allergies_set_updated_at before update on public.allergies for each row execute function public.set_updated_at();
create trigger medications_set_updated_at before update on public.medications for each row execute function public.set_updated_at();
create trigger provider_availability_set_updated_at before update on public.provider_availability for each row execute function public.set_updated_at();
create trigger appointments_set_updated_at before update on public.appointments for each row execute function public.set_updated_at();
create trigger encounters_set_updated_at before update on public.encounters for each row execute function public.set_updated_at();
create trigger soap_notes_set_updated_at before update on public.soap_notes for each row execute function public.set_updated_at();
create trigger diagnoses_set_updated_at before update on public.diagnoses for each row execute function public.set_updated_at();
create trigger vital_signs_set_updated_at before update on public.vital_signs for each row execute function public.set_updated_at();
create trigger care_plans_set_updated_at before update on public.care_plans for each row execute function public.set_updated_at();
create trigger documents_set_updated_at before update on public.documents for each row execute function public.set_updated_at();
create trigger message_threads_set_updated_at before update on public.message_threads for each row execute function public.set_updated_at();

