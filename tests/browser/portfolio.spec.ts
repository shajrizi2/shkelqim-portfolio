import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { PUBLIC_PATHS } from "../../src/lib/analytics/events";
import { createReportService } from "../../server/lib/reports";
import { parseRange } from "../../server/lib/range";
import type { GaReport, SearchReport } from "../../src/lib/analytics/contracts";

for (const route of PUBLIC_PATHS) {
  test(`public SEO, accessibility and mobile layout: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://hajrizi.dev${route}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(result.violations.map(violation => ({ id: violation.id, nodes: violation.nodes.map(node => node.target) }))).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("unknown routes return 404 and private routes do not expose dashboard data", async ({ page, request }) => {
  const missing = await request.get("/this-route-does-not-exist/");
  expect(missing.status()).toBe(404);
  const api = await request.get("/api/private/analytics?start=2026-10-01&end=2026-10-30");
  expect([401, 503]).toContain(api.status());
  expect(api.headers()["x-robots-tag"]).toContain("noindex");
  expect(api.headers()["cache-control"]).toContain("no-store");
  expect(await api.text()).not.toContain('"activeUsers"');
  await page.goto("/dashboard/analytics");
  await expect(page).toHaveURL(/\/dashboard\/login/);
  await expect(page.getByRole("heading", { name: "Portfolio analytics" })).toBeVisible();
  expect(await page.locator('script[src*="app.js"]').count()).toBe(0);
  const asset = await request.get("/dashboard/assets/app.js", { maxRedirects: 0 });
  expect(asset.status()).toBe(303);
});

test("no collection before consent, one page view per navigation, and revocation", async ({ page }) => {
  const googleLoads: string[] = [];
  await page.route("https://www.googletagmanager.com/**", route => {
    googleLoads.push(route.request().url());
    return route.fulfill({ contentType: "application/javascript", body: "/* Test only: block all real analytics collection. */" });
  });
  await page.route(/https:\/\/.*google-analytics\.com\//, route => route.abort());
  await page.goto("/?email=do-not-collect@example.com&utm_source=linkedin&utm_medium=social");
  await expect(page.getByRole("button", { name: "Accept analytics" })).toBeVisible();
  expect(googleLoads).toHaveLength(0);
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
  await page.getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(() => googleLoads.length).toBe(1);
  const commands = () => page.evaluate(() => (window.dataLayer || []).map(item => Array.from(item as ArrayLike<unknown>)));
  await expect.poll(async () => (await commands()).filter(item => item[0] === "event" && item[1] === "page_view").length).toBe(1);
  expect(JSON.stringify(await commands())).not.toContain("do-not-collect");
  const config = (await commands()).find(item => item[0] === "config");
  expect(config?.[2]).toMatchObject({ send_page_view: false });
  await page.getByRole("link", { name: "View WonderTales case study" }).click();
  await expect(page).toHaveURL(/\/work\/wondertales\//);
  await expect.poll(async () => (await commands()).filter(item => item[0] === "event" && item[1] === "page_view").length).toBe(2);
  const projectEvents = (await commands()).filter(item => item[1] === "portfolio_project_click");
  expect(projectEvents).toHaveLength(1);
  expect(projectEvents[0][2]).toMatchObject({ project_slug: "wondertales" });
  await page.getByRole("button", { name: "Analytics preferences" }).click();
  await page.getByRole("button", { name: "Reject analytics" }).click();
  await expect(page.locator("#google-analytics")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("hajrizi-analytics-consent-v1"))).toContain('"rejected"');
  expect(googleLoads).toHaveLength(1);
});

test("own-traffic and browser privacy opt-outs prevent analytics", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("analytics-exclude", "true"));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Accept analytics" })).toHaveCount(0);
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
  await page.getByRole("button", { name: "Analytics preferences" }).click();
  await expect(page.getByText("Optional analytics are not enabled for this visit.")).toBeVisible();
});

async function setupDashboard(page: Page, mode: "setup" | "error" | "empty" | "data" = "setup") {
  // Browser-only fixture: the real handler is separately tested for authorization.
  // This never adds a development authentication bypass to the application.
  await page.route("**/dashboard/analytics", async route => route.fulfill({ contentType: "text/html", body: await readFile("server/dashboard/dist/index.html", "utf8") }));
  await page.route("**/dashboard/assets/*", async route => {
    const filename = path.basename(new URL(route.request().url()).pathname);
    return route.fulfill({ contentType: filename.endsWith(".css") ? "text/css" : "application/javascript", body: await readFile(`server/dashboard/dist/${filename}`) });
  });
  await page.route("**/api/private/analytics?*", async route => {
    if (mode === "error") return route.fulfill({ status: 503, json: { error: "Test-only reporting error" } });
    const { range, filters } = parseRange(new URL(route.request().url()).searchParams);
    const result = await createReportService({})(range, filters);
    if (mode === "empty" || mode === "data") {
      // Synthetic UI test response only; there is no fixture mode in deployed code.
      const count = mode === "data" ? 2 : 0;
      const totals = { activeUsers: count, newUsers: count, sessions: count, screenPageViews: count, engagedSessions: count, engagementRate: count ? .5 : 0, userEngagementDuration: count * 30, keyEvents: 0, contactActions: count };
      const searchTotals = { clicks: count, impressions: count * 100, ctr: count ? .01 : 0, position: count ? 5 : null };
      const ga: GaReport = { totals, previous: { ...totals }, daily: count ? [{ date: range.start, activeUsers: count, sessions: count }] : [], contactTrend: count ? [{ date: range.start, contactActions: count }] : [], channels: count ? [{ label: "Referral", sessions: count }] : [], referrers: [], referringDomains: [], countries: [], devices: [], pages: [], landingPages: [], events: count ? [{ label: "contact_click", eventCount: count, keyEvents: 0 }] : [], timezone: "UTC", thresholded: false, truncated: false };
      const search: SearchReport = { totals: searchTotals, previous: { ...searchTotals }, daily: count ? [{ date: range.start, clicks: count, impressions: count * 100 }] : [], queries: [], pages: [], countries: [], devices: [], lowCtr: [], visibility: [] };
      result.ga4 = { status: mode === "empty" ? "empty" : "ready", data: ga, syncedAt: new Date().toISOString() };
      result.searchConsole = { status: mode === "empty" ? "empty" : "ready", data: search, syncedAt: new Date().toISOString() };
    }
    return route.fulfill({ json: result });
  });
  await page.goto("/dashboard/analytics");
}

test("dashboard displays setup states without fake metrics, remains responsive and accessible", async ({ page }, info) => {
  const googleRequests: string[] = [];
  page.on("request", request => { if (/google-analytics|googletagmanager/.test(request.url())) googleRequests.push(request.url()); });
  await setupDashboard(page);
  await expect(page.getByText("Google Analytics 4 · Setup required")).toBeVisible();
  await expect(page.getByText("Google Search Console · Setup required")).toBeVisible();
  expect(await page.locator(".metric > strong").allTextContents()).toEqual(Array(12).fill("—"));
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  let a11y = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(a11y.violations).toEqual([]);
  await mkdir("artifacts", { recursive: true });
  await page.screenshot({ path: `artifacts/dashboard-setup-${info.project.name}.png`, fullPage: true });
  for (const tab of ["Traffic", "Google Search", "Actions"]) {
    await page.getByRole("button", { name: tab, exact: true }).click();
    a11y = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(a11y.violations).toEqual([]);
  }
  await expect(page.getByText(/confirmed conversions are not measured/)).toBeVisible();
  expect(googleRequests).toEqual([]);
});

test("dashboard handles an API error with a retry state", async ({ page }) => {
  await setupDashboard(page, "error");
  await expect(page.getByRole("alert")).toContainText("Test-only reporting error");
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
});

test("connected empty reports show zeros, unavailable position and no fabricated series", async ({ page }) => {
  await setupDashboard(page, "empty");
  await expect(page.getByText("Connected · no data in this range")).toHaveCount(2);
  await expect(page.locator(".metric").filter({ hasText: "Active users" }).locator("strong")).toHaveText("0");
  await expect(page.locator(".metric").filter({ hasText: "Average position" }).locator("strong")).toHaveText("—");
  await expect(page.locator(".chart svg")).toHaveCount(0);
});

test("connected report charts and table controls render accessibly", async ({ page }) => {
  await setupDashboard(page, "data");
  await expect(page.locator(".chart svg")).toHaveCount(3);
  await page.getByRole("button", { name: "Actions", exact: true }).click();
  await expect(page.getByRole("rowheader", { name: "contact_click" })).toBeVisible();
  await page.getByText("View daily data").click();
  await expect(page.getByRole("table", { name: "Contact actions over time: daily values" })).toBeVisible();
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]);
});

test("Global Privacy Control prevents optional analytics even with saved consent", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true });
    localStorage.setItem("hajrizi-analytics-consent-v1", JSON.stringify({ choice: "accepted", at: Date.now() }));
  });
  await page.goto("/");
  await expect(page.locator("#google-analytics")).toHaveCount(0);
  expect(await page.evaluate(() => window.dataLayer)).toBeUndefined();
});
