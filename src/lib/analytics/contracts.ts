export type DateRange = { start: string; end: string; previousStart: string; previousEnd: string; days: number };
export type ReportFilters = { channel: string; device: string; page: string };
export type TableRow = { label: string; [metric: string]: string | number | null };
export type SeriesPoint = { date: string; [metric: string]: string | number | null };
export type GaTotals = {
  activeUsers: number; newUsers: number; sessions: number; screenPageViews: number;
  engagedSessions: number; engagementRate: number; userEngagementDuration: number; keyEvents: number; contactActions: number;
};
export type SearchTotals = { clicks: number; impressions: number; ctr: number; position: number | null };
export type GaReport = {
  totals: GaTotals; previous: GaTotals; daily: SeriesPoint[]; contactTrend: SeriesPoint[];
  channels: TableRow[]; referrers: TableRow[]; referringDomains: TableRow[]; countries: TableRow[]; devices: TableRow[];
  pages: TableRow[]; landingPages: TableRow[]; events: TableRow[];
  timezone: string; thresholded: boolean; truncated: boolean;
};
export type SearchReport = {
  totals: SearchTotals; previous: SearchTotals; daily: SeriesPoint[]; queries: TableRow[];
  pages: TableRow[]; countries: TableRow[]; devices: TableRow[];
  lowCtr: TableRow[]; visibility: TableRow[];
};
export type SourceResult<T> =
  | { status: "ready" | "empty"; data: T; syncedAt: string }
  | { status: "setup" | "error"; message: string; syncedAt: null };
export type DashboardReport = {
  range: DateRange; filters: ReportFilters;
  ga4: SourceResult<GaReport>; searchConsole: SourceResult<SearchReport>;
  cached: boolean;
};
export const CHANNELS = ["Direct", "Organic Search", "Referral", "Organic Social", "Paid Search", "Paid Social", "Email", "Unassigned", "Cross-network", "Display", "Organic Video", "Paid Video", "Organic Shopping", "Paid Shopping", "Affiliates", "Audio", "SMS", "Mobile Push Notifications", "Paid Other"];
