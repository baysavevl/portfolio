import {defineConfig, devices} from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "artifacts/playwright/test-results",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ["list"],
    ["html", {outputFolder: "artifacts/playwright/report", open: "never"}]
  ],
  use: {
    baseURL: "http://127.0.0.1:3101",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  projects: [
    {
      name: "chromium",
      use: {...devices["Desktop Chrome"]}
    }
  ],
  webServer: {
    command:
      "npm run build && E2E_FIXTURES=1 npm run start -- --hostname 127.0.0.1 --port 3101",
    url: "http://127.0.0.1:3101/en",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI
  }
});
