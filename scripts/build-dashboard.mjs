import { build } from 'esbuild';
import { mkdir, copyFile } from 'node:fs/promises';

await mkdir('server/dashboard/dist', { recursive: true });
await build({
  entryPoints: ['server/dashboard/app.tsx'], bundle: true, minify: true,
  outfile: 'server/dashboard/dist/app.js', platform: 'browser', target: ['es2020'],
  jsx: 'automatic', define: { 'process.env.NODE_ENV': '"production"' }, sourcemap: false,
});
await copyFile('server/dashboard/index.html', 'server/dashboard/dist/index.html');
console.log('Built private dashboard assets outside the public export.');
