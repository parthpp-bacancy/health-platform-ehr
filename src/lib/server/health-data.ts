import { randomUUID } from "node:crypto";

import { compareAsc, format, isToday, isTomorrow, parseISO, startOfWeek } from "date-fns";

import { readDemoDatabase, mutateDemoDatabase } from "@/lib/demo/store";
import {
  type Appointment,
  type AuditLog,
  type DemoDatabase,
  type Message,
  type Profile,
  type UserRole,
} from "@/lib/demo/types";
import {
  type AppointmentFormInput,
  type CarePlanInput,
  type MessageInput,
  type PatientIntakeInput,
  type SoapNoteInput,
} from "@/lib/validations/health";

function sortAppointments(appointments: Appointment[]) {
  return [...appointments].sort((left, right) =>
    compareAsc(parseISO(left.scheduledStart), parseISO(right.scheduledStart))
  );
}

type MessageViewer = {
  userId: string;
  role: UserRole;
};

type AuditEntryInput = {
  actorProfileId: string;
  entityType: string;
  entityId: string;
  action: string;
  details: Record<string, string | number | boolean>;
};

function appendAuditLog(database: DemoDatabase, entry: AuditEntryInput) {
  const auditLog: AuditLog = {
    id: randomUUID(),
    actorProfileId: entry.actorProfileId,
    entityType: entry.entityType,
    entityId: entry.entityId,
    action: entry.action,
    details: entry.details,
    createdAt: new Date().toISOString(),
  };

  database.auditLogs.unshift(auditLog);
}

function filterThreadsForViewer(database: DemoDatabase, viewer?: MessageViewer) {
  if (!viewer || viewer.role !== "patient") {
    return database.threads;
  }

  const patient = database.patients.find((item) => item.profileId === viewer.userId);

  if (!patient) {
    return [];
  }

  return database.threads.filter((thread) => thread.patientId === patient.id);
}

export async function getDashboardSnapshot(role: UserRole, userId: string) {
  const database = await readDemoDatabase();
  const appointments = sortAppointments(database.appointments);
  const todayAppointments = appointments.filter((appointment) => isToday(parseISO(appointment.scheduledStart)));
  const pendingDocumentation = database.encounters.filter((encounter) => {
    const note = database.soapNotes.find((soapNote) => soapNote.encounterId === encounter.id);
    return !note?.signedAt;
  });

  const completedVisitsThisWeek = database.appointments.filter((appointment) => {
    const visitDate = parseISO(appointment.scheduledStart);
    return appointment.status === "completed" && visitDate >= startOfWeek(new Date(), { weekStartsOn: 1 });
  }).length;

  const inboxCount = database.threads.length;
  const totalPatients = database.patients.length;

  if (role === "patient") {
    const patient = database.patients.find((item) => item.profileId === userId) ?? database.patients[0];
    const patientAppointments = appointments.filter((appointment) => appointment.patientId === patient.id);

    return {
      metrics: [
        {
          label: "Upcoming visits",
          value: patientAppointments.filter((item) => item.status !== "completed" && item.status !== "cancelled").length,
          tone: "info" as const,
        },
        {
          label: "Care plans",
          value: database.carePlans.filter((item) => item.patientId === patient.id).length,
          tone: "success" as const,
        },
        {
          label: "Messages",
          value: database.threads.filter((item) => item.patientId === patient.id).length,
          tone: "neutral" as const,
        },
      ],
      agenda: patientAppointments.slice(0, 3),
      pendingDocumentation,
      patient,
    };
  }

  return {
    metrics: [
      { label: "Total patients", value: totalPatients, tone: "neutral" as const },
      { label: "Today's appointments", value: todayAppointments.length, tone: "info" as const },
      { label: "Completed this week", value: completedVisitsThisWeek, tone: "success" as const },
      { label: "Pending documentation", value: pendingDocumentation.length, tone: "warning" as const },
    ],
    agenda: todayAppointments,
    pendingDocumentation,
    inboxCount,
  };
}

export async function listPatients() {
  const database = await readDemoDatabase();
  return database.patients.map((patient) => ({
    ...patient,
    provider: database.providers.find((provider) => provider.id === patient.primaryProviderId),
    latestAppointment: sortAppointments(
      database.appointments.filter((appointment) => appointment.patientId === patient.id)
    ).at(-1),
  }));
}

