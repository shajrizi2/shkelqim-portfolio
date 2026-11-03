import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import path from "node:path";
import { projects } from "../src/data/portfolio";
import { siteUrl } from "../src/lib/site-url";
import { PUBLIC_PATHS } from "../src/lib/analytics/events";

async function main() {
// These checks inspect compiler-generated HTML, not arbitrary third-party markup.
const attr = (tag: string, name: string) => tag.match(new RegExp(`\\s${name}="([^"]*)"`, "i"))?.[1]?.replaceAll("&amp;", "&");
const canonical = (html: string) => [...html.matchAll(/<link\b[^>]*>/g)].map(match => match[0]).filter(tag => attr(tag, "rel") === "canonical");
const meta = (html: string, key: string) => [...html.matchAll(/<meta\b[^>]*>/g)].map(match => match[0]).find(tag => attr(tag, "name") === key || attr(tag, "property") === key);
const pageFile = (route: string) => path.join("out", route, "index.html");
const pages = new Map<string, string>();
const titles = new Set<string>(), descriptions = new Set<string>();
for (const route of PUBLIC_PATHS) pages.set(route, await readFile(pageFile(route), "utf8"));

for (const [route, html] of pages) {
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description = attr(meta(html, "description") || "", "content");
  assert.ok(title && title.length > 20 && title.length < 80, `Missing or oversized title: ${route}`);
  assert.ok(description && description.length > 70 && description.length < 220, `Missing or oversized description: ${route}`);
  assert.ok(!titles.has(title!), `Duplicate title: ${route}`); titles.add(title!);
  assert.ok(!descriptions.has(description!), `Duplicate description: ${route}`); descriptions.add(description!);
  assert.equal(canonical(html).length, 1, `Canonical count: ${route}`);
  assert.equal(attr(canonical(html)[0], "href"), `${siteUrl}${route}`);
  assert.ok(!attr(meta(html, "robots") || "", "content")?.includes("noindex"), route);
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `H1 count: ${route}`);
  let previous = 0;
  for (const heading of html.matchAll(/<h([1-6])\b/g)) {
    const level = Number(heading[1]);
    assert.ok(level <= previous + 1, `Skipped heading level on ${route}: H${previous} → H${level}`);
    previous = level;
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate IDs: ${route}`);
  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    assert.ok(attr(img[0], "alt"), `Missing descriptive alt: ${route}`);
    const src = attr(img[0], "src")!;
    if (src.startsWith("/")) await access(path.join("out", src.split("?")[0]));
  }
  for (const key of ["og:title", "og:description", "og:url", "og:image", "og:image:width", "og:image:height", "twitter:card", "twitter:title", "twitter:description", "twitter:image"]) assert.ok(meta(html, key), `Missing ${key}: ${route}`);
  assert.equal(attr(meta(html, "og:url")!, "content"), `${siteUrl}${route}`);
  assert.equal(attr(meta(html, "og:image:width")!, "content"), "1200");
  assert.equal(attr(meta(html, "og:image:height")!, "content"), "630");
  for (const key of ["og:image", "twitter:image"]) {
    const image = new URL(attr(meta(html, key)!, "content")!);
    assert.equal(image.origin, siteUrl);
    await access(path.join("out", image.pathname));
  }
  const jsonLd = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(jsonLd.length, `Missing structured data: ${route}`);
  for (const match of jsonLd) {
    const schema = JSON.parse(match[1]);
    assert.equal(schema["@context"], "https://schema.org");
    assert.doesNotMatch(match[1], /AggregateRating|reviewRating|award|certification/, "Unsupported claims in schema");
  }
  if (route.startsWith("/work/")) assert.ok(html.includes('"@type":"BreadcrumbList"'), `Missing breadcrumbs: ${route}`);
  for (const link of html.matchAll(/<a\b[^>]*>/g)) {
    const href = attr(link[0], "href");
    if (!href || (!href.startsWith("/") && !href.startsWith("#"))) continue;
    const url = new URL(href, `${siteUrl}${route}`);
    const target = pages.get(url.pathname);
    if (target) {
      if (url.hash) assert.ok(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Broken anchor ${href} on ${route}`);
    } else await access(path.join("out", url.pathname));
  }
  console.log(`PASS metadata, schema, links, headings and images: ${route}`);
}

const sitemap = await readFile("out/sitemap.xml", "utf8");
const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.deepEqual(entries.sort(), PUBLIC_PATHS.map(route => `${siteUrl}${route}`).sort());
assert.doesNotMatch(sitemap, /<lastmod>|dashboard|api\/private|localhost/);
assert.equal(new Set(entries).size, entries.length);
const robots = await readFile("out/robots.txt", "utf8");
assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`));
assert.match(robots, /Disallow: \/dashboard/);
assert.match(robots, /Disallow: \/api\//);
const notFound = await readFile("out/404.html", "utf8");
assert.ok(attr(meta(notFound, "robots") || "", "content")?.includes("noindex"));
for (const project of projects) assert.ok(pages.get(`/work/${project.slug}/`)?.includes('"@type":"CreativeWork"'));
assert.ok(!(await readdir("out")).includes("dashboard"), "Private dashboard was exported publicly");
const verificationName = "google7f5a80bf3cfdbe16.html";
assert.equal((await readFile(path.join("out", verificationName), "utf8")).trim(), `google-site-verification: ${verificationName}`);
assert.ok(!sitemap.includes(verificationName), "Utility verification file must not enter the sitemap");

async function checkSecrets(dir: string): Promise<void> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const filename = path.join(dir, entry.name);
    if (entry.isDirectory()) await checkSecrets(filename);
    else if (/\.(js|html|json|txt)$/.test(entry.name)) {
      const content = await readFile(filename, "utf8");
      assert.doesNotMatch(content, /BEGIN (RSA )?PRIVATE KEY|PRIVATE_SERVER_SENTINEL/, `Private credential found in ${filename}`);
      for (const key of ["GOOGLE_SERVICE_ACCOUNT_JSON", "GOOGLE_OAUTH_CLIENT_SECRET", "DASHBOARD_SESSION_SECRET"]) {
        const secret = process.env[key];
        if (secret && secret.length >= 16) assert.ok(!content.includes(secret), `Server secret leaked in ${filename}`);
      }
    }
  }
}
await checkSecrets("out");
console.log(`PASS ${PUBLIC_PATHS.length} sitemap routes, robots, noindex 404, private-export exclusion and public-bundle credential checks.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
