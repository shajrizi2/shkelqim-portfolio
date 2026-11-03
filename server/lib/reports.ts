import type { DateRange, ReportFilters, GaReport, GaTotals, SearchReport, SearchTotals, SeriesPoint, TableRow, DashboardReport, SourceResult } from "../../src/lib/analytics/contracts";
import { ANALYTICS_EVENTS } from "../../src/lib/analytics/events";
import { GoogleApiError, googleTransport, type GoogleTransport } from "./google";

type GaRow = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type GaResponse = {
  dimensionHeaders?: { name: string }[]; metricHeaders?: { name: string }[]; rows?: GaRow[];
  rowCount?: number; metadata?: { timeZone?: string; subjectToThresholding?: boolean; dataLossFromOtherRow?: boolean };
};
type BatchResponse = { reports?: GaResponse[] };
type SearchRow = { keys?: string[]; clicks: number; impressions: number; ctr: number; position: number };
type SearchResponse = { rows?: SearchRow[] };
const contactEvents = ["contact_click", "email_click", "calendly_click", "phone_click"];
const numeric = (value: unknown) => Number.isFinite(Number(value)) ? Number(value) : 0;
const metrics = ["activeUsers", "newUsers", "sessions", "screenPageViews", "engagedSessions", "engagementRate", "userEngagementDuration", "keyEvents"];

