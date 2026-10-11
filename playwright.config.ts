import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

// CI verifies Pages' canonical redirects and headers, which Vite does not model.
const useCloudflare = process.env.CVONLINE_TEST_CLOUDFLARE === 'true' || (Boolean(process.env.CI) && process.env.CVONLINE_TEST_CLOUDFLARE !== 'false');

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    locale: 'es-ES',
    viewport: { width: 1440, height: 1000 },
    acceptDownloads: true,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync('/usr/bin/chromium') ? '/usr/bin/chromium' : undefined),
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command: useCloudflare
      ? 'npm exec --yes --package=wrangler@4.149.0 -- wrangler pages dev dist --ip 127.0.0.1 --port 5173 --compatibility-date=2026-10-11'
      : 'npm run preview -- --port 5173 --strictPort',
    env: useCloudflare ? {
      XDG_CONFIG_HOME: '/tmp/cvonline-routing-config',
      NPM_CONFIG_CACHE: '/tmp/cvonline-npm-cache',
      WRANGLER_LOG_PATH: '/tmp/cvonline-wrangler.log',
      WRANGLER_SEND_METRICS: 'false',
    } : undefined,
    url: 'http://127.0.0.1:5173',
    // A running Vite preview must never satisfy a Pages regression run.
    reuseExistingServer: !process.env.CI && !useCloudflare,
    timeout: 60_000,
  },
});
