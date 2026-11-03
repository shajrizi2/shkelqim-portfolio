import { test } from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../server/app";
import { authConfig, authorized, cookie, FLOW_COOKIE, SESSION_COOKIE, newFlow, newSession, readValue, signValue, googleIdentityProvider, type Identity, type AuthConfig } from "../server/lib/auth";
import { parseRange } from "../server/lib/range";

const env = {
  DASHBOARD_AUTH_ENABLED: "true", DASHBOARD_ORIGIN: "https://hajrizi.dev",
  GOOGLE_OAUTH_CLIENT_ID: "test-client", GOOGLE_OAUTH_CLIENT_SECRET: "test-oauth-secret",
  DASHBOARD_SESSION_SECRET: "test-only-" + "a".repeat(64), DASHBOARD_ALLOWED_EMAILS: "owner@example.com",
};
const config = authConfig(env)!;
const identity: Identity = { email: "owner@example.com", verified: true, nonce: "", subject: "test-owner-subject" };
const sessionHeader = () => `${SESSION_COOKIE}=${newSession(identity, config)}`;
const request = (path: string, headers: Record<string, string> = {}, method = "GET") => new Request(`https://hajrizi.dev${path}`, { method, headers });

test("authentication is disabled unless all secure configuration is present", () => {
  for (const changes of [{ DASHBOARD_AUTH_ENABLED: "false" }, { DASHBOARD_SESSION_SECRET: "short" }, { DASHBOARD_ALLOWED_EMAILS: "*" }, { DASHBOARD_ORIGIN: "http://hajrizi.dev" }, { GOOGLE_OAUTH_CLIENT_SECRET: "" }, { DASHBOARD_ORIGIN: "https://hajrizi.dev/elsewhere" }]) assert.equal(authConfig({ ...env, ...changes }), null);
});

test("signed sessions reject tampering, expiration, wrong purpose and removed owners", () => {
  const token = newSession(identity, config);
  assert.ok(readValue(token, "session", config));
  assert.equal(readValue(token + "tampered", "session", config), null);
  assert.equal(readValue(token, "oauth", config), null);
  assert.equal(readValue(token, "session", { ...config, secret: "rotated" }), null);
  assert.equal(readValue(token, "session", config, Date.now() + 3601_000), null);
  assert.equal(authorized(request("/", { cookie: `${SESSION_COOKIE}=${token}` }), { ...config, owners: ["another@example.com"] }), null);
});

test("direct APIs and dashboard assets require server authorization", async () => {
  let reportCalls = 0;
  const app = createApp({ env, reportService: async () => { reportCalls++; throw Error("must not run"); } });
  for (const route of ["/api/private/analytics?start=2026-10-01&end=2026-10-30", "/api/private/other"]) {
    const result = await app(request(route));
    assert.equal(result.status, 401);
    assert.match(result.headers.get("cache-control")!, /no-store/);
    assert.match(result.headers.get("x-robots-tag")!, /noindex/);
    assert.equal(result.headers.get("access-control-allow-origin"), null);
  }
  for (const route of ["/dashboard/analytics", "/dashboard/analytics/", "/dashboard/assets/app.js", "/dashboard/assets/app.css"]) {
    const result = await app(request(route));
    assert.equal(result.status, 303);
    assert.equal(result.headers.get("location"), "/dashboard/login");
  }
  assert.equal(reportCalls, 0);
});

test("unconfigured authentication fails closed and serves no dashboard shell", async () => {
  const app = createApp({ env: {} });
  const api = await app(request("/api/private/analytics"));
  assert.equal(api.status, 503);
  const login = await app(request("/dashboard/login"));
  assert.equal(login.status, 503);
  assert.doesNotMatch(await login.text(), /app\.js|test-oauth-secret/);
});

test("OAuth uses browser-bound state, PKCE, verified owner identity and nonce", async () => {
  const flow = newFlow(config);
  let returnedIdentity = { ...identity, nonce: flow.nonce };
  let exchangeCalls = 0;
  const app = createApp({ env, identity: {
    authorizationUrl: () => "https://accounts.google.com/test",
    exchange: async (_code, verifier) => { exchangeCalls++; assert.equal(verifier, flow.verifier); return returnedIdentity; },
  } });
  const callback = (state = flow.state) => request(`/dashboard/auth/callback?code=test-code&state=${state}`, { cookie: `${FLOW_COOKIE}=${flow.signed}` });
  assert.match((await app(callback("wrong"))).headers.get("location")!, /denied/);
  assert.equal(exchangeCalls, 0);
  const result = await app(callback());
  assert.equal(result.headers.get("location"), "/dashboard/analytics");
  const cookies = result.headers.getSetCookie();
  const session = cookies.find(value => value.startsWith(SESSION_COOKIE))!;
  for (const flag of ["Secure", "HttpOnly", "SameSite=Strict", "Path=/", "Max-Age=3600"]) assert.ok(session.includes(flag));
  assert.ok(cookies.some(value => value.startsWith("__Host-analytics_exclude=1")));
  assert.match((await app(callback())).headers.get("location")!, /denied/);
  assert.equal(exchangeCalls, 1);
  returnedIdentity = { ...identity, email: "other@example.com", nonce: flow.nonce };
});

