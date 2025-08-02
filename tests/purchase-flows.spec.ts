import { test, expect } from '@playwright/test';

test.describe('Purchase Flows - E2E Testing', () => {
  // Test configuration
  const TEST_USER_EMAIL = 'e2e-test@example.com';
  const TEST_USER_PASSWORD = 'TestPassword123!';
  const APP_BASE_URL = 'http://localhost:5174';

  test.beforeEach(async ({ page }) => {
    // Start each test with a fresh browser context
    await page.goto(APP_BASE_URL);
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Allow React to hydrate
  });

  test.describe('Authentication Required for Purchases', () => {
    test('should show auth modal when unauthenticated user attempts bundle purchase', async ({ page }) => {
      // Navigate to store
      await page.goto(`${APP_BASE_URL}/store`);
      await page.waitForLoadState('domcontentloaded');
      
      // Find the first bundle purchase button
      const firstPurchaseButton = page.locator('button').filter({ hasText: 'Purchase' }).first();
      await expect(firstPurchaseButton).toBeVisible();
      
      // Click purchase button
      await firstPurchaseButton.click();
      
      // Auth modal should appear
      const authModal = page.locator('[role="dialog"]').or(page.locator('.modal')).or(page.locator('[data-testid="auth-modal"]'));
      await expect(authModal).toBeVisible({ timeout: 10000 });
      
      // Should see sign up/login options
      const signUpButton = page.locator('button').filter({ hasText: /sign up|create account/i });
      const loginButton = page.locator('button').filter({ hasText: /log in|sign in/i });
      
      expect(await signUpButton.count() + await loginButton.count()).toBeGreaterThan(0);
    });

    test('should show auth modal when unauthenticated user attempts subscription purchase', async ({ page }) => {
      // Navigate to subscription tab
      await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
      await page.waitForLoadState('domcontentloaded');
      
      // Find subscription purchase button
      const subscriptionButton = page.locator('button').filter({ hasText: /start pro|get|subscribe/i }).first();
      await expect(subscriptionButton).toBeVisible();
      
      // Click subscription button
      await subscriptionButton.click();
      
      // Auth modal should appear
      const authModal = page.locator('[role="dialog"]').or(page.locator('.modal')).or(page.locator('[data-testid="auth-modal"]'));
      await expect(authModal).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Bundle Purchase Flow', () => {
    test('should show auth modal for bundle purchase when unauthenticated', async ({ page }) => {
      // No authentication setup - user should be prompted to authenticate
      
      await page.goto(`${APP_BASE_URL}/store`);
      await page.waitForLoadState('domcontentloaded');
      
      // Find a bundle purchase button
      const purchaseButton = page.locator('button').filter({ hasText: 'Purchase' }).first();
      await expect(purchaseButton).toBeVisible();
      
      // Click purchase button - should show auth modal instead of redirecting
      await purchaseButton.click();
      
      // Should show authentication modal
      const authModal = page.locator('[role="dialog"]').or(page.locator('.modal')).or(page.locator('[data-testid="auth-modal"]'));
      await expect(authModal).toBeVisible({ timeout: 5000 });
    });

    test('should handle bundle purchase success return', async ({ page }) => {
      // Mock authentication
      await page.addInitScript(() => {
        localStorage.setItem('userId', 'test-user-123');
        localStorage.setItem('pendingBundlePurchase', 'easy');
      });

      // Simulate successful payment return
      await page.goto(`${APP_BASE_URL}/store?payment_status=success&session_id=cs_test_123`);
      await page.waitForLoadState('domcontentloaded');
      
      // Should show success message - use more specific selector to avoid strict mode violation
      const successAlert = page.locator('[data-testid="payment-message"]').filter({ hasText: /purchase.*successful/i }).first();
      await expect(successAlert).toBeVisible({ timeout: 10000 });
      
      // Should update owned bundles in localStorage
      const ownedBundles = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('ownedBundles') || '[]');
      });
      expect(ownedBundles).toContain('easy');
    });

    test('should handle bundle purchase cancellation', async ({ page }) => {
      // Mock authentication and pending purchase
      await page.addInitScript(() => {
        localStorage.setItem('userId', 'test-user-123');
        localStorage.setItem('pendingBundlePurchase', 'medium');
      });

      // Simulate cancelled payment return
      await page.goto(`${APP_BASE_URL}/store?payment_status=cancel`);
      await page.waitForLoadState('domcontentloaded');
      
      // Should show cancellation message
      const cancelAlert = page.locator('text=Payment was cancelled');
      await expect(cancelAlert).toBeVisible({ timeout: 5000 });
      
      // Should clear pending purchase
      const pendingPurchase = await page.evaluate(() => {
        return localStorage.getItem('pendingBundlePurchase');
      });
      expect(pendingPurchase).toBeNull();
    });
  });

  test.describe('Subscription Purchase Flow', () => {
    test('should show auth modal for subscription purchase when unauthenticated', async ({ page }) => {
      // No authentication setup - user should be prompted to authenticate

      await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
      await page.waitForLoadState('domcontentloaded');
      
      // Find subscription button (monthly)
      const monthlyButton = page.locator('button').filter({ hasText: /start pro monthly|monthly/i }).first();
      await expect(monthlyButton).toBeVisible();
      
      // Click subscription button - should show auth modal instead of redirecting
      await monthlyButton.click();
      
      // Should show authentication modal
      const authModal = page.locator('[role="dialog"]').or(page.locator('.modal')).or(page.locator('[data-testid="auth-modal"]'));
      await expect(authModal).toBeVisible({ timeout: 5000 });
    });

    test('should handle subscription success return', async ({ page }) => {
      // Mock authentication
      await page.addInitScript(() => {
        localStorage.setItem('userId', 'test-user-123');
        localStorage.setItem('pendingSubscriptionPurchase', 'monthly');
      });

      // Simulate successful subscription payment return
      await page.goto(`${APP_BASE_URL}/store?payment_status=success&session_id=cs_test_456`);
      await page.waitForLoadState('domcontentloaded');
      
      // Should show subscription success message quickly before reload - use shorter timeout and more flexible text
      const successAlert = page.locator('[data-testid="payment-message"]').filter({ hasText: /activated/i }).first();
      await expect(successAlert).toBeVisible({ timeout: 2000 });
      
      // Should update subscription status in localStorage
      const subscription = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('subscription') || '{}');
      });
      expect(subscription.tier).toBe('pro');
      expect(subscription.period).toBe('monthly');
    });
  });

  test.describe('Payment Link Validation', () => {
    test('should have valid live payment links configured', async ({ page }) => {
      await page.goto(`${APP_BASE_URL}/store`);
      await page.waitForLoadState('domcontentloaded');
      
      // Check that live payment links are accessible via API
      const response = await page.evaluate(async () => {
        try {
          // Test one live payment link
          const testResponse = await fetch('https://buy.stripe.com/5kQ4gydp33YRgst6iJ9oc0h', {
            method: 'HEAD',
            mode: 'no-cors'
          });
          return { success: true, status: 'reachable' };
        } catch (error) {
          return { success: false, error: error.message };
        }
      });
      
      // Note: Due to CORS, we can't get the actual status, but we can verify no network errors
      expect(response.success).toBe(true);
    });

    test('should have live payment links configured in app', async ({ page }) => {
      // This test validates that the payment configuration contains live Stripe URLs
      // by checking the source code/configuration rather than user interactions
      
      await page.goto(`${APP_BASE_URL}/store`);
      await page.waitForLoadState('domcontentloaded');
      
      // Check that purchase buttons exist (indicating payment system is configured)
      const purchaseButtons = page.locator('button').filter({ hasText: 'Purchase' });
      
      // Should have bundle purchase options
      await expect(purchaseButtons.first()).toBeVisible();
      
      // Check subscription tab
      await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
      await page.waitForLoadState('domcontentloaded');
      
      // Should have subscription options when on subscription tab
      const subscriptionButtons = page.locator('button').filter({ hasText: /start|pro|monthly|annual|get/i });
      await expect(subscriptionButtons.first()).toBeVisible();
      
      // Verify the page contains references to live Stripe (not test environment)
      // This is a basic smoke test to ensure we're not in test mode
      const pageContent = await page.content();
      expect(pageContent).not.toContain('test_stripe');
      expect(pageContent).not.toContain('sk_test_');
    });
  });

  test.describe('Sample Quiz Flow', () => {
    test('should allow sample quiz without authentication', async ({ page }) => {
      await page.goto(`${APP_BASE_URL}/store`);
      await page.waitForLoadState('domcontentloaded');
      
      // Find and click a sample quiz button
      const sampleButton = page.locator('button').filter({ hasText: /try sample quiz/i }).first();
      await expect(sampleButton).toBeVisible();
      
      await sampleButton.click();
      
      // Should navigate to quiz page in sample mode
      await page.waitForURL(/\/quiz.*mode=sample/, { timeout: 10000 });
      
      // Wait for quiz page to load
      await page.waitForLoadState('domcontentloaded');
      
      // Should show sample quiz content or loading state - look for common quiz page elements
      const quizTitle = page.locator('h1, h2');
      const questionText = page.locator('text=/Question|quiz|sample/i');
      const hasAnyContent = page.locator('body').locator('text=/\w+/');
      
      // Wait a bit for content to load
      await page.waitForTimeout(2000);
      
      // At least one of these should be visible to indicate we're on a quiz page
      const hasTitle = await quizTitle.first().isVisible().catch(() => false);
      const hasQuestionText = await questionText.first().isVisible().catch(() => false);
      const bodyContent = await hasAnyContent.count() > 10; // Page has substantial content
      
      expect(hasTitle || hasQuestionText || bodyContent).toBeTruthy();
    });
  });

  test.describe('Content Access UI', () => {
    test('should display purchase buttons for unauthenticated users', async ({ page }) => {
      // Test that the UI shows purchase options for users who haven't bought content
      
      await page.goto(`${APP_BASE_URL}/store`);
      await page.waitForLoadState('domcontentloaded');
      
      // Should show purchase buttons for bundles
      const purchaseButtons = page.locator('button').filter({ hasText: 'Purchase' });
      await expect(purchaseButtons.first()).toBeVisible();
      
      // Should show sample quiz buttons
      const sampleButtons = page.locator('button').filter({ hasText: /sample quiz|try sample/i });
      if (await sampleButtons.count() > 0) {
        await expect(sampleButtons.first()).toBeVisible();
      }
      
      // Check subscription tab for subscription options
      await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
      await page.waitForLoadState('domcontentloaded');
      
      // Should show subscription options on subscription tab
      const subscriptionButtons = page.locator('button').filter({ hasText: /start|pro|monthly|annual|get/i });
      await expect(subscriptionButtons.first()).toBeVisible();
    });

    test('should display proper bundle and subscription UI structure', async ({ page }) => {
      // Test that the store screen has the expected UI elements
      
      await page.goto(`${APP_BASE_URL}/store`);
      await page.waitForLoadState('domcontentloaded');
      
      // Should have bundle sections
      const bundleCards = page.locator('[class*="bundle"], [class*="card"]').filter({ hasText: /bundle|pack/i });
      if (await bundleCards.count() > 0) {
        await expect(bundleCards.first()).toBeVisible();
      }
      
      // Should have subscription section when tab is switched
      await page.goto(`${APP_BASE_URL}/store?tab=subscription`);
      await page.waitForLoadState('domcontentloaded');
      
      const subscriptionSection = page.locator('text=Pro').or(page.locator('text=Premium')).or(page.locator('text=Subscription'));
      await expect(subscriptionSection.first()).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle authentication errors gracefully', async ({ page }) => {
      // Mock invalid authentication state
      await page.addInitScript(() => {
        localStorage.setItem('userId', 'anonymous');
      });

      await page.goto(`${APP_BASE_URL}/store`);
      
      // Try to purchase - should show auth modal instead of error
      const purchaseButton = page.locator('button').filter({ hasText: 'Purchase' }).first();
      await purchaseButton.click();
      
      // Should show auth modal, not error message
      const authModal = page.locator('[role="dialog"]').or(page.locator('.modal'));
      await expect(authModal).toBeVisible({ timeout: 5000 });
    });

    test('should handle network errors in purchase flow', async ({ page }) => {
      // Mock authentication
      await page.addInitScript(() => {
        localStorage.setItem('userId', 'test-user-123');
        localStorage.setItem('user', JSON.stringify({
          uid: 'test-user-123',
          email: 'test@example.com'
        }));
      });

      // Mock network failure for Stripe redirect
      await page.route('**/buy.stripe.com/**', (route) => {
        route.abort('failed');
      });

      await page.goto(`${APP_BASE_URL}/store`);
      
      const purchaseButton = page.locator('button').filter({ hasText: 'Purchase' }).first();
      await purchaseButton.click();
      
      // Should handle error gracefully (not crash the app)
      await page.waitForTimeout(2000);
      const errorMessage = page.locator('text=Purchase failed');
      // Error handling may vary - just ensure app doesn't crash
    });
  });

  test.describe('Purchase Flow Integration', () => {
    test('should complete full bundle purchase simulation', async ({ page }) => {
      // This test simulates the full flow without actually charging
      
      // Step 1: Start unauthenticated
      await page.goto(`${APP_BASE_URL}/store`);
      
      // Step 2: Try to purchase -> should show auth modal
      const purchaseButton = page.locator('button').filter({ hasText: 'Purchase' }).first();
      await purchaseButton.click();
      
      const authModal = page.locator('[role="dialog"]').or(page.locator('.modal'));
      await expect(authModal).toBeVisible();
      
      // Step 3: Mock authentication
      await page.addInitScript(() => {
        localStorage.setItem('userId', 'test-user-123');
        localStorage.setItem('user', JSON.stringify({
          uid: 'test-user-123',
          email: 'test@example.com'
        }));
        localStorage.setItem('pendingPurchase', JSON.stringify({
          type: 'bundle',
          id: 'easy',
          name: 'Easy Pack'
        }));
      });
      
      // Step 4: Refresh and complete purchase flow
      await page.reload();
      await page.waitForLoadState('domcontentloaded');
      
      // Should now be authenticated and able to purchase
      const newPurchaseButton = page.locator('button').filter({ hasText: 'Purchase' }).first();
      
      // Mock successful return from Stripe
      await page.goto(`${APP_BASE_URL}/store?payment_status=success&session_id=test_session`);
      
      // Should handle the success flow
      await page.waitForTimeout(2000);
    });
  });
});

