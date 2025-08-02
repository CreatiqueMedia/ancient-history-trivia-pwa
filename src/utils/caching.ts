/**
 * Advanced caching strategies for the PWA
 */

// Cache configuration
export const CACHE_CONFIG = {
  // Static assets cache
  STATIC_CACHE: 'static-assets-v1',
  DYNAMIC_CACHE: 'dynamic-content-v1',
  API_CACHE: 'api-responses-v1',
  
  // Cache durations (in milliseconds)
  DURATIONS: {
    STATIC_ASSETS: 365 * 24 * 60 * 60 * 1000, // 1 year
    DYNAMIC_CONTENT: 24 * 60 * 60 * 1000, // 1 day
    API_RESPONSES: 5 * 60 * 1000, // 5 minutes
  }
};

/**
 * Enhanced localStorage with expiration
 */
export class SmartCache {
  private static setItem(key: string, value: any, expirationMs?: number): void {
    const item = {
      value,
      timestamp: Date.now(),
      expiration: expirationMs ? Date.now() + expirationMs : null
    };
    
    try {
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      // Handle quota exceeded error
      console.warn('LocalStorage quota exceeded, clearing old items');
      this.clearExpired();
      
      try {
        localStorage.setItem(key, JSON.stringify(item));
      } catch (retryError) {
        console.error('Failed to store item in localStorage:', retryError);
      }
    }
  }

  private static getItem(key: string): any {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      // Check if item has expired
      if (item.expiration && Date.now() > item.expiration) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Failed to parse localStorage item:', error);
      localStorage.removeItem(key);
      return null;
    }
  }

  private static clearExpired(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      try {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          const item = JSON.parse(itemStr);
          if (item.expiration && Date.now() > item.expiration) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Invalid JSON, remove it
        localStorage.removeItem(key);
      }
    });
  }

  // Public methods
  static cacheQuizData(bundleId: string, data: any): void {
    this.setItem(`quiz-data-${bundleId}`, data, CACHE_CONFIG.DURATIONS.DYNAMIC_CONTENT);
  }

  static getCachedQuizData(bundleId: string): any {
    return this.getItem(`quiz-data-${bundleId}`);
  }

  static cacheUserStats(userId: string, stats: any): void {
    this.setItem(`user-stats-${userId}`, stats, CACHE_CONFIG.DURATIONS.API_RESPONSES);
  }

  static getCachedUserStats(userId: string): any {
    return this.getItem(`user-stats-${userId}`);
  }

  static cacheLeaderboard(data: any): void {
    this.setItem('leaderboard-data', data, CACHE_CONFIG.DURATIONS.API_RESPONSES);
  }

  static getCachedLeaderboard(): any {
    return this.getItem('leaderboard-data');
  }

  static cacheSettings(settings: any): void {
    this.setItem('app-settings', settings, CACHE_CONFIG.DURATIONS.STATIC_ASSETS);
  }

  static getCachedSettings(): any {
    return this.getItem('app-settings');
  }

  static clearAll(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('quiz-data-') || 
          key.startsWith('user-stats-') || 
          key === 'leaderboard-data') {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * Image caching utilities
 */
export class ImageCache {
  private static cache = new Map<string, Promise<string>>();

  static async preloadImage(src: string): Promise<string> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    const promise = new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = reject;
      img.src = src;
    });

    this.cache.set(src, promise);
    return promise;
  }

  static async preloadImages(sources: string[]): Promise<string[]> {
    return Promise.all(sources.map(src => this.preloadImage(src)));
  }

  static clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Network-aware caching
 */
export class NetworkAwareCache {
  private static getConnectionType(): string {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;
    
    return connection?.effectiveType || 'unknown';
  }

  private static isSlowConnection(): boolean {
    const connectionType = this.getConnectionType();
    return ['slow-2g', '2g'].includes(connectionType);
  }

  static shouldUseCache(): boolean {
    // Always use cache on slow connections
    if (this.isSlowConnection()) {
      return true;
    }

    // Use cache if offline
    if (!navigator.onLine) {
      return true;
    }

    return false;
  }

  static getOptimalCacheDuration(): number {
    if (this.isSlowConnection()) {
      return CACHE_CONFIG.DURATIONS.DYNAMIC_CONTENT * 2; // Extended caching
    }

    return CACHE_CONFIG.DURATIONS.API_RESPONSES;
  }
}

/**
 * Performance monitoring for cache effectiveness
 */
export class CacheMetrics {
  private static metrics = {
    hits: 0,
    misses: 0,
    totalRequests: 0
  };

  static recordHit(): void {
    this.metrics.hits++;
    this.metrics.totalRequests++;
  }

  static recordMiss(): void {
    this.metrics.misses++;
    this.metrics.totalRequests++;
  }

  static getHitRate(): number {
    if (this.metrics.totalRequests === 0) return 0;
    return this.metrics.hits / this.metrics.totalRequests;
  }

  static getMetrics() {
    return {
      ...this.metrics,
      hitRate: this.getHitRate()
    };
  }

  static reset(): void {
    this.metrics = { hits: 0, misses: 0, totalRequests: 0 };
  }
}