function gaRows(report: GaResponse): TableRow[] {
  return (report.rows || []).map(row => {
    const entry: TableRow = { label: row.dimensionValues?.[0]?.value || "(not set)" };
    report.dimensionHeaders?.forEach((header, i) => { entry[header.name] = row.dimensionValues?.[i]?.value || "(not set)"; });
    report.metricHeaders?.forEach((header, i) => { entry[header.name] = numeric(row.metricValues?.[i]?.value); });
    return entry;
  });
}
function gaTotals(report: GaResponse, events: GaResponse): GaTotals {
  const row = gaRows(report)[0] || {};
  return {
    activeUsers: numeric(row.activeUsers), newUsers: numeric(row.newUsers), sessions: numeric(row.sessions),
    screenPageViews: numeric(row.screenPageViews), engagedSessions: numeric(row.engagedSessions),
    engagementRate: numeric(row.engagementRate), userEngagementDuration: numeric(row.userEngagementDuration), keyEvents: numeric(row.keyEvents),
    contactActions: gaRows(events).filter(row => contactEvents.includes(String(row.eventName))).reduce((sum, row) => sum + numeric(row.eventCount), 0),
  };
}
function gaSeries(report: GaResponse): SeriesPoint[] {
  return gaRows(report).map(({ label, ...row }) => ({ ...row, date: label.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3") })).sort((a, b) => a.date.localeCompare(b.date));
}

export async function fetchGa(transport: GoogleTransport, property: string, site: string, range: DateRange, filters: ReportFilters): Promise<GaReport> {
  const expressions: unknown[] = [
    { filter: { fieldName: "hostName", stringFilter: { matchType: "EXACT", value: new URL(site).hostname } } },
    { notExpression: { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/dashboard" } } } },
    { notExpression: { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/api/" } } } },
  ];
  if (filters.channel !== "all") expressions.push({ filter: { fieldName: "sessionDefaultChannelGroup", stringFilter: { matchType: "EXACT", value: filters.channel } } });
  if (filters.device !== "all") expressions.push({ filter: { fieldName: "deviceCategory", stringFilter: { matchType: "EXACT", value: filters.device } } });
  if (filters.page !== "all") expressions.push({ filter: { fieldName: "pagePath", stringFilter: { matchType: "EXACT", value: filters.page } } });
  const current = { startDate: range.start, endDate: range.end };
  const previous = { startDate: range.previousStart, endDate: range.previousEnd };
  const request = (dimensions: string[], requestedMetrics: string[], period = current, eventFilter = false) => ({
    dateRanges: [period], dimensions: dimensions.map(name => ({ name })), metrics: requestedMetrics.map(name => ({ name })),
    dimensionFilter: { andGroup: { expressions: [...expressions, ...(eventFilter ? [{ filter: { fieldName: "eventName", inListFilter: { values: [...ANALYTICS_EVENTS] } } }] : [])] } },
    limit: 1000,
    ...(dimensions.length && !dimensions.includes("date") ? { orderBys: [{ metric: { metricName: requestedMetrics[0] }, desc: true }] } : {}),
  });
  const requests = [
    request([], metrics), request([], metrics, previous),
    request(["date"], ["activeUsers", "sessions", "screenPageViews"]),
    request(["sessionDefaultChannelGroup"], ["sessions", "activeUsers", "engagementRate"]),
    request(["sessionSourceMedium"], ["sessions", "activeUsers"]),
    request(["country"], ["activeUsers", "sessions"]),
    request(["deviceCategory"], ["activeUsers", "sessions"]),
    request(["pagePath"], ["screenPageViews", "activeUsers", "userEngagementDuration"]),
    request(["landingPage"], ["sessions", "activeUsers", "engagedSessions"]),
    request(["eventName"], ["eventCount", "keyEvents"], current, true),
    request(["eventName"], ["eventCount", "keyEvents"], previous, true),
    request(["date", "eventName"], ["eventCount"], current, true),
    request(["pageReferrer"], ["screenPageViews"]),
  ];
  // Google accepts at most five reports per batch. Keep requests bounded and reusable.
  const reports: GaResponse[] = [];
  for (let i = 0; i < requests.length; i += 5) {
    const result = await transport.post<BatchResponse>(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:batchRunReports`, { requests: requests.slice(i, i + 5) });
    if (!result.reports || result.reports.length !== requests.slice(i, i + 5).length) throw new Error("Incomplete GA4 response.");
    reports.push(...result.reports);
  }
  const contactTrend = new Map<string, number>();
  for (const row of gaSeries(reports[11])) {
    if (contactEvents.includes(String(row.eventName))) contactTrend.set(row.date, (contactTrend.get(row.date) || 0) + numeric(row.eventCount));
  }
  const referringDomains = new Map<string, number>();
  for (const row of gaRows(reports[12])) {
    let domain = "(direct / unknown)";
    try { domain = new URL(row.label).hostname; } catch { /* Google's unset referrer is retained as unknown. */ }
    if (domain === new URL(site).hostname) continue;
    referringDomains.set(domain, (referringDomains.get(domain) || 0) + numeric(row.screenPageViews));
  }
  return {
    totals: gaTotals(reports[0], reports[9]), previous: gaTotals(reports[1], reports[10]),
    daily: gaSeries(reports[2]), contactTrend: [...contactTrend].map(([date, contactActions]) => ({ date, contactActions })).sort((a, b) => a.date.localeCompare(b.date)),
    channels: gaRows(reports[3]), referrers: gaRows(reports[4]), countries: gaRows(reports[5]), devices: gaRows(reports[6]),
    referringDomains: [...referringDomains].map(([label, screenPageViews]) => ({ label, screenPageViews })).sort((a, b) => b.screenPageViews - a.screenPageViews),
    pages: gaRows(reports[7]), landingPages: gaRows(reports[8]), events: gaRows(reports[9]),
    timezone: reports[0].metadata?.timeZone || "GA4 property timezone",
    thresholded: reports.some(report => report.metadata?.subjectToThresholding),
    truncated: reports.some(report => report.metadata?.dataLossFromOtherRow || (report.rowCount || 0) > 1000),
  };
}

const searchTotals = (response: SearchResponse): SearchTotals => {
  const row = response.rows?.[0];
  return row ? { clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position } : { clicks: 0, impressions: 0, ctr: 0, position: null };
};
const searchRows = (response: SearchResponse): TableRow[] => (response.rows || []).map(row => ({ label: row.keys?.[0] || "(not set)", clicks: row.clicks, impressions: row.impressions, ctr: row.ctr, position: row.position }));

export async function fetchSearch(transport: GoogleTransport, property: string, site: string, range: DateRange, filters: ReportFilters): Promise<SearchReport> {
  const filterList = [
    ...(filters.device !== "all" ? [{ dimension: "device", operator: "equals", expression: filters.device.toUpperCase() }] : []),
    ...(filters.page !== "all" ? [{ dimension: "page", operator: "equals", expression: new URL(filters.page, site).toString() }] : []),
  ];
  const query = (dimensions: string[], previous = false) => transport.post<SearchResponse>(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
    { startDate: previous ? range.previousStart : range.start, endDate: previous ? range.previousEnd : range.end,
      dimensions, type: "web", dataState: "final", rowLimit: 1000,
      ...(filterList.length ? { dimensionFilterGroups: [{ groupType: "and", filters: filterList }] } : {}),
    },
  );
  // Seven bounded reports, at most three concurrent calls per source.
  const totals = await Promise.all([query([]), query([], true), query(["date"])]);
  const top = await Promise.all([query(["query"]), query(["page"]), query(["page"], true)]);
  const breakdowns = await Promise.all([query(["country"]), query(["device"])]);
  const pages = searchRows(top[1]);
  const previousPages = new Map(searchRows(top[2]).map(row => [row.label, row]));
  const currentPages = new Map(pages.map(row => [row.label, row]));
  const queries = searchRows(top[0]);
  const visibility = [...new Set([...currentPages.keys(), ...previousPages.keys()])].map(label => {
    const current = currentPages.get(label), previous = previousPages.get(label);
    return {
      label, clicks: numeric(current?.clicks), impressions: numeric(current?.impressions),
      previousClicks: numeric(previous?.clicks), previousImpressions: numeric(previous?.impressions),
      clicksDelta: numeric(current?.clicks) - numeric(previous?.clicks),
      impressionsDelta: numeric(current?.impressions) - numeric(previous?.impressions),
    };
  }).sort((a, b) => Math.abs(b.impressionsDelta) - Math.abs(a.impressionsDelta));
  return {
    totals: searchTotals(totals[0]), previous: searchTotals(totals[1]),
    daily: searchRows(totals[2]).map(({ label, ...row }) => ({ date: label, ...row })).sort((a, b) => a.date.localeCompare(b.date)),
    queries, pages, countries: searchRows(breakdowns[0]), devices: searchRows(breakdowns[1]), visibility,
    lowCtr: queries.filter(row => numeric(row.impressions) >= 20 && numeric(row.ctr) < 0.02).sort((a, b) => numeric(b.impressions) - numeric(a.impressions)),
  };
}

function failure(error: unknown): SourceResult<never> {
  const message = error instanceof GoogleApiError
    ? error.status === 403 ? "Google denied access. Check API enablement and read-only property permissions."
      : error.status === 429 ? "Google's reporting quota is temporarily exhausted. Try again later."
      : "Google reporting is temporarily unavailable. Try again later."
    : "The reporting connection failed. Check the server-side Google credentials and property configuration.";
  return { status: "error", message, syncedAt: null };
}

export function createReportService(env: Record<string, string | undefined>, injectedTransport?: GoogleTransport) {
  const cache = new Map<string, { until: number; value: DashboardReport }>();
  const pending = new Map<string, Promise<DashboardReport>>();
  let transport: GoogleTransport | undefined = injectedTransport;
  return async (range: DateRange, filters: ReportFilters): Promise<DashboardReport> => {
    const key = JSON.stringify({ range, filters });
    const cached = cache.get(key);
    if (cached && cached.until > Date.now()) return { ...cached.value, cached: true };
    if (pending.has(key)) return pending.get(key)!;
    // Reject before starting upstream calls, not after creating their Promise.
    if (pending.size >= 5) throw new Error("Too many reports are running. Try again shortly.");
    const promise = (async (): Promise<DashboardReport> => {
      const result: DashboardReport = {
        range, filters, cached: false,
        ga4: { status: "setup", message: "Connect GA4_PROPERTY_ID and GOOGLE_SERVICE_ACCOUNT_JSON on the server to see real website traffic.", syncedAt: null },
        searchConsole: { status: "setup", message: "Connect SEARCH_CONSOLE_SITE_URL and GOOGLE_SERVICE_ACCOUNT_JSON on the server to see Google Search performance.", syncedAt: null },
      };
      if (!env.GOOGLE_SERVICE_ACCOUNT_JSON && !injectedTransport) return result;
      try { transport ??= googleTransport(env.GOOGLE_SERVICE_ACCOUNT_JSON!); } catch {
        return { ...result, ga4: failure(null), searchConsole: failure(null) };
      }
      const site = env.ANALYTICS_SITE_ORIGIN || "https://hajrizi.dev";
      await Promise.allSettled([
        (async () => {
          if (!env.GA4_PROPERTY_ID) return;
          if (!/^\d+$/.test(env.GA4_PROPERTY_ID)) { result.ga4 = failure(null); return; }
          try {
            const data = await fetchGa(transport!, env.GA4_PROPERTY_ID, site, range, filters);
            result.ga4 = { status: data.totals.sessions || data.totals.screenPageViews || data.totals.activeUsers ? "ready" : "empty", data, syncedAt: new Date().toISOString() };
          } catch (error) { result.ga4 = failure(error); }
        })(),
        (async () => {
          if (!env.SEARCH_CONSOLE_SITE_URL) return;
          if (!/^(sc-domain:[a-z0-9.-]+|https:\/\/[a-z0-9.-]+\/)$/i.test(env.SEARCH_CONSOLE_SITE_URL)) { result.searchConsole = failure(null); return; }
          try {
            const data = await fetchSearch(transport!, env.SEARCH_CONSOLE_SITE_URL, site, range, filters);
            result.searchConsole = { status: data.totals.impressions ? "ready" : "empty", data, syncedAt: new Date().toISOString() };
          } catch (error) { result.searchConsole = failure(error); }
        })(),
      ]);
      if (cache.size >= 30) cache.delete(cache.keys().next().value!);
      cache.set(key, { until: Date.now() + (result.ga4.status === "error" || result.searchConsole.status === "error" ? 30_000 : 300_000), value: result });
      return result;
    })();
    pending.set(key, promise);
    try { return await promise; } finally { pending.delete(key); }
  };
}
