/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  timeout: 30_000,
  expect: { timeout: 5000 },
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    baseURL: process.env.BASE_URL || 'http://localhost:3004',
  },
  testDir: 'tests/e2e',
};

module.exports = config;
