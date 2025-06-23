// Analytics Service for tracking user behavior and conversion metrics
// This service can be easily integrated with Google Analytics, Mixpanel, or custom analytics

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

interface UserProperties {
  subscription_tier?: string;
  provider?: string;
  registration_date?: string;
  last_activity?: string;
  total_quizzes?: number;
  average_score?: number;
  preferred_category?: string;
}

class AnalyticsService {
  private isEnabled: boolean = true;
  private userId: string | null = null;
  private userProperties: UserProperties = {};

  // Initialize analytics with user ID
  setUserId(userId: string): void {
    this.userId = userId;
    this.logEvent('user_login', { user_id: userId });
  }

  // Set user properties for segmentation
  setUserProperties(properties: UserProperties): void {
    this.userProperties = { ...this.userProperties, ...properties };
    
    // In production, send to analytics service
    if (this.isEnabled && import.meta.env.DEV) {
      console.log('[Analytics] User Properties:', this.userProperties);
    }
  }

  // Track authentication events
  trackSignUp(provider: string): void {
    this.logEvent('sign_up', {
      method: provider,
      timestamp: new Date().toISOString()
    });
  }

  trackSignIn(provider: string): void {
    this.logEvent('login', {
      method: provider,
      timestamp: new Date().toISOString()
    });
  }

  trackSignOut(): void {
    this.logEvent('logout', {
      session_duration: this.calculateSessionDuration(),
      timestamp: new Date().toISOString()
    });
  }

  // Track subscription events
  trackSubscriptionStart(tier: string, trialDays?: number): void {
    this.logEvent('subscription_start', {
      subscription_tier: tier,
      is_trial: trialDays ? true : false,
      trial_days: trialDays,
      timestamp: new Date().toISOString()
    });
  }

  trackSubscriptionUpgrade(fromTier: string, toTier: string): void {
    this.logEvent('subscription_upgrade', {
      from_tier: fromTier,
      to_tier: toTier,
      timestamp: new Date().toISOString()
    });
  }

  trackSubscriptionCancel(tier: string, reason?: string): void {
    this.logEvent('subscription_cancel', {
      subscription_tier: tier,
      cancellation_reason: reason,
      timestamp: new Date().toISOString()
    });
  }

  // Track quiz activity
  trackQuizStart(bundleId: string, category: string): void {
    this.logEvent('quiz_start', {
      bundle_id: bundleId,
      category: category,
      timestamp: new Date().toISOString()
    });
  }

  trackQuizComplete(
    bundleId: string,
    score: number,
    timeSpent: number,
    questionsAnswered: number
  ): void {
    this.logEvent('quiz_complete', {
      bundle_id: bundleId,
      score: score,
      time_spent: timeSpent,
      questions_answered: questionsAnswered,
      timestamp: new Date().toISOString()
    });
  }

  // Track user engagement
  trackPageView(pageName: string): void {
    this.logEvent('page_view', {
      page_name: pageName,
      timestamp: new Date().toISOString()
    });
  }

  trackFeatureUsage(featureName: string, context?: string): void {
    this.logEvent('feature_usage', {
      feature_name: featureName,
      context: context,
      timestamp: new Date().toISOString()
    });
  }

  trackAchievementUnlock(achievementId: string, category: string): void {
    this.logEvent('achievement_unlock', {
      achievement_id: achievementId,
      category: category,
      timestamp: new Date().toISOString()
    });
  }

  // Track conversion funnel
  trackFunnelStep(step: string, success: boolean = true): void {
    this.logEvent('funnel_step', {
      step: step,
      success: success,
      timestamp: new Date().toISOString()
    });
  }

  // Track errors
  trackError(error: string, context?: string): void {
    this.logEvent('error', {
      error_message: error,
      context: context,
      timestamp: new Date().toISOString()
    });
  }

  // Core logging method
  private logEvent(eventName: string, parameters: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    const event: AnalyticsEvent = {
      name: eventName,
      parameters: {
        ...parameters,
        user_id: this.userId,
        session_id: this.getSessionId(),
      }
    };

    // Console logging for development only
    if (import.meta.env.DEV) {
      console.log(`[Analytics] ${eventName}:`, event.parameters);
    }

    // In production, integrate with your analytics service:
    // - Google Analytics 4: gtag('event', eventName, parameters)
    // - Mixpanel: mixpanel.track(eventName, parameters)
    // - Custom API: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) })
    
    // Example Google Analytics 4 integration:
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
  }

  // Helper methods
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private calculateSessionDuration(): number {
    const sessionStart = sessionStorage.getItem('session_start_time');
    if (sessionStart) {
      return Date.now() - parseInt(sessionStart);
    }
    return 0;
  }

  // Control analytics
  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  // Initialize session tracking
  initSession(): void {
    sessionStorage.setItem('session_start_time', Date.now().toString());
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
