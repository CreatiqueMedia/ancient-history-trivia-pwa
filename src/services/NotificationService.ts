// Notification Service for user engagement and re-engagement
// Handles push notifications, email reminders, and in-app notifications

interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requiresPermission?: boolean;
  scheduledFor?: Date;
}

interface EmailNotification {
  type: 'welcome' | 'trial_reminder' | 'achievement' | 'daily_reminder' | 'password_reset';
  recipient: {
    email: string;
    displayName: string;
  };
  data: Record<string, any>;
}

class NotificationService {
  private permission: NotificationPermission = 'default';
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  async initialize(): Promise<void> {
    // Check if browser supports notifications
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return;
    }

    // Get current permission status
    this.permission = Notification.permission;

    // Register service worker for push notifications
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered for notifications');
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  // Request notification permission
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;

    // Track permission decision
    if (typeof gtag !== 'undefined') {
      gtag('event', 'notification_permission', {
        permission_status: permission,
        timestamp: new Date().toISOString()
      });
    }

    return permission === 'granted';
  }

  // Send browser notification
  async sendNotification(config: NotificationConfig): Promise<void> {
    if (this.permission !== 'granted') {
      if (config.requiresPermission) {
        const granted = await this.requestPermission();
        if (!granted) return;
      } else {
        return;
      }
    }

    const options: NotificationOptions = {
      body: config.body,
      icon: config.icon || '/icon-192.png',
      badge: config.badge || '/icon-192.png',
      tag: config.tag,
      vibrate: [200, 100, 200],
      actions: [
        {
          action: 'open',
          title: 'Open App'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    const notification = new Notification(config.title, options);
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }

  // Schedule daily reminder notifications
  scheduleDailyReminder(userProfile: any): void {
    if (!userProfile.preferences.notifications.dailyReminders) {
      return;
    }

    const reminderTime = userProfile.preferences.notifications.reminderTime || '19:00';
    const [hours, minutes] = reminderTime.split(':').map(Number);
    
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);
    
    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime.getTime() - now.getTime();
    
    setTimeout(() => {
      this.sendNotification({
        title: '🏛️ Ready for your daily history challenge?',
        body: 'Test your knowledge of ancient civilizations! Your daily streak awaits.',
        tag: 'daily-reminder',
        requiresPermission: true
      });
      
      // Schedule next reminder
      this.scheduleDailyReminder(userProfile);
    }, timeUntilReminder);
  }

  // Achievement unlock notification
  sendAchievementNotification(achievement: { title: string; description: string }): void {
    this.sendNotification({
      title: `🏆 Achievement Unlocked: ${achievement.title}`,
      body: achievement.description,
      tag: 'achievement',
      requiresPermission: false
    });
  }

  // Trial expiration reminder
  sendTrialReminderNotification(daysLeft: number): void {
    let title: string;
    let body: string;

    if (daysLeft === 1) {
      title = '⏰ Trial expires tomorrow!';
      body = 'Don\'t lose access to premium features. Subscribe now to continue your learning journey.';
    } else if (daysLeft === 3) {
      title = `⏰ Trial expires in ${daysLeft} days`;
      body = 'Enjoying the premium features? Subscribe now to keep unlimited access.';
    } else {
      title = `⏰ Trial expires in ${daysLeft} days`;
      body = 'Continue your ancient history adventure with unlimited quizzes and premium content.';
    }

    this.sendNotification({
      title,
      body,
      tag: 'trial-reminder',
      requiresPermission: true
    });
  }

  // Re-engagement notification for inactive users
  sendReEngagementNotification(lastActivityDays: number): void {
    let title: string;
    let body: string;

    if (lastActivityDays <= 3) {
      title = '🏛️ Ready for another challenge?';
      body = 'Test your ancient history knowledge with new questions!';
    } else if (lastActivityDays <= 7) {
      title = '📚 Miss learning about ancient history?';
      body = 'Come back and continue your journey through ancient civilizations!';
    } else {
      title = '🎓 We miss you!';
      body = 'Your ancient history knowledge is waiting to be tested. Come back and see what\'s new!';
    }

    this.sendNotification({
      title,
      body,
      tag: 're-engagement',
      requiresPermission: true
    });
  }

  // New content notification
  sendNewContentNotification(contentType: string, description: string): void {
    this.sendNotification({
      title: `🆕 New ${contentType} Available!`,
      body: description,
      tag: 'new-content',
      requiresPermission: false
    });
  }

  // Friend activity notification (for future social features)
  sendFriendActivityNotification(friendName: string, activity: string): void {
    this.sendNotification({
      title: `👥 ${friendName} ${activity}`,
      body: 'See how you compare and challenge them to a quiz!',
      tag: 'friend-activity',
      requiresPermission: false
    });
  }

  // Email notification handling
  async sendEmailNotification(notification: EmailNotification): Promise<void> {
    // In production, this would integrate with your email service
    // For development, we'll log the email that would be sent
    
    console.log(`[Email Service] Sending ${notification.type} email to ${notification.recipient.email}`);
    console.log('Email data:', notification.data);

    // Example integration with email service API
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notification)
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      console.log(`Email sent successfully: ${notification.type}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      
      // Track email failures for monitoring
      if (typeof gtag !== 'undefined') {
        gtag('event', 'email_send_failed', {
          email_type: notification.type,
          error_message: (error as Error).message
        });
      }
    }
  }

  // Smart notification timing based on user behavior
  getOptimalNotificationTime(userProfile: any): Date {
    const now = new Date();
    const defaultTime = new Date();
    defaultTime.setHours(19, 0, 0, 0); // 7 PM default

    // Use user's preferred reminder time if set
    if (userProfile.preferences.notifications.reminderTime) {
      const [hours, minutes] = userProfile.preferences.notifications.reminderTime.split(':').map(Number);
      defaultTime.setHours(hours, minutes, 0, 0);
    }

    // Adjust based on user's most active time (if we have that data)
    // This would be implemented based on analytics data
    
    return defaultTime;
  }

  // Clear all scheduled notifications
  clearAllNotifications(): void {
    if ('Notification' in window && this.serviceWorkerRegistration) {
      this.serviceWorkerRegistration.getNotifications().then(notifications => {
        notifications.forEach(notification => notification.close());
      });
    }
  }

  // Notification analytics
  trackNotificationInteraction(action: string, notificationType: string): void {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'notification_interaction', {
        action: action,
        notification_type: notificationType,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Get notification settings
  getNotificationSettings(): {
    permission: NotificationPermission;
    supported: boolean;
    serviceWorkerReady: boolean;
  } {
    return {
      permission: this.permission,
      supported: 'Notification' in window,
      serviceWorkerReady: this.serviceWorkerRegistration !== null
    };
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
