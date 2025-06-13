// Global type definitions for the Ancient History PWA

// Google Analytics gtag function
declare global {
  function gtag(
    command: 'config' | 'event' | 'js' | 'set',
    targetId: string | Date | object,
    config?: object
  ): void;

  // Sentry global types
  interface SentryOptions {
    tags?: { [key: string]: string };
    level?: 'fatal' | 'error' | 'warning' | 'info' | 'debug';
    extra?: { [key: string]: any };
  }
  
  const Sentry: {
    captureException(error: Error, options?: SentryOptions): void;
    captureMessage(message: string, options?: SentryOptions): void;
  } | undefined;

  // Extended NotificationOptions to include vibrate and actions
  interface NotificationOptions {
    vibrate?: number[] | number;
    actions?: NotificationAction[];
  }

  interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
  }

  // Test environment globals
  namespace NodeJS {
    interface Global {
      IS_REACT_ACT_ENVIRONMENT: boolean;
    }
  }

  // Extended globalThis for test setup
  var globalThis: typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
  };
}

// SVG imports
declare module '*.svg' {
  const content: string;
  export default content;
}

// Make this file a module
export {};
