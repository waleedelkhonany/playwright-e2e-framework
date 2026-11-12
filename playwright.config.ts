import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/env';

const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'ui',
      testIgnore: /tests[\/]api[\/]/,
      use: { ...devices['Desktop Chrome'], baseURL: env.uiBaseUrl, testIdAttribute: 'data-test' },
    },
    {
      name: 'api',
      testMatch: /tests[\/]api[\/].*\.spec\.ts/,
      use: { baseURL: env.apiBaseUrl, extraHTTPHeaders: { Accept: 'application/json' } },
    },
  ],
});
