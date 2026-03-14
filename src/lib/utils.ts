import { format, parseISO } from "date-fns";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMetricValue(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatScheduleLabel(isoTimestamp: string) {
  return format(parseISO(isoTimestamp), "EEE, MMM d · h:mm a");
}
