import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "server/dashboard/dist/**", "artifacts/**", "test-results/**", "playwright-report/**", ".netlify/**", "next-env.d.ts"]),
  {
    files: ["server/dashboard/**/*.tsx"],
    // This is a separate React app served by a Function, without a Next.js router.
    rules: { "@next/next/no-html-link-for-pages": "off", "@next/next/no-location-assign-relative-destination": "off" },
  },
]);
