import { onCLS, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

/**
 * Performance monitoring and real user monitoring utilities
 */

export interface PerformanceData {
  url: string;
  timestamp: number;
  metrics: {
    fcp?: number;
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
  };
  userAgent: string;
  connection?: {
    effectiveType: string;
    downlink?: number;
    rtt?: number;
  };
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
  };
}

interface PerformanceInsights {
  recommendations: string[];
  score: number;
  issues: string[];
}

interface PerformanceBudgetViolation {
  metric: string;
  value: number;
  budget: number;
  exceeded: number;
}

class PerformanceMonitor {
  private data: PerformanceData;
  private reportEndpoint: string | null = null;

  constructor() {
    this.data = {
      url: window.location.href,
      timestamp: Date.now(),
      metrics: {},
      userAgent: navigator.userAgent,
      connection: this.getConnectionInfo(),
      memory: this.getMemoryInfo()
    };

    this.initWebVitals();
    this.monitorResourceLoadTimes();
    this.monitorInteractionDelay();
  }

  private getConnectionInfo() {
    const connection = (navigator as any).connection || 
                     (navigator as any).mozConnection || 
                     (navigator as any).webkitConnection;

    if (!connection) return undefined;

    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt
    };
  }

  private getMemoryInfo() {
    const memory = (performance as any).memory;
    if (!memory) return undefined;

    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize
    };
  }

  private initWebVitals() {
    // Core Web Vitals
    onCLS((metric: Metric) => {
      this.data.metrics.cls = metric.value;
      this.reportMetric('CLS', metric.value);
    });

    // FID is deprecated, using INP instead
    this.monitorFirstInputDelay();

    onFCP((metric: Metric) => {
      this.data.metrics.fcp = metric.value;
      this.reportMetric('FCP', metric.value);
    });

    onLCP((metric: Metric) => {
      this.data.metrics.lcp = metric.value;
      this.reportMetric('LCP', metric.value);
    });

    onTTFB((metric: Metric) => {
      this.data.metrics.ttfb = metric.value;
      this.reportMetric('TTFB', metric.value);
    });
  }

  private monitorFirstInputDelay() {
    // Manual FID measurement since onFID might not be available
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            const delay = fidEntry.processingStart - fidEntry.startTime;
            this.data.metrics.fid = delay;
            this.reportMetric('FID', delay);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Browser doesn't support first-input observation
      }
    }
  }

  private monitorResourceLoadTimes() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            this.analyzeResourceTiming(resourceEntry);
          }
        }
      });

      observer.observe({ entryTypes: ['resource'] });
    }
  }

  private monitorInteractionDelay() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming;
            const delay = fidEntry.processingStart - fidEntry.startTime;
            console.log('First Input Delay:', delay);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        // Browser doesn't support first-input observation
      }
    }
  }

  private analyzeResourceTiming(entry: PerformanceResourceTiming) {
    const loadTime = entry.responseEnd - entry.requestStart;
    const resource = {
      name: entry.name,
      type: this.getResourceType(entry.name),
      loadTime,
      size: entry.transferSize,
      cached: entry.transferSize === 0 && entry.decodedBodySize > 0
    };

    // Log slow resources
    if (loadTime > 1000) { // Slower than 1 second
      console.warn('Slow resource detected:', resource);
    }

    // Log large resources
    if (entry.transferSize > 500000) { // Larger than 500KB
      console.warn('Large resource detected:', resource);
    }
  }

  private getResourceType(url: string): string {
    if (url.includes('.js')) return 'script';
    if (url.includes('.css')) return 'style';
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp|avif)$/i)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/i)) return 'font';
    return 'other';
  }

  private reportMetric(name: string, value: number) {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}: ${value}`);
    }

    // Send to analytics in production
    if (process.env.NODE_ENV === 'production' && this.reportEndpoint) {
      this.sendToAnalytics(name, value);
    }

    // Store locally for analysis
    this.storeMetricLocally(name, value);
  }

  private async sendToAnalytics(name: string, value: number) {
    try {
      await fetch('/api/analytics/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metric: name,
          value,
          url: this.data.url,
          userAgent: this.data.userAgent,
          timestamp: Date.now()
        }),
      });
    } catch (error) {
      console.error('Failed to send performance metric:', error);
    }
  }

  private storeMetricLocally(name: string, value: number) {
    try {
      const key = `perf_${name.toLowerCase()}`;
      const existingData = localStorage.getItem(key);
      const metrics = existingData ? JSON.parse(existingData) : [];
      
      metrics.push({
        value,
        timestamp: Date.now(),
        url: this.data.url
      });

      // Keep only last 100 measurements
      if (metrics.length > 100) {
        metrics.splice(0, metrics.length - 100);
      }

      localStorage.setItem(key, JSON.stringify(metrics));
    } catch (error) {
      console.error('Failed to store performance metric locally:', error);
    }
  }

  // Public methods
  public setReportEndpoint(endpoint: string) {
    this.reportEndpoint = endpoint;
  }

  public getMetrics(): PerformanceData {
    return { ...this.data };
  }

  public measureCustomMetric(name: string, startTime: number, endTime?: number) {
    const end = endTime || performance.now();
    const duration = end - startTime;
    this.reportMetric(`custom_${name}`, duration);
    return duration;
  }

  public markFeatureUsage(feature: string) {
    try {
      const key = 'feature_usage';
      const existingData = localStorage.getItem(key);
      const usage = existingData ? JSON.parse(existingData) : {};
      
      usage[feature] = (usage[feature] || 0) + 1;
      localStorage.setItem(key, JSON.stringify(usage));
    } catch (error) {
      console.error('Failed to track feature usage:', error);
    }
  }

  public getPerformanceInsights(): PerformanceInsights {
    const insights: PerformanceInsights = {
      recommendations: [],
      score: 0,
      issues: []
    };

    // Analyze LCP
    if (this.data.metrics.lcp) {
      if (this.data.metrics.lcp > 4000) {
        insights.issues.push('Poor LCP performance detected');
        insights.recommendations.push('Consider optimizing images and reducing server response times');
      } else if (this.data.metrics.lcp > 2500) {
        insights.recommendations.push('LCP could be improved');
      }
    }

    // Analyze CLS
    if (this.data.metrics.cls) {
      if (this.data.metrics.cls > 0.25) {
        insights.issues.push('High Cumulative Layout Shift detected');
        insights.recommendations.push('Reserve space for images and ads, use font-display: swap');
      }
    }

    // Analyze FID
    if (this.data.metrics.fid) {
      if (this.data.metrics.fid > 300) {
        insights.issues.push('Poor First Input Delay');
        insights.recommendations.push('Reduce JavaScript execution time and defer non-critical scripts');
      }
    }

    // Calculate performance score
    let score = 100;
    if (this.data.metrics.lcp && this.data.metrics.lcp > 2500) score -= 25;
    if (this.data.metrics.fid && this.data.metrics.fid > 100) score -= 25;
    if (this.data.metrics.cls && this.data.metrics.cls > 0.1) score -= 25;
    if (this.data.metrics.fcp && this.data.metrics.fcp > 3000) score -= 25;

    insights.score = Math.max(0, score);

    return insights;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions for measuring specific operations
export const withPerformanceTracking = <T>(
  operationName: string, 
  operation: () => Promise<T>
): Promise<T> => {
  const startTime = performance.now();
  
  return operation().finally(() => {
    const endTime = performance.now();
    performanceMonitor.measureCustomMetric(operationName, startTime, endTime);
  });
};

export const markComponentRender = (componentName: string) => {
  performance.mark(`${componentName}-render-start`);
  
  return () => {
    performance.mark(`${componentName}-render-end`);
    performance.measure(
      `${componentName}-render`, 
      `${componentName}-render-start`, 
      `${componentName}-render-end`
    );
  };
};

// Performance budget checker
export const checkPerformanceBudget = (): PerformanceBudgetViolation[] => {
  const budgets = {
    FCP: 1800, // 1.8s
    LCP: 2500, // 2.5s
    FID: 100,  // 100ms
    CLS: 0.1   // 0.1
  };

  const metrics = performanceMonitor.getMetrics().metrics;
  const violations: PerformanceBudgetViolation[] = [];

  Object.entries(budgets).forEach(([metric, budget]) => {
    const value = metrics[metric.toLowerCase() as keyof typeof metrics];
    if (value && value > budget) {
      violations.push({
        metric,
        value,
        budget,
        exceeded: value - budget
      });
    }
  });

  if (violations.length > 0) {
    console.warn('Performance budget violations:', violations);
  }

  return violations;
};