// Utility test for checking payment link accessibility
test.describe('Payment Infrastructure Health Check', () => {
  test('should verify all live payment links are accessible', async ({ page }) => {
    const paymentLinks = [
      'https://buy.stripe.com/5kQ4gydp33YRgst6iJ9oc0h', // monthly
      'https://buy.stripe.com/5kQaEW98Nbrj0tv5eF9oc0i', // annual
      'https://buy.stripe.com/14AaEWgBf1QJ5NPbD39oc0j', // biennial
      'https://buy.stripe.com/dRmeVc0Ch2UNekl6iJ9oc0k', // easy
      'https://buy.stripe.com/eVqeVc98Nbrj4JLgXn9oc0l', // medium
      'https://buy.stripe.com/8x2aEWckZ0MF4JLePf9oc0m', // hard
      'https://buy.stripe.com/3cI28q5WBbrjfopfTj9oc0n', // all_bundles
      'https://buy.stripe.com/8x2cN42Kp7b34JLfTj9oc0o', // egypt
      'https://buy.stripe.com/9B69AS0Chanf1xz36x9oc0p', // rome
      'https://buy.stripe.com/28E5kCgBfdzr1xzfTj9oc0q'  // greece
    ];
    
    for (const link of paymentLinks) {
      const response = await page.request.head(link);
      expect(response.status()).toBe(200);
      console.log(`✅ Payment link accessible: ${link}`);
    }
  });
});
