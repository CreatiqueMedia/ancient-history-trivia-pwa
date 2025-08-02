import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results.json' }],
    ['list']
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot only when test fails */
    screenshot: 'only-on-failure',
    
    /* Record video only when test fails */
    video: 'retain-on-failure',
    
    /* Global timeouts - conservative for cross-browser compatibility */
    actionTimeout: 10000,
    navigationTimeout: 30000,
    
    /* Ignore HTTPS errors in development */
    ignoreHTTPSErrors: true,
    
    /* Enable experimental features for better cross-browser support */
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9'
    }
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Chromium-specific optimizations
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write']
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        // Firefox-specific configurations
        launchOptions: {
          firefoxUserPrefs: {
            'dom.webnotifications.enabled': false,
            'media.navigator.permission.disabled': true,
          }
        },
        // Increased timeouts for Firefox
        actionTimeout: 15000,
        navigationTimeout: 30000,
      },
    },

    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        // WebKit/Safari-specific configurations
        launchOptions: {
          // Disable web security for testing
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor']
        },
        // Increased timeouts for WebKit
        actionTimeout: 20000,
        navigationTimeout: 45000,
      },
    },

    /* Test against mobile viewports with enhanced configurations */
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        // Mobile Chrome specific settings
        hasTouch: true,
        isMobile: true,
        actionTimeout: 10000,
      },
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 12'],
        // Mobile Safari specific settings
        hasTouch: true,
        isMobile: true,
        actionTimeout: 15000,
        navigationTimeout: 30000,
      },
    },

    /* Edge browser testing */
    {
      name: 'edge',
      use: { 
        ...devices['Desktop Edge'],
        channel: 'msedge'
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
