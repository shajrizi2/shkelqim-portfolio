import { spawn } from 'node:child_process';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (args, env = process.env) => new Promise(resolve => {
  const child = spawn(npm, args, { stdio: 'inherit', env });
  child.on('error', () => resolve(1));
  child.on('exit', code => resolve(code ?? 1));
});
let result = 1;
try {
  // A build-only test stream. Browser tests intercept Google scripts and block collection.
  const built = await run(['run', 'build'], {
    ...process.env, NEXT_PUBLIC_GA_MEASUREMENT_ID: 'G-TEST123', NEXT_PUBLIC_ANALYTICS_HOSTNAME: '127.0.0.1',
    GOOGLE_OAUTH_CLIENT_SECRET: 'PRIVATE_SERVER_SENTINEL',
  });
  if (built === 0) result = await run(['exec', '--', 'playwright', 'test', ...process.argv.slice(2)]);
} finally {
  // Never leave a test measurement ID in the final export.
  console.log('Restoring the normal production export after browser tests.');
  const restored = await run(['run', 'build']);
  if (restored !== 0) result = restored;
}
process.exitCode = result;
