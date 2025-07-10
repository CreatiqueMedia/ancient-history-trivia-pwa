import { analyticsService } from './src/services/AnalyticsService';

// Test if methods exist
console.log('trackPurchaseSuccess method exists:', typeof analyticsService.trackPurchaseSuccess);
console.log('trackPurchaseFailure method exists:', typeof analyticsService.trackPurchaseFailure);
console.log('trackCustomEvent method exists:', typeof analyticsService.trackCustomEvent);

// List all methods
console.log('All methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(analyticsService)));
