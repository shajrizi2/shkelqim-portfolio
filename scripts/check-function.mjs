import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { build } from 'esbuild';

await mkdir('artifacts/function', { recursive: true });
await build({ entryPoints: ['netlify/functions/analytics.mts'], bundle: true, format: 'esm', platform: 'node', target: 'node22', external: ['google-auth-library'], outfile: 'artifacts/function/analytics.mjs' });
const fn = await import(pathToFileURL(path.resolve('artifacts/function/analytics.mjs')).href);
assert.deepEqual(fn.config.path, ['/dashboard', '/dashboard/*', '/api/private/*']);
const result = await fn.default(new Request('https://hajrizi.dev/api/private/analytics'));
assert.ok([401, 403, 503].includes(result.status));
assert.match(result.headers.get('cache-control'), /no-store/);
assert.match(result.headers.get('x-robots-tag'), /noindex/);
assert.doesNotMatch(await result.text(), /activeUsers|access_token|private_key/);
console.log('PASS Node 22 ESM Function bundle, custom routes and fail-closed unauthorized response.');
