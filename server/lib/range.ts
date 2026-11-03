import { CHANNELS, type DateRange, type ReportFilters } from "../../src/lib/analytics/contracts";
import { PUBLIC_PATHS } from "../../src/lib/analytics/events";

const day = 86400_000;
const iso = (date: Date) => date.toISOString().slice(0, 10);
function parse(value: string | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Use valid dates in YYYY-MM-DD format.");
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || iso(parsed) !== value) throw new Error("The selected date does not exist.");
  return parsed;
}
export function parseRange(params: URLSearchParams, now = new Date()): { range: DateRange; filters: ReportFilters } {
  const start = parse(params.get("start"));
  const end = parse(params.get("end"));
  const today = new Date(`${iso(now)}T00:00:00Z`);
  const days = Math.round((end.getTime() - start.getTime()) / day) + 1;
  if (days < 1 || days > 366 || end >= today || start.getUTCFullYear() < 2005) throw new Error("Choose 1–366 complete days, ending no later than yesterday (UTC).");
  const channel = params.get("channel") || "all";
  const device = params.get("device") || "all";
  const page = params.get("page") || "all";
  if (channel !== "all" && !CHANNELS.includes(channel)) throw new Error("Unknown acquisition channel.");
  if (!["all", "desktop", "mobile", "tablet"].includes(device)) throw new Error("Unknown device category.");
  if (page !== "all" && !PUBLIC_PATHS.includes(page)) throw new Error("Unknown public page.");
  return {
    range: { start: iso(start), end: iso(end), days, previousStart: iso(new Date(start.getTime() - days * day)), previousEnd: iso(new Date(start.getTime() - day)) },
    filters: { channel, device, page },
  };
}
