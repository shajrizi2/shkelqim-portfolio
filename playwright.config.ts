import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser", fullyParallel: true, workers: 2,
  use: { baseURL: "http://127.0.0.1:4317", trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: { command: "npm run preview", url: "http://127.0.0.1:4317", reuseExistingServer: !process.env.CI, timeout: 30_000 },
});
