import { defineConfig, devices } from "@playwright/test";

const PORTA = 4174;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  webServer: {
    command: "npm run build && npm run preview",
    port: PORTA,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  use: { baseURL: `http://localhost:${PORTA}` },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "celular", use: { ...devices["iPhone 13"], browserName: "chromium" } },
    // WebKit é o motor do Safari e de todos os navegadores do iPhone, inclusive o Chrome
    { name: "iphone-safari", use: { ...devices["iPhone 13"], viewport: { width: 390, height: 560 } } },
  ],
});
