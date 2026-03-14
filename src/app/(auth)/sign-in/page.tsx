import type { Metadata } from "next";

import { AuthPanel } from "@/components/auth/auth-panel";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <main className="min-h-screen px-3 py-3 sm:px-4 sm:py-4">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-2 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="surface-card flex rounded-xl px-8 py-8 sm:px-10 lg:px-12">
          <div className="my-auto max-w-xl space-y-5">
            <div className="inline-flex rounded-full border border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">
              Virtual primary care operations
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl font-semibold tracking-tight text-[var(--foreground)]">A calmer operating system for modern virtual care.</h1>
              <p className="text-base leading-8 text-[var(--muted)]">
                Luma combines intake, scheduling, clinical documentation, secure messaging, and reporting in a single interface designed for care teams and patients.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="surface-subtle rounded-xl p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">Patient onboarding</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Demographics, consent, insurance placeholders, and intake completion tracking.</p>
              </div>
              <div className="surface-subtle rounded-xl p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">Clinical workflow</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Scheduling, SOAP notes, care plans, and chart timelines built for care delivery.</p>
              </div>
              <div className="surface-subtle rounded-xl p-4">
                <p className="text-sm font-semibold text-[var(--foreground)]">Operational visibility</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Role-aware dashboards, audit readiness, and lightweight reporting baked in.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="my-auto">
          <AuthPanel />
        </section>
      </div>
    </main>
  );
}
