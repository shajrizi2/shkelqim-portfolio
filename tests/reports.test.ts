import { test } from "node:test";
import assert from "node:assert/strict";
import { createReportService, fetchGa, fetchSearch } from "../server/lib/reports";
import { GoogleApiError, type GoogleTransport } from "../server/lib/google";
import { parseRange } from "../server/lib/range";

const { range, filters } = parseRange(new URLSearchParams("start=2026-10-01&end=2026-10-30"), new Date("2026-11-03T12:00:00Z"));
type GaRequest = { dimensions: { name: string }[]; metrics: { name: string }[]; dateRanges: { startDate: string }[]; dimensionFilter: unknown; limit: number };
type SearchRequest = { dimensions: string[]; startDate: string; dataState: string; rowLimit: number; dimensionFilterGroups?: unknown };

// Synthetic responses exist only in tests. The application has no mock-data fallback.
function fakeTransport(empty = false) {
  const calls: { url: string; body: unknown }[] = [];
  const transport: GoogleTransport = {
    async post<T>(url: string, body: unknown): Promise<T> {
      calls.push({ url, body });
      if (url.includes("analyticsdata.googleapis.com")) {
        const reports = (body as { requests: GaRequest[] }).requests.map(request => {
          const dims = request.dimensions.map(dimension => dimension.name);
          const previous = request.dateRanges[0].startDate !== range.start;
          const values: Record<string, number> = { activeUsers: previous ? 5 : 10, newUsers: 6, sessions: previous ? 6 : 12, screenPageViews: 20, engagedSessions: 5, engagementRate: .4, userEngagementDuration: 240, keyEvents: 1, eventCount: 1 };
          const names: Record<string, string> = { date: "20261001", sessionDefaultChannelGroup: "Organic Search", sessionSourceMedium: "google / organic", country: "Kosovo", deviceCategory: "desktop", pagePath: "/", landingPage: "/", eventName: "contact_click", pageReferrer: "https://agency.example/path?token=do-not-display" };
          let raw: { dimensions: string[]; values: Record<string, number> }[] = [{ dimensions: dims.map(dim => names[dim]), values }];
          if (dims.join(",") === "date") raw = [
            { dimensions: ["20261001"], values: { activeUsers: 8, sessions: 7, screenPageViews: 12 } },
            { dimensions: ["20261002"], values: { activeUsers: 9, sessions: 5, screenPageViews: 8 } },
          ];
          if (dims.join(",") === "eventName") raw = previous ? [{ dimensions: ["email_click"], values: { eventCount: 1, keyEvents: 0 } }] : [
            { dimensions: ["contact_click"], values: { eventCount: 3, keyEvents: 0 } },
            { dimensions: ["email_click"], values: { eventCount: 2, keyEvents: 0 } },
            { dimensions: ["calendly_click"], values: { eventCount: 1, keyEvents: 0 } },
            { dimensions: ["github_click"], values: { eventCount: 4, keyEvents: 0 } },
          ];
          if (dims.join(",") === "date,eventName") raw = [
            { dimensions: ["20261001", "contact_click"], values: { eventCount: 2 } },
            { dimensions: ["20261001", "email_click"], values: { eventCount: 1 } },
            { dimensions: ["20261002", "calendly_click"], values: { eventCount: 1 } },
            { dimensions: ["20261002", "github_click"], values: { eventCount: 7 } },
          ];
          return {
            dimensionHeaders: dims.map(name => ({ name })), metricHeaders: request.metrics,
            rows: empty ? [] : raw.map(row => ({ dimensionValues: row.dimensions.map(value => ({ value })), metricValues: request.metrics.map(metric => ({ value: String(row.values[metric.name] || 0) })) })),
            rowCount: empty ? 0 : raw.length, metadata: { timeZone: "Europe/Tirane", subjectToThresholding: false },
          };
        });
        return { reports } as T;
      }
      const request = body as SearchRequest;
      const previous = request.startDate !== range.start;
      const row = (key?: string, clicks = previous ? 50 : 100, impressions = previous ? 500 : 1000, ctr = clicks / impressions, position = 12) => ({ ...(key ? { keys: [key] } : {}), clicks, impressions, ctr, position });
      let rows = [row(request.dimensions.length ? request.dimensions[0] === "page" ? "https://hajrizi.dev/" : "value" : undefined)];
      if (request.dimensions[0] === "query") rows = [row("high impressions low ctr", 10, 1000, .01), row("brand", 90, 200, .45)];
      if (request.dimensions[0] === "date") rows = [row("2026-10-01", 40, 400), row("2026-10-02", 60, 600)];
      return { rows: empty ? [] : rows } as T;
    },
  };
  return { calls, transport };
}