test("OAuth rejects unapproved, unverified and nonce-mismatched identities", async () => {
  for (const changes of [{ email: "attacker@example.com" }, { verified: false }, { nonce: "wrong" }]) {
    const flow = newFlow(config);
    const app = createApp({ env, identity: { authorizationUrl: () => "https://accounts.google.com/test", exchange: async () => ({ ...identity, nonce: flow.nonce, ...changes }) } });
    const result = await app(request(`/dashboard/auth/callback?code=test&state=${flow.state}`, { cookie: `${FLOW_COOKIE}=${flow.signed}` }));
    assert.match(result.headers.get("location")!, /denied/);
    assert.ok(!result.headers.getSetCookie().some(value => value.startsWith(SESSION_COOKIE)));
  }
});

test("Google login requests only identity scopes and includes PKCE and nonce", () => {
  const flow = newFlow(config);
  const url = new URL(googleIdentityProvider(config).authorizationUrl(flow));
  assert.equal(url.hostname, "accounts.google.com");
  assert.equal(url.searchParams.get("redirect_uri"), "https://hajrizi.dev/dashboard/auth/callback");
  assert.equal(url.searchParams.get("code_challenge_method"), "S256");
  assert.equal(url.searchParams.get("code_challenge"), flow.challenge);
  assert.equal(url.searchParams.get("nonce"), flow.nonce);
  assert.equal(url.searchParams.get("scope"), "openid email");
});

test("cross-origin requests, expired sessions and CSRF logout are blocked", async () => {
  const app = createApp({ env });
  const cookieHeader = sessionHeader();
  assert.equal((await app(request("/api/private/analytics", { cookie: cookieHeader, origin: "https://evil.example" }))).status, 403);
  assert.equal((await app(request("/api/private/analytics", { cookie: cookieHeader, "sec-fetch-site": "cross-site" }))).status, 403);
  assert.equal((await app(new Request("https://evil.example/api/private/analytics", { headers: { cookie: cookieHeader } }))).status, 403);
  assert.equal((await app(request("/dashboard/logout", { cookie: cookieHeader }, "POST"))).status, 403);
  const logout = await app(request("/dashboard/logout", { cookie: cookieHeader, origin: config.origin }, "POST"));
  assert.equal(logout.status, 303);
  assert.match(logout.headers.get("set-cookie")!, /Max-Age=0/);
  assert.equal((await app(request("/api/private/analytics", { cookie: cookieHeader }, "PUT"))).status, 405);
});

test("authorized requests validate dates before invoking reporting", async () => {
  const app = createApp({ env });
  const result = await app(request("/api/private/analytics?start=2026-02-31&end=2026-03-02", { cookie: sessionHeader() }));
  assert.equal(result.status, 400);
  const setup = await app(request("/api/private/analytics?start=2026-10-01&end=2026-10-30", { cookie: sessionHeader() }));
  assert.equal(setup.status, 200);
  const body = await setup.json();
  assert.equal(body.ga4.status, "setup");
  assert.equal(body.searchConsole.status, "setup");
  assert.ok(!("data" in body.ga4));
  assert.match(setup.headers.get("content-security-policy")!, /frame-ancestors 'none'/);
});

test("date ranges include equal-length previous periods and reject invalid filters", () => {
  const now = new Date("2026-11-03T12:00:00Z");
  const { range } = parseRange(new URLSearchParams("start=2024-02-01&end=2024-02-29"), now);
  assert.equal(range.days, 29);
  assert.equal(range.previousStart, "2024-01-03");
  assert.equal(range.previousEnd, "2024-01-31");
  for (const params of ["start=2026-10-30&end=2026-10-01", "start=2026-11-03&end=2026-11-03", "start=2020-01-01&end=2026-01-01", "start=2026-10-01&end=2026-10-30&device=unknown", "start=2026-10-01&end=2026-10-30&page=/dashboard/", "start=2026-10-01&end=2026-10-30&channel=arbitrary"]) assert.throws(() => parseRange(new URLSearchParams(params), now));
});

test("authentication cookies cannot be confused across purposes", () => {
  const iat = Math.floor(Date.now() / 1000);
  const flow = signValue({ kind: "oauth", email: identity.email, sub: identity.subject, iat, exp: iat + 300 }, config);
  assert.equal(authorized(request("/", { cookie: `${SESSION_COOKIE}=${flow}` }), config), null);
  assert.match(cookie("session", "value", 60), /Secure; SameSite=Strict; HttpOnly/);
  const configWithChangedOwner: AuthConfig = { ...config, owners: ["different@example.com"] };
  assert.equal(authorized(request("/", { cookie: sessionHeader() }), configWithChangedOwner), null);
});
