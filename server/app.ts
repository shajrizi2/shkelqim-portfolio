import { readFile } from "node:fs/promises";
import path from "node:path";
import { authConfig, authorized, cookie, FLOW_COOKIE, SESSION_COOKIE, SESSION_SECONDS, googleIdentityProvider, newFlow, newSession, readCookies, readValue, type IdentityProvider } from "./lib/auth";
import { parseRange } from "./lib/range";
import { createReportService } from "./lib/reports";

const securityHeaders = {
  "Cache-Control": "private, no-store, max-age=0", "Netlify-CDN-Cache-Control": "no-store", "CDN-Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive", "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer", "X-Frame-Options": "DENY", Vary: "Cookie",
  "Content-Security-Policy": "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'; object-src 'none'",
};

function response(body: BodyInit | null, status = 200, headers: HeadersInit = {}) {
  const merged = new Headers(securityHeaders);
  new Headers(headers).forEach((value, key) => merged.set(key, value));
  return new Response(body, { status, headers: merged });
}
const json = (value: unknown, status = 200) => response(JSON.stringify(value), status, { "Content-Type": "application/json; charset=utf-8" });
const redirect = (location: string, cookies: string[] = []) => {
  const result = response(null, 303, { Location: location });
  for (const value of cookies) result.headers.append("Set-Cookie", value);
  return result;
};

function loginPage(configured: boolean, denied = false) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Private Analytics | Shkelqim Hajrizi</title><link rel="stylesheet" href="/dashboard/login.css"></head><body class="login"><main><a class="brand" href="/">SH <span>Shkelqim Hajrizi</span></a><p class="eyebrow">PRIVATE WORKSPACE</p><h1>Portfolio analytics</h1><p>${configured ? denied ? "Sign-in could not be authorized. Use the owner's approved Google account and try again." : "Sign in with the approved Google account to view website and search performance." : "Dashboard sign-in is not configured. The owner can enable access using the setup instructions in SEO_ANALYTICS_SETUP.md."}</p>${configured ? '<a class="primary" href="/dashboard/auth/start">Continue with Google →</a>' : ''}<a href="/">Return to portfolio</a></main></body></html>`;
}

export function createApp(options: { env?: Record<string, string | undefined>; identity?: IdentityProvider; reportService?: ReturnType<typeof createReportService>; assetRoot?: string } = {}) {
  const env = options.env ?? process.env;
  const config = authConfig(env);
  const identity = config ? options.identity ?? googleIdentityProvider(config) : null;
  const reportService = options.reportService ?? createReportService(env);
  const assetRoot = options.assetRoot ?? path.join(process.cwd(), "server/dashboard/dist");
  // Short-lived replay protection supplements nonce, PKCE and the browser-bound state cookie.
  const usedStates = new Map<string, number>();
  const recentRequests = new Map<string, number[]>();
  return async function handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const route = url.pathname.replace(/\/+$/, "") || "/";
    const isApi = route.startsWith("/api/private");
    if (!["GET", "POST", "HEAD"].includes(request.method)) return response(null, 405, { Allow: "GET, POST, HEAD" });
    // Never derive OAuth callback origins from untrusted Host or forwarding headers.
    if (config && url.origin !== config.origin) return isApi ? json({ error: "This origin is not authorized for dashboard access." }, 403) : response("Dashboard unavailable on this origin.", 403);
    if (request.headers.get("sec-fetch-site") === "cross-site" && isApi) return json({ error: "Cross-site requests are not allowed." }, 403);
    const origin = request.headers.get("origin");
    if (origin && config && origin !== config.origin) return json({ error: "Origin not allowed." }, 403);
    if (route === "/dashboard/login.css" && request.method === "GET") {
      return response(await readFile(path.join(assetRoot, "app.css")), 200, { "Content-Type": "text/css; charset=utf-8" });
    }
    if (route === "/dashboard/login" && request.method === "GET") {
      if (config && authorized(request, config)) return redirect("/dashboard/analytics");
      return response(loginPage(!!config, url.searchParams.get("error") === "denied"), config ? 200 : 503, { "Content-Type": "text/html; charset=utf-8" });
    }
    if (!config || !identity) return isApi ? json({ error: "Dashboard authentication is not configured." }, 503) : redirect("/dashboard/login");
    if (route === "/dashboard/auth/start" && request.method === "GET") {
      const flow = newFlow(config);
      return redirect(identity.authorizationUrl(flow), [cookie(FLOW_COOKIE, flow.signed, 600, "Lax")]);
    }
    if (route === "/dashboard/auth/callback" && request.method === "GET") {
      const flow = readValue(readCookies(request)[FLOW_COOKIE], "oauth", config);
      const state = url.searchParams.get("state");
      const code = url.searchParams.get("code");
      const deny = () => redirect("/dashboard/login?error=denied", [cookie(FLOW_COOKIE, "", 0, "Lax")]);
      for (const [key, exp] of usedStates) if (exp <= Date.now()) usedStates.delete(key);
      if (!flow || !code || code.length > 4096 || !state || flow.state !== state || typeof flow.verifier !== "string" || usedStates.has(state)) return deny();
      if (usedStates.size >= 1000) return deny();
      usedStates.set(state, Date.now() + 600_000);
      try {
        const user = await identity.exchange(code, flow.verifier);
        if (!user.verified || !user.subject || user.nonce !== flow.nonce || !config.owners.includes(user.email.toLowerCase())) return deny();
        return redirect("/dashboard/analytics", [
          cookie(SESSION_COOKIE, newSession(user, config), SESSION_SECONDS), cookie(FLOW_COOKIE, "", 0, "Lax"),
          cookie("__Host-analytics_exclude", "1", 31536000, "Strict", false),
        ]);
      } catch { return deny(); }
    }
    const session = authorized(request, config);
    if (!session) return isApi ? json({ error: "Authentication required." }, 401) : redirect("/dashboard/login");
    if (route === "/dashboard/logout" && request.method === "POST") {
      if (origin !== config.origin) return json({ error: "Same-origin request required." }, 403);
      return redirect("/dashboard/login", [cookie(SESSION_COOKIE, "", 0)]);
    }
    if (route === "/api/private/analytics" && request.method === "GET") {
      let selection;
      try { selection = parseRange(url.searchParams); } catch (error) { return json({ error: (error as Error).message }, 400); }
      const owner = String(session.sub);
      const recent = (recentRequests.get(owner) || []).filter(at => at > Date.now() - 60_000);
      if (recent.length >= 20) return json({ error: "Please wait before requesting another report." }, 429);
      recent.push(Date.now()); recentRequests.set(owner, recent);
      try { return json(await reportService(selection.range, selection.filters)); }
      catch { return json({ error: "Reporting is temporarily unavailable. Try again shortly." }, 503); }
    }
    if (request.method === "GET" || request.method === "HEAD") {
      const files: Record<string, [string, string]> = {
        "/dashboard/assets/app.js": ["app.js", "text/javascript; charset=utf-8"],
        "/dashboard/assets/app.css": ["app.css", "text/css; charset=utf-8"],
        "/dashboard/analytics": ["index.html", "text/html; charset=utf-8"],
      };
      if (route === "/dashboard") return redirect("/dashboard/analytics");
      if (files[route]) {
        try { return response(request.method === "HEAD" ? null : await readFile(path.join(assetRoot, files[route][0])), 200, { "Content-Type": files[route][1] }); }
        catch { return response("Dashboard assets unavailable. Rebuild the deployment.", 503); }
      }
    }
    return isApi ? json({ error: "Not found." }, 404) : response("Not found.", 404);
  };
}
