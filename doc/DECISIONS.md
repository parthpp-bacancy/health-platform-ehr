# DECISIONS

## 2026-03-14 — Focus the MVP on virtual specialty care
Decision:
Build the first version for a virtual specialty-care workflow rather than a broad all-purpose EHR.

Why:
The uploaded blueprint spans scheduling, clinical workflows, billing, labs, messaging, analytics, compliance, and platform APIs. To reduce delivery risk, the MVP will focus on onboarding, scheduling, video visits, simple documentation, patient portal, provider dashboard, messaging, documents, and auditability.

## 2026-03-14 — Use multi-tenancy from day one
Decision:
Every core record will be organization-scoped.

Why:
The blueprint calls out multi-tenant architecture as a must-have. Retrofitting tenancy later would complicate schema, permissions, and customer onboarding.

## 2026-03-14 — Treat encounter as the center of the clinical workflow
Decision:
Appointments can create or link to encounters, and clinical notes hang from encounters.

Why:
This keeps clinical workflow coherent and avoids scattering note context across appointments, messages, and records.

## 2026-03-14 — Externalize domain-heavy services
Decision:
Use external providers for video, notifications, and later eRx / claims rather than building those capabilities directly in the core app.

Why:
Next.js + Supabase are strong for product workflows and tenant-aware data, but video, prescribing, and claims are better handled by specialized vendors.

## 2026-03-14 — Delay billing, insurance, labs, and AI
Decision:
Exclude billing, insurance verification, lab ordering, interoperability hub, and AI features from MVP.

Why:
These features are valid roadmap items from the blueprint, but they add significant technical and operational complexity before product-market-fit is validated.
