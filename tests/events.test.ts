import { test } from "node:test";
import assert from "node:assert/strict";
import { ANALYTICS_EVENTS, classifyLink, sanitizedLocation, isPublicPath } from "../src/lib/analytics/events";
import { projects, supportingWork } from "../src/data/portfolio";

test("interaction events use a controlled vocabulary without PII", () => {
  const origin = "https://hajrizi.dev";
  const samples = [
    ["mailto:private-person@example.com?body=sensitive", "email_click"],
    ["tel:+383123456789", "phone_click"], ["/#contact", "contact_click"],
    ["https://calendly.com/shajrizi2/30min", "calendly_click"],
    ["https://github.com/shajrizi2", "github_click"],
    ["https://www.linkedin.com/in/shkelqim-hajrizi-794438131/", "linkedin_click"],
    ["/work/hyrjedalje/", "portfolio_project_click"],
    ["https://menminmade.com/", "external_project_click"], ["/cv.pdf", "resume_download"],
  ];
  for (const [href, name] of samples) {
    const action = classifyLink(href, origin);
    assert.equal(action?.name, name);
    assert.ok(ANALYTICS_EVENTS.includes(action!.name));
    assert.doesNotMatch(JSON.stringify(action), /private-person|sensitive|383123456789|mailto:/);
  }
  assert.equal(classifyLink("https://attacker.example/?email=secret@example.com", origin), null);
  assert.equal(classifyLink("/dashboard/analytics", origin), null);
  assert.equal(classifyLink("javascript:alert(1)", origin), null);
});

test("only canonical public paths are measured, not private or unknown routes", () => {
  for (const path of ["/", "/work/", "/work/wondertales", "/privacy/"]) assert.ok(isPublicPath(path));
  for (const path of ["/dashboard/analytics", "/dashboard/login", "/api/private/analytics", "/not-found", "/work/unknown/"]) assert.ok(!isPublicPath(path));
});

test("every published external project destination has controlled click instrumentation", () => {
  for (const project of [...projects, ...supportingWork]) {
    if (!project.liveUrl) continue;
    const action = classifyLink(project.liveUrl, "https://hajrizi.dev");
    assert.equal(action?.name, "external_project_click", project.name);
    assert.equal(action?.params.project_slug, project.id, project.name);
  }
});

test("page locations discard sensitive queries and fragments while preserving safe UTM slugs", () => {
  const location = sanitizedLocation("https://hajrizi.dev/work?email=private@example.com&token=secret&utm_source=linkedin&utm_medium=social&utm_campaign=agency_partners&utm_content=person@example.com#private-fragment");
  const url = new URL(location);
  assert.equal(url.pathname, "/work/");
  assert.equal(url.hash, "");
  assert.equal(url.searchParams.get("utm_source"), "linkedin");
  assert.equal(url.searchParams.get("utm_campaign"), "agency_partners");
  assert.ok(!url.searchParams.has("utm_content"));
  assert.doesNotMatch(location, /private|secret|example.com/);
});
