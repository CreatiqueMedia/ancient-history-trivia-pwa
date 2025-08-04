/**
 * Cross-Browser Testing Utilities
 * Handles browser-specific differences and provides consistent test helpers
 */

import { Page, expect } from '@playwright/test';

type BrowserName = 'chromium' | 'firefox' | 'webkit';

export class CrossBrowserHelpers {
  /**
   * Wait for page to be fully loaded with browser-specific optimizations
   */
  static async waitForPageLoad(page: Page, options: { timeout?: number } = {}) {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;
    const timeout = options.timeout || 30000;

    try {
      // Wait for network idle (works best across all browsers)
      await page.waitForLoadState('networkidle', { timeout });
      
      // Browser-specific additional waits
      switch (browserName) {
        case 'webkit':
          // WebKit needs extra time for rendering
          await page.waitForTimeout(1000);
          break;
        case 'firefox':
          // Firefox sometimes needs time for JS execution
          await page.waitForTimeout(500);
          break;
        default:
          // Chromium is usually fastest
          await page.waitForTimeout(200);
      }
    } catch (error) {
      console.warn(`[CrossBrowser] NetworkIdle timeout for ${browserName}, falling back to domcontentloaded`);
      await page.waitForLoadState('domcontentloaded', { timeout });
    }
  }

  /**
   * Click element with browser-specific retry logic
   */
  static async clickElement(page: Page, selector: string, options: { timeout?: number; force?: boolean } = {}) {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;
    const timeout = options.timeout || 10000;

    // Browser-specific click strategies
    switch (browserName) {
      case 'webkit':
        // WebKit sometimes needs scrolling into view first
        await page.locator(selector).scrollIntoViewIfNeeded({ timeout });
        await page.waitForTimeout(200);
        await page.locator(selector).click({ timeout, force: options.force });
        break;
        
      case 'firefox':
        // Firefox may need double-check for element visibility
        await page.locator(selector).waitFor({ state: 'visible', timeout });
        await page.locator(selector).click({ timeout, force: options.force });
        break;
        
      default:
        // Chromium standard click
        await page.locator(selector).click({ timeout, force: options.force });
    }
  }

  /**
   * Fill input with browser-specific handling
   */
  static async fillInput(page: Page, selector: string, value: string, options: { timeout?: number } = {}) {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;
    const timeout = options.timeout || 10000;

    // Clear field first (browser-specific)
    switch (browserName) {
      case 'webkit':
        // WebKit sometimes needs multiple clear attempts
        await page.locator(selector).click({ timeout });
        await page.locator(selector).fill('', { timeout });
        await page.waitForTimeout(100);
        await page.locator(selector).fill(value, { timeout });
        break;
        
      case 'firefox':
        // Firefox prefers select all + type
        await page.locator(selector).click({ timeout });
        await page.keyboard.press('Meta+A'); // Cmd+A / Ctrl+A
        await page.locator(selector).fill(value, { timeout });
        break;
        
      default:
        // Chromium standard fill
        await page.locator(selector).fill(value, { timeout });
    }
  }

  /**
   * Wait for element with browser-specific timeouts
   */
  static async waitForElement(page: Page, selector: string, options: { 
    state?: 'visible' | 'hidden' | 'attached' | 'detached';
    timeout?: number;
  } = {}) {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;
    const state = options.state || 'visible';
    
    // Browser-specific timeouts
    const timeouts = {
      webkit: options.timeout || 20000,
      firefox: options.timeout || 15000,
      chromium: options.timeout || 10000
    };

    const timeout = timeouts[browserName] || 10000;

    try {
      await page.locator(selector).waitFor({ state, timeout });
    } catch (error) {
      console.warn(`[CrossBrowser] Element wait failed for ${browserName}: ${selector}`);
      throw error;
    }
  }

  /**
   * Handle navigation with browser-specific optimizations
   */
  static async navigate(page: Page, url: string, options: { timeout?: number } = {}) {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;
    
    // Browser-specific navigation timeouts
    const timeouts = {
      webkit: options.timeout || 45000,
      firefox: options.timeout || 30000,
      chromium: options.timeout || 20000
    };

    const timeout = timeouts[browserName] || 30000;

    await page.goto(url, { 
      timeout,
      waitUntil: 'domcontentloaded' // More reliable than networkidle
    });

    // Additional wait for browser-specific rendering
    await this.waitForPageLoad(page, { timeout: 10000 });
  }

  /**
   * Handle modal/dialog interactions
   */
  static async handleModal(page: Page, selector: string, action: 'open' | 'close' | 'interact') {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;

    switch (action) {
      case 'open':
        if (browserName === 'webkit') {
          // WebKit needs extra time for modal animations
          await this.clickElement(page, selector);
          await page.waitForTimeout(500);
        } else {
          await this.clickElement(page, selector);
          await page.waitForTimeout(200);
        }
        break;

      case 'close':
        // Try multiple close methods for reliability
        try {
          await page.keyboard.press('Escape');
          await page.waitForTimeout(200);
        } catch {
          try {
            await this.clickElement(page, '[data-testid="modal-close"], .modal-close, [role="dialog"] button[aria-label*="close"]');
          } catch {
            console.warn('[CrossBrowser] Modal close fallback used');
            await page.keyboard.press('Escape');
          }
        }
        break;
    }
  }

  /**
   * Get browser-specific test configuration
   */
  static getBrowserConfig(browserName: BrowserName) {
    const configs = {
      webkit: {
        slowMo: 100,
        actionTimeout: 20000,
        navigationTimeout: 45000,
        retries: 3
      },
      firefox: {
        slowMo: 50,
        actionTimeout: 15000,
        navigationTimeout: 30000,
        retries: 2
      },
      chromium: {
        slowMo: 0,
        actionTimeout: 10000,
        navigationTimeout: 20000,
        retries: 1
      }
    };

    return configs[browserName] || configs.chromium;
  }

  /**
   * Assert text content with browser-specific handling
   */
  static async assertTextContent(page: Page, selector: string, expectedText: string | RegExp, options: { timeout?: number } = {}) {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;
    const timeout = options.timeout || 10000;

    // Wait for element to be visible first
    await this.waitForElement(page, selector, { state: 'visible', timeout });

    // Browser-specific text assertion
    if (browserName === 'webkit') {
      // WebKit sometimes has rendering delays
      await page.waitForTimeout(200);
    }

    const element = page.locator(selector);
    
    if (typeof expectedText === 'string') {
      await expect(element).toContainText(expectedText, { timeout });
    } else {
      // RegExp matching
      const textContent = await element.textContent({ timeout });
      expect(textContent).toMatch(expectedText);
    }
  }

  /**
   * Scroll element into view with browser compatibility
   */
  static async scrollIntoView(page: Page, selector: string) {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;

    if (browserName === 'webkit') {
      // WebKit scrolling can be finicky
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    } else {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
    }
  }

  /**
   * Take screenshot with browser-specific naming
   */
  static async takeScreenshot(page: Page, name: string) {
    const browserName = page.context().browser()?.browserType().name() as BrowserName;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    await page.screenshot({
      path: `test-results/screenshots/${browserName}-${name}-${timestamp}.png`,
      fullPage: true
    });
  }
}

export default CrossBrowserHelpers;