export async function getPatientChart(patientId: string) {
  const database = await readDemoDatabase();
  const patient = database.patients.find((item) => item.id === patientId);

  if (!patient) {
    return null;
  }

  return {
    patient,
    contacts: database.patientContacts.filter((item) => item.patientId === patientId),
    insurance: database.insurance.find((item) => item.patientId === patientId) ?? null,
    allergies: database.allergies.filter((item) => item.patientId === patientId),
    medications: database.medications.filter((item) => item.patientId === patientId),
    appointments: sortAppointments(database.appointments.filter((item) => item.patientId === patientId)),
    encounters: database.encounters.filter((item) => item.patientId === patientId),
    soapNotes: database.soapNotes.filter((item) =>
      database.encounters.find((encounter) => encounter.id === item.encounterId && encounter.patientId === patientId)
    ),
    diagnoses: database.diagnoses.filter((item) => item.patientId === patientId),
    vitalSigns: database.vitalSigns.filter((item) => item.patientId === patientId),
    carePlans: database.carePlans.filter((item) => item.patientId === patientId),
    documents: database.documents.filter((item) => item.patientId === patientId),
  };
}

export async function listAppointments() {
  const database = await readDemoDatabase();
  return sortAppointments(database.appointments).map((appointment) => ({
    ...appointment,
    patient: database.patients.find((patient) => patient.id === appointment.patientId),
    provider: database.providers.find((provider) => provider.id === appointment.providerId),
  }));
}

export async function getAppointmentDetail(appointmentId: string) {
  const database = await readDemoDatabase();
  const appointment = database.appointments.find((item) => item.id === appointmentId);

  if (!appointment) {
    return null;
  }

  return {
    appointment,
    patient: database.patients.find((patient) => patient.id === appointment.patientId) ?? null,
    provider: database.providers.find((provider) => provider.id === appointment.providerId) ?? null,
    encounter: database.encounters.find((encounter) => encounter.appointmentId === appointment.id) ?? null,
  };
}

export async function listMessageThreads(viewer?: MessageViewer) {
  const database = await readDemoDatabase();
  return filterThreadsForViewer(database, viewer).map((thread) => ({
    ...thread,
    patient: database.patients.find((patient) => patient.id === thread.patientId) ?? null,
    owner: database.profiles.find((profile) => profile.id === thread.ownerProfileId) ?? null,
    unreadCount: database.messages.filter((message) => message.threadId === thread.id && !message.readAt).length,
  }));
}

export async function getMessageThread(threadId: string, viewer?: MessageViewer) {
  const database = await readDemoDatabase();
  const thread = filterThreadsForViewer(database, viewer).find((item) => item.id === threadId);

  if (!thread) {
    return null;
  }

  return {
    thread,
    patient: database.patients.find((patient) => patient.id === thread.patientId) ?? null,
    messages: database.messages
      .filter((message) => message.threadId === threadId)
      .map((message) => ({
        ...message,
        sender: database.profiles.find((profile) => profile.id === message.senderProfileId) ?? null,
      })),
  };
}

export async function listAuditLogs(limit = 10) {
  const database = await readDemoDatabase();
  return database.auditLogs.slice(0, limit).map((entry) => ({
    ...entry,
    actor: database.profiles.find((profile) => profile.id === entry.actorProfileId) ?? null,
  }));
}

