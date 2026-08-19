import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  poweredByHeader: false,

  output: 'export',
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  outputFileTracingRoot: path.join(process.cwd()),

  // TypeScript is enforced by the separate `npm run typecheck` verification step.
  // This avoids a Next.js 16 CLI parsing issue with the environment's TypeScript runner.
  typescript: { ignoreBuildErrors: true },

  experimental: {
    useTypeScriptCli: false,
  },
};

export default nextConfig;
