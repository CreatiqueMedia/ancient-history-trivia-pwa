import { test, expect } from '@playwright/test';

test.describe('Debug Store Buttons', () => {
  const APP_BASE_URL = 'https://ancient-history-trivia.web.app';
  
  test('debug store subscription tab buttons', async ({ page }) => {
    console.log('🔍 Debugging store buttons...');
    
    // Navigate to store subscription tab
    await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000); // Wait for React to hydrate
    
    // Get all buttons and their text
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons`);
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const isVisible = await button.isVisible();
      console.log(`Button ${i}: "${text}" (visible: ${isVisible})`);
    }
    
    // Get all links that might look like buttons
    const links = await page.locator('a').all();
    console.log(`Found ${links.length} links`);
    
    for (let i = 0; i < Math.min(links.length, 10); i++) {
      const link = links[i];
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      const isVisible = await link.isVisible();
      console.log(`Link ${i}: "${text}" href="${href}" (visible: ${isVisible})`);
    }
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-store-buttons.png', fullPage: true });
    console.log('📷 Screenshot saved as debug-store-buttons.png');
  });
});