export async function getReportsSnapshot() {
  const database = await readDemoDatabase();
  const appointmentsThisWeek = database.appointments.filter(
    (appointment) => parseISO(appointment.scheduledStart) >= startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  return {
    totalPatients: database.patients.length,
    appointmentsThisWeek: appointmentsThisWeek.length,
    completedVisits: appointmentsThisWeek.filter((appointment) => appointment.status === "completed").length,
    pendingDocumentation: database.encounters.filter(
      (encounter) => !database.soapNotes.find((note) => note.encounterId === encounter.id)?.signedAt
    ).length,
    upcomingTomorrow: database.appointments.filter((appointment) => isTomorrow(parseISO(appointment.scheduledStart))).length,
  };
}

export async function createPatient(payload: PatientIntakeInput, actorProfileId: string) {
  return mutateDemoDatabase((database) => {
    const patientId = randomUUID();

    database.patients.unshift({
      id: patientId,
      primaryProviderId: database.providers[0]?.id,
      mrn: `PT-${String(database.patients.length + 1).padStart(4, "0")}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      dateOfBirth: payload.dateOfBirth,
      sex: payload.sex,
      genderIdentity: payload.genderIdentity,
      email: payload.email,
      phone: payload.phone,
      addressLine1: payload.addressLine1,
      city: payload.city,
      state: payload.state,
      postalCode: payload.postalCode,
      medicalHistorySummary: payload.medicalHistorySummary,
      insuranceNotes: payload.insuranceNotes,
      consentAcknowledged: payload.consentAcknowledged,
      intakeStatus: "completed",
      lastIntakeSubmittedAt: new Date().toISOString(),
    });

    database.patientContacts.unshift({
      id: randomUUID(),
      patientId,
      fullName: payload.emergencyContactName,
      relationship: payload.emergencyContactRelationship,
      phone: payload.emergencyContactPhone,
      email: payload.email,
      isEmergencyContact: true,
    });

    appendAuditLog(database, {
      actorProfileId,
      entityType: "patient",
      entityId: patientId,
      action: "patient.created",
      details: {
        consentAcknowledged: payload.consentAcknowledged,
        intakeCompleted: true,
      },
    });

    return patientId;
  });
}

export async function createAppointment(payload: AppointmentFormInput, actorProfileId: string) {
  return mutateDemoDatabase((database) => {
    const appointmentId = randomUUID();

    database.appointments.unshift({
      id: appointmentId,
      patientId: payload.patientId,
      providerId: payload.providerId,
      appointmentType: payload.appointmentType,
      visitReason: payload.visitReason,
      locationName: payload.locationName,
      scheduledStart: payload.scheduledStart,
      scheduledEnd: payload.scheduledEnd,
      status: "scheduled",
      reminderStatus: "pending",
      notes: payload.notes,
    });

    appendAuditLog(database, {
      actorProfileId,
      entityType: "appointment",
      entityId: appointmentId,
      action: "appointment.created",
      details: {
        patientId: payload.patientId,
        providerId: payload.providerId,
      },
    });

    return appointmentId;
  });
}

export async function saveSoapNote(payload: SoapNoteInput, actorProfileId: string) {
  return mutateDemoDatabase((database) => {
    const existing = database.soapNotes.find((note) => note.encounterId === payload.encounterId);

    if (existing) {
      existing.subjective = payload.subjective;
      existing.objective = payload.objective;
      existing.assessment = payload.assessment;
      existing.plan = payload.plan;
      existing.followUp = payload.followUp;
      existing.signedAt = new Date().toISOString();

      appendAuditLog(database, {
        actorProfileId,
        entityType: "soap_note",
        entityId: existing.id,
        action: "soap_note.updated",
        details: {
          encounterId: payload.encounterId,
          signed: true,
        },
      });

      return existing.id;
    }

    const noteId = randomUUID();
    database.soapNotes.unshift({
      id: noteId,
      encounterId: payload.encounterId,
      subjective: payload.subjective,
      objective: payload.objective,
      assessment: payload.assessment,
      plan: payload.plan,
      followUp: payload.followUp,
      signedAt: new Date().toISOString(),
    });

    appendAuditLog(database, {
      actorProfileId,
      entityType: "soap_note",
      entityId: noteId,
      action: "soap_note.created",
      details: {
        encounterId: payload.encounterId,
        signed: true,
      },
    });

    return noteId;
  });
}

export async function saveCarePlan(payload: CarePlanInput, actorProfileId: string) {
  return mutateDemoDatabase((database) => {
    const planId = randomUUID();
    database.carePlans.unshift({
      id: planId,
      patientId: payload.patientId,
      encounterId: payload.encounterId,
      goal: payload.goal,
      interventions: payload.interventions,
      milestones: payload.milestones,
      status: payload.status,
      assignedTo: payload.assignedTo,
      shareWithPatient: payload.shareWithPatient,
      nextReviewAt: payload.nextReviewAt,
    });

    appendAuditLog(database, {
      actorProfileId,
      entityType: "care_plan",
      entityId: planId,
      action: "care_plan.created",
      details: {
        patientId: payload.patientId,
        shareWithPatient: payload.shareWithPatient,
      },
    });

    return planId;
  });
}

export async function sendMessage(payload: MessageInput, senderProfileId: string) {
  return mutateDemoDatabase((database) => {
    const messageId = randomUUID();
    const nextMessage: Message = {
      id: messageId,
      threadId: payload.threadId,
      senderProfileId,
      body: payload.body,
      sentAt: new Date().toISOString(),
    };

    database.messages.push(nextMessage);
    const thread = database.threads.find((item) => item.id === payload.threadId);
    if (thread) {
      thread.lastMessageAt = nextMessage.sentAt;
    }

    appendAuditLog(database, {
      actorProfileId: senderProfileId,
      entityType: "message",
      entityId: messageId,
      action: "message.sent",
      details: {
        threadId: payload.threadId,
      },
    });

    return messageId;
  });
}

export async function findProfileByUserId(userId: string): Promise<Profile | null> {
  const database = await readDemoDatabase();
  return database.profiles.find((profile) => profile.id === userId) ?? null;
}

export async function getPortalSnapshot(userId: string) {
  const database = await readDemoDatabase();
  const patient = database.patients.find((item) => item.profileId === userId) ?? database.patients[0];

  return {
    patient,
    appointments: sortAppointments(database.appointments.filter((item) => item.patientId === patient.id)),
    carePlans: database.carePlans.filter((item) => item.patientId === patient.id),
    notes: database.soapNotes.filter((note) => {
      const encounter = database.encounters.find((item) => item.id === note.encounterId);
      return encounter?.patientId === patient.id && encounter.shareableWithPatient;
    }),
    documents: database.documents.filter((item) => item.patientId === patient.id),
  };
}

export function formatScheduleLabel(isoTimestamp: string) {
  return format(parseISO(isoTimestamp), "EEE, MMM d, h:mm a");
}
