/**
 * Performance Monitoring Service
 * Tracks Core Web Vitals and application performance metrics
 */

// Web Vitals types
interface WebVital {
  name: string;
  value: number;
  id: string;
  rating: 'good' | 'needs-improvement' | 'poor';
}

interface PerformanceMetrics {
  // Core Web Vitals
  CLS?: WebVital; // Cumulative Layout Shift
  INP?: WebVital; // Interaction to Next Paint (replaces FID)
  LCP?: WebVital; // Largest Contentful Paint
  FCP?: WebVital; // First Contentful Paint
  TTFB?: WebVital; // Time to First Byte
  
  // Custom metrics
  pageLoadTime?: number;
  navigationTiming?: PerformanceNavigationTiming;
  resourceTiming?: PerformanceResourceTiming[];
  memoryUsage?: any;
}

export class PerformanceMonitor {
  private static metrics: PerformanceMetrics = {};
  private static isInitialized = false;

  /**
   * Initialize performance monitoring
   */
  static async initialize() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Only monitor in production
    if (import.meta.env.MODE !== 'production') {
      console.log('[PerformanceMonitor] Skipping initialization in development');
      return;
    }

    try {
      // Import web-vitals library dynamically - FID is deprecated in v4+, use INP instead
      const { onCLS, onLCP, onFCP, onTTFB, onINP } = await import('web-vitals');

      // Measure Core Web Vitals
      onCLS((metric: any) => this.recordWebVital('CLS', metric));
      onINP((metric: any) => this.recordWebVital('INP', metric)); // INP replaces FID
      onLCP((metric: any) => this.recordWebVital('LCP', metric));
      onFCP((metric: any) => this.recordWebVital('FCP', metric));
      onTTFB((metric: any) => this.recordWebVital('TTFB', metric));

      // Set up additional monitoring
      this.setupNavigationTiming();
      this.setupResourceTiming();
      this.setupMemoryMonitoring();
      this.setupErrorMonitoring();

      console.log('[PerformanceMonitor] Initialized successfully');
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to initialize web-vitals:', error);
      // Fallback to basic performance monitoring
      this.setupBasicMonitoring();
    }
  }

  /**
   * Record Web Vital metric
   */
  private static recordWebVital(name: string, metric: any) {
    const webVital: WebVital = {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      rating: metric.rating || this.getRating(name, metric.value)
    };

    this.metrics[name as keyof PerformanceMetrics] = webVital;
    
    console.log(`[PerformanceMonitor] ${name}:`, webVital);
    
    // Send to analytics
    this.sendToAnalytics(name, webVital);
  }

  /**
   * Get performance rating based on thresholds
   */
  private static getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      INP: { good: 200, poor: 500 }, // INP thresholds in milliseconds
      LCP: { good: 2500, poor: 4000 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name as keyof typeof thresholds];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Setup navigation timing monitoring
   */
  private static setupNavigationTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.metrics.navigationTiming = navigation;
          this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          
          console.log('[PerformanceMonitor] Page Load Time:', this.metrics.pageLoadTime);
          this.sendToAnalytics('page_load_time', { value: this.metrics.pageLoadTime });
        }
      }, 0);
    });
  }

  /**
   * Setup resource timing monitoring
   */
  private static setupResourceTiming() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
        this.metrics.resourceTiming = resources;
        
        // Analyze slow resources
        const slowResources = resources.filter(resource => resource.duration > 1000);
        if (slowResources.length > 0) {
          console.warn('[PerformanceMonitor] Slow resources detected:', slowResources);
          this.sendToAnalytics('slow_resources', { count: slowResources.length });
        }
      }, 1000);
    });
  }

  /**
   * Setup memory monitoring
   */
  private static setupMemoryMonitoring() {
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = {
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          timestamp: Date.now()
        };

        // Warn if memory usage is high
        const memoryUsagePercent = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
        if (memoryUsagePercent > 80) {
          console.warn('[PerformanceMonitor] High memory usage:', memoryUsagePercent.toFixed(2) + '%');
          this.sendToAnalytics('high_memory_usage', { percentage: memoryUsagePercent });
        }
      };

      // Check memory usage every 30 seconds
      setInterval(checkMemory, 30000);
      checkMemory(); // Initial check
    }
  }

  /**
   * Setup error monitoring
   */
  private static setupErrorMonitoring() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.sendToAnalytics('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.sendToAnalytics('unhandled_rejection', {
        reason: event.reason?.toString() || 'Unknown'
      });
    });

    // Resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.sendToAnalytics('resource_error', {
          tagName: (event.target as any)?.tagName,
          src: (event.target as any)?.src || (event.target as any)?.href
        });
      }
    }, true);
  }

  /**
   * Setup basic monitoring fallback
   */
  private static setupBasicMonitoring() {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.fetchStart;
        console.log('[PerformanceMonitor] Basic Load Time:', loadTime);
        this.sendToAnalytics('page_load_time_basic', { value: loadTime });
      }
    });
  }

  /**
   * Send metrics to analytics service
   */
  private static sendToAnalytics(eventName: string, data: any) {
    try {
      // Send to Google Analytics 4
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
          custom_parameter_1: data.value || data.count || data.percentage,
          custom_parameter_2: data.rating || data.message
        });
      }

      // Send to custom analytics endpoint
      if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
        fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: eventName,
            data,
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent
          })
        }).catch(error => {
          console.warn('[PerformanceMonitor] Failed to send analytics:', error);
        });
      }
    } catch (error) {
      console.warn('[PerformanceMonitor] Analytics error:', error);
    }
  }

  /**
   * Get current performance metrics
   */
  static getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Generate performance report
   */
  static generateReport(): string {
    const metrics = this.getMetrics();
    const report = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      connectionType: (navigator as any)?.connection?.effectiveType || 'unknown',
      ...metrics
    };

    return JSON.stringify(report, null, 2);
  }

  /**
   * Mark custom performance timing
   */
  static mark(name: string) {
    try {
      performance.mark(name);
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to mark:', name, error);
    }
  }

  /**
   * Measure custom performance timing
   */
  static measure(name: string, startMark: string, endMark?: string) {
    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }
      
      const measurement = performance.getEntriesByName(name, 'measure')[0];
      if (measurement) {
        console.log(`[PerformanceMonitor] ${name}:`, measurement.duration);
        this.sendToAnalytics(`custom_timing_${name}`, { value: measurement.duration });
      }
    } catch (error) {
      console.warn('[PerformanceMonitor] Failed to measure:', name, error);
    }
  }
}

// Auto-initialize when module is loaded
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PerformanceMonitor.initialize());
  } else {
    PerformanceMonitor.initialize();
  }
}

export default PerformanceMonitor;
