import { mkdir, writeFile } from "node:fs/promises";
import { projects, supportingWork, portfolio } from "../src/data/portfolio";

async function main() {
  const publicRoutes = ["/", "/work/", ...projects.map(project => `/work/${project.slug}/`), "/robots.txt", "/sitemap.xml", "/this-page-should-return-404/"];
  const targets = [...new Set([
    ...publicRoutes.map(route => `https://hajrizi.dev${route}`),
    "https://www.hajrizi.dev/", "http://hajrizi.dev/", ...projects.map(project => project.liveUrl),
    ...supportingWork.map(project => project.liveUrl), portfolio.person.linkedin, portfolio.person.github, portfolio.person.calendly,
  ].filter((url): url is string => !!url))];
  const results: Record<string, unknown>[] = [];
  for (let i = 0; i < targets.length; i += 3) {
    await Promise.all(targets.slice(i, i + 3).map(async url => {
      try {
        const response = await fetch(url, { headers: { "User-Agent": "PortfolioTechnicalAudit/1.0" }, signal: AbortSignal.timeout(12000) });
        const html = response.headers.get("content-type")?.includes("text/html") ? await response.text() : "";
        const row = { url, status: response.status, finalUrl: response.url, title: html.match(/<title>([\s\S]*?)<\/title>/i)?.[1], canonical: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1], containsProposalCopy: /How this project maps to AWS|This is a proposed extension/i.test(html) };
        results.push(row); console.log(response.status, url, response.url !== url ? `→ ${response.url}` : "");
      } catch { results.push({ url, error: "Network error or 12-second timeout; not evidence the destination is permanently broken." }); console.log("UNVERIFIED", url); }
    }));
  }
  await mkdir("artifacts", { recursive: true });
  await writeFile("artifacts/live-audit.json", JSON.stringify({ auditedAt: new Date().toISOString(), results }, null, 2) + "\n");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