test("GA4 requests are bounded, unique totals are not summed and events remain clicks", async () => {
  const { transport, calls } = fakeTransport();
  const report = await fetchGa(transport, "123456", "https://hajrizi.dev", range, { ...filters, channel: "Organic Search", device: "desktop", page: "/" });
  assert.equal(calls.length, 3);
  for (const call of calls) {
    const batch = call.body as { requests: GaRequest[] };
    assert.ok(batch.requests.length <= 5);
    for (const request of batch.requests) {
      assert.equal(request.limit, 1000);
      const serialized = JSON.stringify(request.dimensionFilter);
      for (const filter of ["hostName", "pagePath", "sessionDefaultChannelGroup", "deviceCategory", "hajrizi.dev"]) assert.ok(serialized.includes(filter));
    }
  }
  assert.equal(report.totals.activeUsers, 10); // Daily rows contain 8 + 9, not 17 unique period users.
  assert.equal(report.previous.activeUsers, 5);
  assert.equal(report.totals.contactActions, 6);
  assert.equal(report.previous.contactActions, 1);
  assert.deepEqual(report.contactTrend, [{ date: "2026-10-01", contactActions: 3 }, { date: "2026-10-02", contactActions: 1 }]);
  assert.equal(report.referringDomains[0].label, "agency.example");
  assert.doesNotMatch(JSON.stringify(report.referringDomains), /token|path/);
  assert.equal(report.timezone, "Europe/Tirane");
});

test("Search Console remains finalized Google Search data with independent dimensions", async () => {
  const { transport, calls } = fakeTransport();
  const report = await fetchSearch(transport, "sc-domain:hajrizi.dev", "https://hajrizi.dev", range, { ...filters, channel: "Referral", device: "mobile", page: "/work/" });
  assert.equal(calls.length, 8);
  assert.ok(calls.every(call => call.url.includes("sc-domain%3Ahajrizi.dev")));
  for (const call of calls) {
    const body = call.body as SearchRequest;
    assert.equal(body.dataState, "final");
    assert.equal(body.rowLimit, 1000);
    assert.ok(JSON.stringify(body).includes("MOBILE"));
    assert.ok(JSON.stringify(body).includes("https://hajrizi.dev/work/"));
    assert.ok(!JSON.stringify(body).includes("Referral")); // Channel filter is GA4-only.
  }
  assert.equal(report.totals.ctr, .1);
  assert.equal(report.totals.position, 12);
  assert.equal(report.lowCtr.length, 1);
  assert.equal(report.visibility[0].impressionsDelta, 500);
  assert.equal(report.daily[0].date, "2026-10-01");
});

test("unconfigured sources show setup without invented analytics", async () => {
  const result = await createReportService({})(range, filters);
  assert.equal(result.ga4.status, "setup");
  assert.equal(result.searchConsole.status, "setup");
  assert.ok(!("data" in result.ga4));
  assert.ok(!("data" in result.searchConsole));
});

test("configured APIs with empty responses show truthful zero and no-position states", async () => {
  const { transport } = fakeTransport(true);
  const result = await createReportService({ GA4_PROPERTY_ID: "123456", SEARCH_CONSOLE_SITE_URL: "sc-domain:hajrizi.dev" }, transport)(range, filters);
  assert.equal(result.ga4.status, "empty");
  assert.equal(result.searchConsole.status, "empty");
  if (result.ga4.status === "empty") assert.equal(result.ga4.data.totals.activeUsers, 0);
  if (result.searchConsole.status === "empty") assert.equal(result.searchConsole.data.totals.position, null);
});

test("source failures are isolated and credential details never leave the server", async () => {
  const { transport } = fakeTransport();
  const broken: GoogleTransport = { post: <T>(url: string, body: unknown) => {
    if (url.includes("analyticsdata")) throw new GoogleApiError(403);
    return transport.post<T>(url, body);
  } };
  const result = await createReportService({ GA4_PROPERTY_ID: "123456", SEARCH_CONSOLE_SITE_URL: "sc-domain:hajrizi.dev" }, broken)(range, filters);
  assert.equal(result.ga4.status, "error");
  assert.equal(result.searchConsole.status, "ready");
  assert.doesNotMatch(JSON.stringify(result), /access_token|private_key|Bearer/);
});

test("reports coalesce concurrent requests and cache only the authorized service layer", async () => {
  const { transport, calls } = fakeTransport();
  const service = createReportService({ GA4_PROPERTY_ID: "123456", SEARCH_CONSOLE_SITE_URL: "sc-domain:hajrizi.dev" }, transport);
  await Promise.all([service(range, filters), service(range, filters), service(range, filters)]);
  assert.equal(calls.length, 11);
  const cached = await service(range, filters);
  assert.equal(cached.cached, true);
  assert.equal(calls.length, 11);
  await service(range, { ...filters, device: "mobile" });
  assert.equal(calls.length, 22);
});
