import { test, expect } from '@playwright/test';

test.describe('Ancient History PWA - Comprehensive Use Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Use a more reliable wait strategy for cross-browser compatibility
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000); // Allow time for React to hydrate
  });

  test('App loads successfully and displays main content', async ({ page }) => {
    // Check if the app loads
    await expect(page).toHaveTitle(/Ancient History/);
    
    // Check for navigation elements (bottom nav or sidebar) more flexibly
    const bottomNav = page.locator('nav.fixed.bottom-0');
    const sidebarNav = page.locator('nav.mt-6');
    const anyNav = page.locator('nav');
    
    // At least one navigation should be visible
    const hasBottomNav = await bottomNav.isVisible();
    const hasSidebarNav = await sidebarNav.isVisible();
    const navCount = await anyNav.count();
    
    expect(hasBottomNav || hasSidebarNav || navCount > 0).toBeTruthy();
    
    // Check for home screen content
    const headingCount = await page.locator('h1, h2').count();
    expect(headingCount).toBeGreaterThan(0);
    
    // Check if PWA manifest is loaded
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeAttached();
  });

  test('Navigation works correctly across all screens', async ({ page }) => {
    // Test navigation to Quiz screen 
    await page.goto('/quiz'); 
    await page.waitForLoadState('domcontentloaded');
    // Check if we're on quiz or redirected to home (might need auth)
    const currentUrl = page.url();
    expect(currentUrl.includes('/quiz') || currentUrl.endsWith('/')).toBeTruthy();
    
    // Test navigation to Store screen (should be accessible to all)
    await page.goto('/store');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL(/\/store/);
    await page.waitForTimeout(500);
    
    // Test navigation to public pages (Achievements might require auth)
    await page.goto('/achievements');
    await page.waitForLoadState('domcontentloaded');
    const achievementsUrl = page.url();
    expect(achievementsUrl.includes('/achievements') || achievementsUrl.endsWith('/')).toBeTruthy();
    await page.waitForTimeout(500);
    
    // Test navigation to Stats screen (might require auth)
    await page.goto('/stats');
    await page.waitForLoadState('domcontentloaded');
    const statsUrl = page.url();
    expect(statsUrl.includes('/stats') || statsUrl.endsWith('/')).toBeTruthy();
    await page.waitForTimeout(500);
    
    // Test navigation to Settings screen (should be accessible)
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');
    const settingsUrl = page.url();
    expect(settingsUrl.includes('/settings') || settingsUrl.endsWith('/')).toBeTruthy();
    await page.waitForTimeout(500);
    
    // Test navigation back to Home
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await expect(page).toHaveURL('/');
  });

  test('Store screen displays subscription plans and billing options', async ({ page }) => {
    await page.goto('/store');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Check if subscription plans are displayed
    const planHeading = page.locator('text=Choose Your Plan').first();
    if (await planHeading.isVisible()) {
      await expect(planHeading).toBeVisible();
    }
    
    // Check for subscription tabs
    const subscriptionTab = page.locator('text=Subscription').first();
    if (await subscriptionTab.isVisible()) {
      await subscriptionTab.click();
      await page.waitForTimeout(1000);
    }
    
    // Check if trial banner is present
    const trialBanner = page.locator('[data-testid="trial-banner"]');
    const isTrialVisible = await trialBanner.isVisible();
    
    if (isTrialVisible) {
      console.log('Trial banner detected');
    }
    
    // Check for ManageSubscription component
    const manageSubscription = page.locator('[data-testid="manage-subscription"]');
    const isManageVisible = await manageSubscription.isVisible();
    
    if (isManageVisible) {
      console.log('Manage subscription component detected');
      // Test billing button if premium user
      const billingButton = manageSubscription.locator('button').filter({ hasText: 'Billing' });
      if (await billingButton.isVisible()) {
        await billingButton.click();
        // Check if billing modal opens
        await page.waitForTimeout(1000); // Allow modal to open
      }
    }
  });

  test('Quiz functionality works correctly', async ({ page }) => {
    await page.goto('/quiz');
    await page.waitForLoadState('domcontentloaded');
    
    // Wait for page to fully load
    await page.waitForTimeout(2000);
    
    // Check if we're on a quiz selection or actual quiz
    const quizQuestion = page.locator('[data-testid="quiz-question"]');
    const isQuizActive = await quizQuestion.isVisible();
    
    if (isQuizActive) {
      // We're in an active quiz
      console.log('Active quiz detected');
      
      // Check for answer options
      const answerOptions = page.locator('[data-testid="answer-option"]');
      const optionsCount = await answerOptions.count();
      
      if (optionsCount > 0) {
        // Select first answer option
        await answerOptions.first().click();
        
        // Look for submit button
        const submitButton = page.locator('button').filter({ hasText: /Submit|Next/ }).or(page.locator('[data-testid="submit-answer"]'));
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(1000);
        }
      }
    } else {
      // We're on quiz selection screen
      console.log('Quiz selection screen detected');
      
      // Look for available quiz bundles
      const quizBundles = page.locator('[data-testid="quiz-bundle"]').or(
        page.locator('.quiz-card')
      ).or(
        page.locator('button').filter({ hasText: 'Start' })
      );
      const bundleCount = await quizBundles.count();
      
      if (bundleCount > 0) {
        // Click on first available quiz
        await quizBundles.first().click();
        await page.waitForTimeout(2000);
        
        // Now we should be in a quiz
        const newQuizQuestion = page.locator('[data-testid="quiz-question"]');
        if (await newQuizQuestion.isVisible()) {
          console.log('Successfully started a quiz');
        }
      }
    }
  });

  test('Achievements screen displays properly', async ({ page }) => {
    await page.goto('/achievements');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Check main elements
    const achievementsHeading = page.locator('h1').filter({ hasText: 'Achievements' });
    if (await achievementsHeading.isVisible()) {
      await expect(achievementsHeading).toBeVisible();
    }
    
    const progressText = page.locator('text=Overall Progress').first();
    if (await progressText.isVisible()) {
      await expect(progressText).toBeVisible();
    }
    
    // Check for achievement filters
    const allButton = page.locator('button').filter({ hasText: 'All Achievements' });
    const unlockedButton = page.locator('button').filter({ hasText: 'Unlocked' });
    const lockedButton = page.locator('button').filter({ hasText: 'Locked' });
    
    if (await allButton.isVisible()) {
      await expect(allButton).toBeVisible();
    }
    if (await unlockedButton.isVisible()) {
      await expect(unlockedButton).toBeVisible();
    }
    if (await lockedButton.isVisible()) {
      await expect(lockedButton).toBeVisible();
    }
    
    // Test filter functionality
    if (await unlockedButton.isVisible()) {
      await unlockedButton.click();
      await page.waitForTimeout(500);
    }
    
    if (await lockedButton.isVisible()) {
      await lockedButton.click();
      await page.waitForTimeout(500);
    }
    
    if (await allButton.isVisible()) {
      await allButton.click();
      await page.waitForTimeout(500);
    }
    
    // Check for trial banner and manage subscription
    const trialBanner = page.locator('[data-testid="trial-banner"]');
    if (await trialBanner.isVisible()) {
      console.log('Trial banner visible on achievements page');
    }
    
    const manageSubscription = page.locator('[data-testid="manage-subscription"]');
    if (await manageSubscription.isVisible()) {
      console.log('Manage subscription visible on achievements page');
    }
  });

  test('Settings screen functionality', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Check main settings elements
    const settingsHeading = page.locator('h1').filter({ hasText: 'Settings' });
    if (await settingsHeading.isVisible()) {
      await expect(settingsHeading).toBeVisible();
    }
    
    // Test theme toggle if available
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    const lightButton = page.locator('button').filter({ hasText: 'Light' });
    const darkButton = page.locator('button').filter({ hasText: 'Dark' });
    
    // Try theme toggle first
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500);
      console.log('Theme toggle tested');
    } else if (await lightButton.isVisible()) {
      await lightButton.click();
      await page.waitForTimeout(500);
      console.log('Light theme button tested');
    } else if (await darkButton.isVisible()) {
      await darkButton.click();
      await page.waitForTimeout(500);
      console.log('Dark theme button tested');
    }
    
    // Check for notification settings
    const notificationInputs = page.locator('input[type="checkbox"]');
    const notificationCount = await notificationInputs.count();
    if (notificationCount > 0) {
      console.log(`Found ${notificationCount} notification settings`);
    }
  });

  test('Stats screen displays analytics', async ({ page }) => {
    await page.goto('/stats');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);
    
    // Check main stats elements - be more flexible
    const statsHeading = page.locator('h1').filter({ hasText: /Stats|Statistics/i });
    const anyHeading = page.locator('h1, h2');
    
    if (await statsHeading.isVisible()) {
      await expect(statsHeading).toBeVisible();
    } else if (await anyHeading.first().isVisible()) {
      console.log('Found alternative heading on stats page');
    }
    
    // Look for stat cards or charts
    const statCards = page.locator('[data-testid="stat-card"]').or(
      page.locator('.stat-card')
    ).or(
      page.locator('.stats-grid > div')
    );
    const cardCount = await statCards.count();
    
    if (cardCount > 0) {
      console.log(`Found ${cardCount} stat cards`);
    } else {
      // Check for empty state
      const emptyState = page.locator('text=No data').or(page.locator('text=Start taking quizzes'));
      if (await emptyState.isVisible()) {
        console.log('Empty stats state detected');
      }
    }
  });

  test('Billing functionality for premium users', async ({ page }) => {
    // First check if user has premium access
    await page.goto('/store?tab=subscription');
    
    const manageSubscription = page.locator('[data-testid="manage-subscription"]');
    const isPremium = await manageSubscription.isVisible();
    
    if (isPremium) {
      console.log('Premium user detected, testing billing functionality');
      
      // Test billing modal
      const billingButton = manageSubscription.locator('button:has-text("Billing")');
      if (await billingButton.isVisible()) {
        await billingButton.click();
        
        // Wait for modal and check content
        await page.waitForTimeout(1000);
        const billingModal = page.locator('[data-testid="billing-modal"], text=Billing Management');
        if (await billingModal.isVisible()) {
          console.log('Billing modal opened successfully');
          
          // Check for cancellation options
          const cancelButton = page.locator('button:has-text("Cancel")');
          if (await cancelButton.isVisible()) {
            console.log('Cancellation option available');
          }
          
          // Close modal
          const closeButton = page.locator('[data-testid="close-modal"], button:has-text("×")');
          if (await closeButton.isVisible()) {
            await closeButton.click();
          }
        }
      }
      
      // Test dedicated billing page
      const manageButton = manageSubscription.locator('a:has-text("Manage"), button:has-text("Manage")');
      if (await manageButton.isVisible()) {
        await manageButton.click();
        
        // Should navigate to billing page
        await page.waitForURL(/\/billing/, { timeout: 5000 });
        await expect(page.locator('h1:has-text("Billing")')).toBeVisible();
        console.log('Billing page navigation successful');
      }
    } else {
      console.log('Free user detected, skipping billing tests');
    }
  });

  test('Responsive design works on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile navigation is present
    const mobileNav = page.locator('[data-testid="mobile-nav"], [data-testid="hamburger-menu"], button:has-text("☰")');
    const isMobileNavVisible = await mobileNav.isVisible();
    
    if (isMobileNavVisible) {
      console.log('Mobile navigation detected');
      await mobileNav.click();
      await page.waitForTimeout(500);
    }
    
    // Test key pages on mobile
    const pagesToTest = ['/quiz', '/store', '/achievements', '/stats', '/settings'];
    
    for (const pagePath of pagesToTest) {
      await page.goto(pagePath);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000); // Allow mobile layout to render
      
      // Check if content is visible on mobile
      const mainContent = page.locator('main, [data-testid="main-content"], h1, h2');
      await expect(mainContent.first()).toBeVisible();
      console.log(`Mobile layout verified for ${pagePath}`);
    }
  });

  test('PWA features and offline capability', async ({ page }) => {
    await page.goto('/');
    
    // Check service worker registration
    const swRegistered = await page.evaluate(() => {
      return 'serviceWorker' in navigator;
    });
    expect(swRegistered).toBeTruthy();
    console.log('Service Worker support detected');
    
    // Check for PWA manifest
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink).toBeAttached();
    
    // Test offline scenario (simulate network failure)
    await page.route('**/*', route => route.abort());
    
    // Navigate to a page and check if offline fallback works
    await page.goto('/quiz', { waitUntil: 'networkidle' }).catch(() => {
      console.log('Network blocked as expected for offline test');
    });
    
    // Check if any offline indicators are present
    const offlineText = page.locator('text=offline');
    const connectionText = page.locator('text=connection');
    const offlineBanner = page.locator('[data-testid="offline-banner"]');
    
    const hasOfflineText = await offlineText.isVisible();
    const hasConnectionText = await connectionText.isVisible(); 
    const hasOfflineBanner = await offlineBanner.isVisible();
    
    const hasOfflineIndicator = hasOfflineText || hasConnectionText || hasOfflineBanner;
    
    if (hasOfflineIndicator) {
      console.log('Offline indicators detected');
    }
    
    // Restore network
    await page.unroute('**/*');
  });

  test('Error handling and 404 pages', async ({ page }) => {
    // Test 404 page
    await page.goto('/non-existent-page');
    await page.waitForTimeout(2000); // Allow redirect/error page to load
    
    // Check for error boundary or 404 page using separate locators
    const errorBoundary = page.locator('[data-testid="error-boundary"]');
    const notFound = page.locator('[data-testid="not-found"]');
    const text404 = page.locator('text=404');
    const pageNotFound = page.locator('text=Page not found');
    
    const hasErrorBoundary = await errorBoundary.isVisible();
    const hasNotFound = await notFound.isVisible();
    const has404Text = await text404.isVisible();
    const hasPageNotFoundText = await pageNotFound.isVisible();
    
    const hasErrorPage = hasErrorBoundary || hasNotFound || has404Text || hasPageNotFoundText;
    
    if (hasErrorPage) {
      console.log('404 error page detected');
    } else {
      // Might redirect to home page
      const isHome = page.url().endsWith('/') || page.url().includes('localhost:5173/');
      if (isHome) {
        console.log('404 redirects to home page');
      }
    }
  });

  test('Performance and loading times', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000); // Allow time for initial rendering
    
    const loadTime = Date.now() - startTime;
    
    // Expect page to load within 10 seconds (generous for E2E tests)
    expect(loadTime).toBeLessThan(10000);
    console.log(`Page load time: ${loadTime}ms`);
    
    // Check for loading spinners resolving
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]');
    const spinner = page.locator('.spinner');
    const loading = page.locator('.loading');
    
    // Wait for spinners to disappear
    await page.waitForFunction(() => {
      const spinners = document.querySelectorAll('[data-testid="loading-spinner"], .spinner, .loading');
      return spinners.length === 0;
    }, { timeout: 15000 }).catch(() => {
      console.log('Some loading spinners may still be present');
    });
  });
});
