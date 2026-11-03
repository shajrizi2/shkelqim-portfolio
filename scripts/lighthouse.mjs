import lighthouse from 'lighthouse';
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:4317';
const routes = process.argv.slice(2).length ? process.argv.slice(2) : ['/', '/work/', '/privacy/', '/work/hyrjedalje/', '/work/wondertales/', '/work/kosovo-police/', '/work/menmin-made/', '/work/order-extraction/'];
await mkdir('artifacts/lighthouse', { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--remote-debugging-port=9333', '--no-sandbox'] });
const summary = [];
try {
  for (const route of routes) {
    const result = await lighthouse(new URL(route, origin).toString(), {
      port: 9333, output: ['json', 'html'], logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    });
    if (!result) throw new Error(`No Lighthouse result for ${route}`);
    const slug = route.replace(/^\/+|\/+$/g, '').replaceAll('/', '-') || 'home';
    await writeFile(`artifacts/lighthouse/${slug}.json`, result.report[0]);
    await writeFile(`artifacts/lighthouse/${slug}.html`, result.report[1]);
    const row = {
      route, scores: Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, Math.round(category.score * 100)])),
      lcpMs: Math.round(result.lhr.audits['largest-contentful-paint'].numericValue),
      cls: result.lhr.audits['cumulative-layout-shift'].numericValue,
      tbtMs: Math.round(result.lhr.audits['total-blocking-time'].numericValue),
    };
    summary.push(row);
    console.log(JSON.stringify(row));
  }
} finally { await browser.close(); }
await writeFile('artifacts/lighthouse/summary.json', JSON.stringify(summary, null, 2) + '\n');
// Lab scores are evidence, not a guarantee of field Core Web Vitals or indexing.
