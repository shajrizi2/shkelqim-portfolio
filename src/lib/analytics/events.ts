export const ANALYTICS_EVENTS = [
  "contact_click", "email_click", "calendly_click", "github_click", "linkedin_click",
  "portfolio_project_click", "external_project_click", "resume_download", "phone_click",
] as const;
export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

export const PROJECT_SLUGS = ["hyrjedalje", "wondertales", "kosovo-police", "menmin-made", "order-extraction"] as const;
export const PUBLIC_PATHS = ["/", "/work/", "/privacy/", ...PROJECT_SLUGS.map((slug) => `/work/${slug}/`)];
const projectDomains: Record<string, string> = {
  "hyrjedalje.com": "hyrjedalje", "wondertales.shop": "wondertales",
  "kosovopolice.com": "kosovo-police", "menminmade.com": "menmin-made",
  "pabau.com": "pabau", "two.jobs": "two-jobs", "gossik.ch": "gossik",
  "generation-success.com": "generation-success", "long-time-liner.com": "long-time-liner",
  "rexhi.com": "rexhi", "patzina-lotz.com": "patzina-lotz", "homenichelinks.com": "home-niche-links",
  "sotecoffeeroasters.com": "sote-coffee-roasters", "oek-kcc.org": "oek-kcc", "falconfunded.com": "falcon-funded",
};

export const normalizePath = (path: string) => path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
export const isPublicPath = (path: string) => PUBLIC_PATHS.includes(normalizePath(path));

// Deliberately omit link text, email/phone destinations, queries and freeform data.
export function classifyLink(href: string, origin: string): { name: AnalyticsEvent; params: Record<string, string> } | null {
  let url: URL;
  try { url = new URL(href, origin); } catch { return null; }
  const params: Record<string, string> = {};
  if (url.protocol === "mailto:") return { name: "email_click", params };
  if (url.protocol === "tel:") return { name: "phone_click", params };
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (url.origin === origin) {
    if (url.hash === "#contact") return { name: "contact_click", params };
    const slug = url.pathname.split("/").filter(Boolean);
    if (slug[0] === "work" && slug.length === 2 && PROJECT_SLUGS.some((item) => item === slug[1])) {
      return { name: "portfolio_project_click", params: { project_slug: slug[1] } };
    }
    if (url.pathname === "/cv.pdf") return { name: "resume_download", params };
    return null;
  }
  if (url.hostname === "calendly.com" && url.pathname.startsWith("/shajrizi2/")) return { name: "calendly_click", params };
  if (url.hostname === "github.com" && /^\/shajrizi2\/?$/.test(url.pathname)) return { name: "github_click", params };
  if (url.hostname === "www.linkedin.com" && url.pathname === "/in/shkelqim-hajrizi-794438131/") return { name: "linkedin_click", params };
  const project = projectDomains[url.hostname.replace(/^www\./, "")];
  if (project) return { name: "external_project_click", params: { project_slug: project } };
  return null;
}

export function sanitizedLocation(href: string) {
  const url = new URL(href);
  const clean = new URL(normalizePath(url.pathname), url.origin);
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
    const value = url.searchParams.get(key);
    if (value && /^[a-z0-9_-]{1,64}$/i.test(value)) clean.searchParams.set(key, value);
  }
  return clean.toString();
}
