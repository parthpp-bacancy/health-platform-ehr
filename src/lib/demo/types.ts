export const userRoles = ["admin", "provider", "care_coordinator", "patient"] as const;
export type UserRole = (typeof userRoles)[number];

export const appointmentStatuses = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
] as const;
export type AppointmentStatus = (typeof appointmentStatuses)[number];

export const intakeStatuses = ["invited", "in_progress", "completed"] as const;
export type IntakeStatus = (typeof intakeStatuses)[number];

export const carePlanStatuses = ["draft", "active", "completed", "archived"] as const;
export type CarePlanStatus = (typeof carePlanStatuses)[number];

export type Organization = {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  contactEmail: string;
};

export type Profile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  title?: string;
  specialty?: string;
  avatarUrl?: string;
};

export type Patient = {
  id: string;
  profileId?: string;
  primaryProviderId?: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: string;
  genderIdentity: string;
  email: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  medicalHistorySummary: string;
  insuranceNotes: string;
  consentAcknowledged: boolean;
  intakeStatus: IntakeStatus;
  lastIntakeSubmittedAt?: string;
};

export type PatientContact = {
  id: string;
  patientId: string;
  fullName: string;
  relationship: string;
  phone: string;
  email: string;
  isEmergencyContact: boolean;
};

export type Insurance = {
  id: string;
  patientId: string;
  providerName: string;
  planName: string;
  memberId: string;
  groupNumber: string;
  coverageNotes: string;
};

export type Allergy = {
  id: string;
  patientId: string;
  allergen: string;
  reaction: string;
  severity: string;
  notes: string;
};

export type Medication = {
  id: string;
  patientId: string;
  name: string;
  dose: string;
  frequency: string;
  route: string;
  status: string;
  prescribedBy: string;
};

export type ProviderProfile = {
  id: string;
  profileId: string;
  specialty: string;
  credentials: string;
  bio: string;
  isAcceptingNewPatients: boolean;
};

export type AvailabilityBlock = {
  id: string;
  providerId: string;
  weekday: number;
  startTime: string;
  endTime: string;
  locationName: string;
  visitMode: string;
};

export type Appointment = {
  id: string;
  patientId: string;
  providerId: string;
  appointmentType: string;
  visitReason: string;
  locationName: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: AppointmentStatus;
  reminderStatus: string;
  notes?: string;
};

export type Encounter = {
  id: string;
  appointmentId: string;
  patientId: string;
  providerId: string;
  status: "in_progress" | "completed" | "cancelled";
  chiefComplaint: string;
  visitSummary: string;
  shareableWithPatient: boolean;
  startedAt: string;
  completedAt?: string;
};

export type SoapNote = {
  id: string;
  encounterId: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  followUp?: string;
  signedAt?: string;
};

export type Diagnosis = {
  id: string;
  encounterId: string;
  patientId: string;
  code: string;
  title: string;
  status: string;
  notes?: string;
};

export type VitalSign = {
  id: string;
  encounterId: string;
  patientId: string;
  recordedAt: string;
  systolicBp?: number;
  diastolicBp?: number;
  heartRate?: number;
  weightLb?: number;
  bmi?: number;
  temperatureF?: number;
};

export type CarePlan = {
  id: string;
  patientId: string;
  encounterId?: string;
  goal: string;
  interventions: string;
  milestones: string;
  status: CarePlanStatus;
  assignedTo?: string;
  shareWithPatient: boolean;
  nextReviewAt?: string;
};

export type DocumentMeta = {
  id: string;
  patientId: string;
  encounterId?: string;
  title: string;
  documentType: string;
  mimeType: string;
  isShareable: boolean;
};

export type MessageThread = {
  id: string;
  patientId: string;
  ownerProfileId: string;
  subject: string;
  priority: string;
  status: "open" | "closed";
  lastMessageAt: string;
};

export type Message = {
  id: string;
  threadId: string;
  senderProfileId: string;
  body: string;
  sentAt: string;
  readAt?: string;
};

export type AuditLog = {
  id: string;
  actorProfileId: string;
  entityType: string;
  entityId: string;
  action: string;
  details: Record<string, string | number | boolean>;
  createdAt: string;
};

export type DemoDatabase = {
  organization: Organization;
  profiles: Profile[];
  providers: ProviderProfile[];
  patients: Patient[];
  patientContacts: PatientContact[];
  insurance: Insurance[];
  allergies: Allergy[];
  medications: Medication[];
  availability: AvailabilityBlock[];
  appointments: Appointment[];
  encounters: Encounter[];
  soapNotes: SoapNote[];
  diagnoses: Diagnosis[];
  vitalSigns: VitalSign[];
  carePlans: CarePlan[];
  documents: DocumentMeta[];
  threads: MessageThread[];
  messages: Message[];
  auditLogs: AuditLog[];
};

