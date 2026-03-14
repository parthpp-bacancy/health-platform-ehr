import { describe, expect, it } from "vitest";

import { getRoleHomePath, hasAnyRole, normalizeRole } from "@/lib/auth/roles";

describe("role helpers", () => {
  it("normalizes unknown roles to patient", () => {
    expect(normalizeRole("unknown")).toBe("patient");
  });

  it("returns the correct landing path for each role", () => {
    expect(getRoleHomePath("admin")).toBe("/dashboard");
    expect(getRoleHomePath("provider")).toBe("/schedule");
    expect(getRoleHomePath("care_coordinator")).toBe("/patients");
    expect(getRoleHomePath("patient")).toBe("/portal");
  });

  it("matches role access against an allow-list", () => {
    expect(hasAnyRole("admin", ["admin", "provider"])).toBe(true);
    expect(hasAnyRole("patient", ["admin", "provider"])).toBe(false);
  });
});
