import { UserRole } from "@/lib/demo/types";

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  provider: "Provider",
  care_coordinator: "Care Coordinator",
  patient: "Patient",
};

export function normalizeRole(value?: string | null): UserRole {
  switch (value) {
    case "admin":
    case "provider":
    case "care_coordinator":
    case "patient":
      return value;
    default:
      return "patient";
  }
}

export function isStaffRole(role: UserRole) {
  return role !== "patient";
}

export function hasAnyRole(role: UserRole, allowedRoles: readonly UserRole[]) {
  return allowedRoles.includes(role);
}

export function getRoleHomePath(role: UserRole) {
  switch (role) {
    case "admin":
      return "/dashboard";
    case "provider":
      return "/schedule";
    case "care_coordinator":
      return "/patients";
    case "patient":
      return "/portal";
  }
}
