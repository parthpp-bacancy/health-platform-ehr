# PRD — Virtual Care Platform

## Product Summary
A multi-tenant, API-first virtual care platform for small-to-mid-sized specialty clinics, built with Next.js 15 and Supabase. The product will support patient onboarding, appointment booking, video visits, lightweight clinical documentation, secure messaging, consent capture, and organization-aware administration.

This PRD is based on the uploaded blueprint's core direction: patient registration, appointment scheduling, video consultation, EHR-lite records, provider dashboard, patient portal, HIPAA-ready controls, messaging, reporting, and multi-tenant support. The blueprint also recommends focusing the MVP on registration, scheduling, video, simple documentation, patient portal, provider dashboard, and core APIs before expanding.

## Product Goal
Enable digital health organizations to launch a compliant virtual-care workflow without building the full clinical operations stack from scratch.

## Recommended Initial Wedge
Mental health / virtual specialty care for small and growing clinics.

Reasoning:
- strong fit for recurring scheduling
- lighter clinical complexity than full primary care
- async communication matters
- provider dashboard and documentation are central
- billing, labs, and eRx can be phased in later

## Users
### Org Admin
Creates and manages organization, invites providers and staff, manages settings and reporting.

### Provider
Reviews schedule, conducts video visits, writes encounter notes, messages patients, reviews history and documents.

### Patient
Signs up or accepts invite, completes intake and consent forms, books appointments, joins video visits, reviews summaries, sends messages.

### Care / Ops Staff
Manages scheduling, supports onboarding, handles reminders and follow-up tasks.

## MVP Scope
### In Scope
- Multi-tenant organization model
- Auth and role-based access
- Patient registration and onboarding
- Provider onboarding
- Appointment scheduling and availability
- Patient portal
- Provider dashboard
- Video consultation integration
- Encounter records and simple clinical notes
- Secure patient-provider messaging
- Consent capture and document upload
- Audit logging
- Basic reporting and operational metrics
- Core APIs: auth, organizations, patients, providers, appointments, encounters, messages, documents

### Out of Scope for MVP
- e-Prescribing
- Insurance verification
- Claims submission
- Full billing workflows
- Lab ordering and results integration
- Native mobile apps
- AI assistants / AI note generation
- Interoperability hub / FHIR exchange
- White-labeling engine
- Public developer portal

## Core User Flows
### Patient Intake
1. Patient is invited or self-registers
2. Patient verifies account
3. Patient completes intake and consent forms
4. Patient uploads documents
5. Patient books or requests appointment

### Appointment Flow
1. Provider or patient selects available slot
2. Appointment is created
3. Reminder notifications are sent
4. Patient joins video room
5. Provider creates encounter and note
6. Follow-up tasks or next appointment are set

### Messaging Flow
1. Patient or provider starts a conversation
2. Messages are exchanged securely
3. Notifications are sent
4. Conversation remains attached to patient context

### Admin Flow
1. Organization is created
2. Staff and providers are invited
3. Appointment types and templates are configured
4. Reporting dashboard tracks adoption and operations

## Functional Requirements
### Authentication & Authorization
- Email/password and magic-link ready auth
- Organization-aware role model
- Protected dashboard routes
- Session refresh in middleware
- RLS on all tenant data

### Organizations
- Create organization
- Store org settings
- Invite users
- Assign roles per organization

### Patient Management
- Patient profile
- Demographics and contact info
- Intake and consent completion status
- Uploaded documents
- Appointment history
- Conversation history

### Provider Workspace
- Daily schedule / queue
- Upcoming appointments
- Encounter creation
- Clinical note templates
- Patient context summary

### Scheduling
- Provider availability
- Appointment types
- Appointment booking, cancellation, rescheduling
- Appointment status changes
- Reminder hooks

### Encounters / Clinical Notes
- Encounter record linked to appointment
- Simple SOAP/progress note support
- Attach diagnoses, medications, allergies, vitals later
- Timestamped auditability

### Messaging
- Secure threaded messaging
- Participant-scoped access
- Read status
- Notification trigger support

### Documents & Consent
- Consent template and signed copy tracking
- Document upload and retrieval
- Organization-level document policy support

### Reporting
- Appointments by status
- Active patients
- Provider utilization
- Messaging adoption
- Portal usage basics

## Non-Functional Requirements
- Multi-tenant isolation from day one
- Strict TypeScript
- Zod validation for every mutation
- Supabase RLS on every table
- Server-side data access by default
- Basic audit log for sensitive actions
- Mobile-first responsive UI
- Accessible forms and navigation

## KPIs
- Patient activation rate
- Appointment booking completion rate
- Visit completion rate
- Portal adoption rate
- Provider documentation time
- Message response time
- Monthly active organizations
- API error rate / uptime

## Tech Direction
- Next.js 15 App Router
- TypeScript strict mode
- Supabase Postgres + Auth + Storage + RLS
- Tailwind + shadcn/ui
- React Hook Form + Zod
- TanStack Query for client-side server state when needed
- Server Actions / route handlers for mutations
- External HIPAA-ready video provider
- External notifications / email provider
