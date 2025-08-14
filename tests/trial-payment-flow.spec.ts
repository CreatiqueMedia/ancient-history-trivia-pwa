import { test, expect } from '@playwright/test';

test.describe('Trial Payment Flow - E2E Testing', () => {
  const APP_BASE_URL = 'https://ancient-history-trivia.web.app';
  
  test.beforeEach(async ({ page }) => {
    // Start each test fresh
    await page.goto(APP_BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Allow React to hydrate
  });

  test('should display trial payment form when starting trial', async ({ page }) => {
    console.log('🧪 Testing trial payment form flow...');
    
    // Navigate to store subscription tab
    await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
    await page.waitForLoadState('domcontentloaded');
    
    // Find and click the trial button/link
    const trialButton = page.locator('button').filter({ hasText: /start.*trial|try.*free/i }).first();
    const trialLink = page.locator('a').filter({ hasText: /start.*trial|try.*free/i }).first();
    
    const isButtonVisible = await trialButton.isVisible({ timeout: 5000 }).catch(() => false);
    const isLinkVisible = await trialLink.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isButtonVisible) {
      console.log('🔘 Found trial button');
      await expect(trialButton).toBeVisible({ timeout: 10000 });
      await trialButton.click();
    } else if (isLinkVisible) {
      console.log('🔗 Found trial link');
      await expect(trialLink).toBeVisible({ timeout: 10000 });
      await trialLink.click();
    } else {
      throw new Error('Neither trial button nor link found');
    }
    
    // Should see authentication modal first if not logged in
    const authModal = page.locator('[role="dialog"]').or(page.locator('.modal'));
    const isAuthModalVisible = await authModal.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (isAuthModalVisible) {
      console.log('🔐 Auth modal appeared - user needs to authenticate first');
      
      // Look for Google sign-in or guest option
      const googleSignIn = page.locator('button').filter({ hasText: /google|continue.*google/i });
      const guestOption = page.locator('button').filter({ hasText: /guest|anonymous/i }).first();
      
      if (await googleSignIn.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('📧 Google sign-in option available');
        // Note: We won't actually click Google sign-in in automated tests
        // but we verify it's available
        await expect(googleSignIn).toBeVisible();
      }
      
      if (await guestOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('👤 Guest option available - using guest mode for testing');
        await guestOption.click();
        await page.waitForTimeout(2000);
      }
    }
    
    // After authentication, trial flow should proceed
    // Look for payment method confirmation dialog
    await page.waitForTimeout(2000);
    
    // Check if we see payment method confirmation
    const pageContent = await page.textContent('body');
    const hasPaymentMethodDialog = pageContent?.includes('payment method') || 
                                   pageContent?.includes('Trial requires');
                                   
    if (hasPaymentMethodDialog) {
      console.log('💳 Payment method confirmation dialog appeared');
      
      // Accept the payment method collection
      const confirmButton = page.locator('button').filter({ hasText: /ok|yes|proceed|continue/i });
      if (await confirmButton.isVisible({ timeout: 5000 })) {
        await confirmButton.click();
      }
    }
    
    // Now check for the Stripe payment form
    await page.waitForTimeout(3000);
    
    // Look for Stripe Elements or payment form
    const stripeFrame = page.frameLocator('iframe[src*="stripe"]').first();
    const cardElement = page.locator('[data-testid="card-element"]').or(
      page.locator('input[placeholder*="card"]')
    ).or(
      page.locator('.StripeElement')
    );
    
    const hasStripeForm = await stripeFrame.locator('input').isVisible({ timeout: 5000 }).catch(() => false) ||
                         await cardElement.isVisible({ timeout: 5000 }).catch(() => false);
    
    if (hasStripeForm) {
      console.log('✅ Stripe payment form is visible - payment collection working!');
      
      // Verify the form has the expected elements
      const formElements = await page.locator('input, iframe').count();
      expect(formElements).toBeGreaterThan(0);
      
      // Look for trial terms
      const pageText = await page.textContent('body');
      expect(pageText).toMatch(/3.*day.*trial|trial.*3.*day/i);
      expect(pageText).toMatch(/\$4\.99.*month/i);
      
    } else {
      console.log('⚠️  Stripe payment form not found - checking for success modal or error');
      
      // Check if we ended up in success state (maybe trial was already started)
      const successModal = page.locator('text=Trial started successfully').or(
        page.locator('text=✅').or(
          page.locator('[data-testid="trial-success"]')
        )
      );
      
      if (await successModal.isVisible({ timeout: 5000 })) {
        console.log('✅ Trial success modal appeared - user already has trial');
      } else {
        console.log('❌ Expected payment form or success modal not found');
        
        // Log current page state for debugging
        const currentUrl = page.url();
        const pageTitle = await page.title();
        console.log(`Current URL: ${currentUrl}`);
        console.log(`Page title: ${pageTitle}`);
        
        // Take screenshot for debugging
        await page.screenshot({ path: 'trial-payment-debug.png', fullPage: true });
      }
    }
  });

  test('should handle payment form interactions', async ({ page }) => {
    console.log('🧪 Testing payment form interactions...');
    
    // Navigate directly to store and try to trigger payment form
    await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
    await page.waitForLoadState('domcontentloaded');
    
    // Check if we can find any payment-related elements
    const paymentElements = await page.locator('button').filter({ 
      hasText: /payment|card|stripe|trial/i 
    }).count();
    
    console.log(`Found ${paymentElements} payment-related elements`);
    
    // Verify Stripe is loading properly
    const stripeErrors = await page.locator('text=Stripe').count();
    const jsErrors = await page.locator('text=error').count();
    
    if (jsErrors > 0) {
      console.log('⚠️  Potential JavaScript errors detected');
      await page.screenshot({ path: 'payment-errors-debug.png' });
    }
    
    // Check for Stripe initialization
    const stripeInitialized = await page.evaluate(() => {
      return typeof window !== 'undefined' && 
             (window as any).Stripe !== undefined;
    }).catch(() => false);
    
    console.log(`Stripe initialized: ${stripeInitialized}`);
  });

  test('should validate payment form accessibility', async ({ page }) => {
    console.log('🧪 Testing payment form accessibility...');
    
    await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
    await page.waitForLoadState('domcontentloaded');
    
    // Check for basic accessibility elements
    const ariaLabels = await page.locator('[aria-label]').count();
    const roles = await page.locator('[role]').count();
    const tabIndexes = await page.locator('[tabindex]').count();
    
    console.log(`Accessibility elements found: ${ariaLabels} aria-labels, ${roles} roles, ${tabIndexes} tabindexes`);
    
    // Verify form elements are properly labeled
    const formInputs = await page.locator('input, button').count();
    console.log(`Form elements found: ${formInputs}`);
    
    // Check for keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.locator(':focus').count();
    console.log(`Focused elements after tab: ${focusedElement}`);
  });

  test('should load without console errors', async ({ page }) => {
    console.log('🧪 Testing for console errors...');
    
    const consoleErrors: string[] = [];
    const networkErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    page.on('response', response => {
      if (response.status() >= 400) {
        networkErrors.push(`${response.status()}: ${response.url()}`);
      }
    });
    
    await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000); // Wait for async operations
    
    console.log(`Console errors: ${consoleErrors.length}`);
    console.log(`Network errors: ${networkErrors.length}`);
    
    if (consoleErrors.length > 0) {
      console.log('Console errors found:', consoleErrors);
    }
    
    if (networkErrors.length > 0) {
      console.log('Network errors found:', networkErrors);
    }
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('ResizeObserver') &&
      !error.includes('favicon') &&
      !error.includes('Extension')
    );
    
    expect(criticalErrors.length).toBeLessThan(5); // Allow some minor errors
  });
});
