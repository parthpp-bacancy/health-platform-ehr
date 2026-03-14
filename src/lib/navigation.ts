import { CalendarDays, ClipboardPlus, LayoutDashboard, MessageSquareMore, Settings2, Stethoscope, Users } from "lucide-react";

import { type UserRole } from "@/lib/demo/types";

export type NavItem = {
  href: string;
  label: string;
  roles: UserRole[];
  icon: typeof LayoutDashboard;
};

export const primaryNavigation: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", roles: ["admin", "provider", "care_coordinator"], icon: LayoutDashboard },
  { href: "/portal", label: "My Portal", roles: ["patient"], icon: LayoutDashboard },
  { href: "/patients", label: "Patients", roles: ["admin", "provider", "care_coordinator"], icon: Users },
  { href: "/appointments", label: "Appointments", roles: ["admin", "provider", "care_coordinator", "patient"], icon: CalendarDays },
  { href: "/schedule", label: "Schedule", roles: ["admin", "provider", "care_coordinator"], icon: Stethoscope },
  { href: "/messages", label: "Messages", roles: ["admin", "provider", "care_coordinator", "patient"], icon: MessageSquareMore },
  { href: "/reports", label: "Reports", roles: ["admin", "provider", "care_coordinator"], icon: ClipboardPlus },
  { href: "/admin/users", label: "Settings", roles: ["admin"], icon: Settings2 },
];

