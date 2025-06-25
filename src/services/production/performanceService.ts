
export interface PerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  memoryUsage: number;
  bundleSize: number;
}

export interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  type: 'critical' | 'warning' | 'suggestion';
  category: 'loading' | 'rendering' | 'interaction' | 'memory';
  impact: 'high' | 'medium' | 'low';
  implemented: boolean;
}

export class PerformanceService {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    timeToFirstByte: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
    memoryUsage: 0,
    bundleSize: 0
  };

  private optimizationRules: OptimizationRule[] = [
    {
      id: '1',
      name: 'Enable Code Splitting',
      description: 'Split your bundle into smaller chunks to improve initial load time',
      type: 'critical',
      category: 'loading',
      impact: 'high',
      implemented: true
    },
    {
      id: '2',
      name: 'Implement Virtual Scrolling',
      description: 'Use virtual scrolling for large lists to improve rendering performance',
      type: 'warning',
      category: 'rendering',
      impact: 'medium',
      implemented: false
    },
    {
      id: '3',
      name: 'Add Service Worker Caching',
      description: 'Cache static assets and API responses for better performance',
      type: 'suggestion',
      category: 'loading',
      impact: 'high',
      implemented: false
    },
    {
      id: '4',
      name: 'Optimize Image Loading',
      description: 'Use lazy loading and WebP format for images',
      type: 'warning',
      category: 'loading',
      impact: 'medium',
      implemented: true
    },
    {
      id: '5',
      name: 'Debounce User Inputs',
      description: 'Debounce search and filter inputs to reduce API calls',
      type: 'suggestion',
      category: 'interaction',
      impact: 'medium',
      implemented: true
    }
  ];

  async measurePerformance(): Promise<PerformanceMetrics> {
    // Collect real browser performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      this.metrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
        timeToFirstByte: navigation.responseStart - navigation.requestStart,
        firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: 0, // Would need to use PerformanceObserver
        firstInputDelay: 0, // Would need to use PerformanceObserver
        cumulativeLayoutShift: 0, // Would need to use PerformanceObserver
        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0,
        bundleSize: this.estimateBundleSize()
      };
    } else {
      // Simulate metrics for server-side or testing
      this.metrics = {
        pageLoadTime: 800 + Math.random() * 400,
        timeToFirstByte: 100 + Math.random() * 100,
        firstContentfulPaint: 600 + Math.random() * 300,
        largestContentfulPaint: 1200 + Math.random() * 600,
        firstInputDelay: 50 + Math.random() * 50,
        cumulativeLayoutShift: Math.random() * 0.1,
        memoryUsage: 20000000 + Math.random() * 10000000,
        bundleSize: 500000 + Math.random() * 200000
      };
    }

    await this.logPerformanceMetrics();
    await this.analyzePerformance();
    
    return this.metrics;
  }

  private estimateBundleSize(): number {
    // Rough estimation based on script tags
    if (typeof document !== 'undefined') {
      const scripts = document.querySelectorAll('script[src]');
      return scripts.length * 100000; // Rough estimate
    }
    return 500000; // Default estimate
  }

  private async logPerformanceMetrics(): Promise<void> {
    const { logAuditAction } = await import("@/hooks/useAuditLog");
    await logAuditAction(
      'performance_metrics',
      'performance',
      'METRICS_COLLECTED',
      null,
      {
        ...this.metrics,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'server'
      }
    );
  }

  private async analyzePerformance(): Promise<void> {
    const issues: string[] = [];

    if (this.metrics.pageLoadTime > 3000) {
      issues.push('Page load time exceeds 3 seconds');
    }

    if (this.metrics.firstContentfulPaint > 2000) {
      issues.push('First Contentful Paint is slow');
    }

    if (this.metrics.largestContentfulPaint > 2500) {
      issues.push('Largest Contentful Paint needs improvement');
    }

    if (this.metrics.cumulativeLayoutShift > 0.1) {
      issues.push('Layout shift detected');
    }

    if (this.metrics.memoryUsage > 50000000) {
      issues.push('High memory usage detected');
    }

    if (issues.length > 0) {
      const { logAuditAction } = await import("@/hooks/useAuditLog");
      await logAuditAction(
        'performance_issues',
        'analyzer',
        'PERFORMANCE_ISSUES_DETECTED',
        null,
        {
          issues,
          metrics: this.metrics,
          timestamp: new Date().toISOString()
        }
      );
    }
  }

  getPerformanceScore(): number {
    // Calculate a performance score based on Core Web Vitals
    let score = 100;

    // Page Load Time (weight: 25%)
    if (this.metrics.pageLoadTime > 3000) score -= 25;
    else if (this.metrics.pageLoadTime > 2000) score -= 15;
    else if (this.metrics.pageLoadTime > 1000) score -= 5;

    // First Contentful Paint (weight: 25%)
    if (this.metrics.firstContentfulPaint > 2000) score -= 25;
    else if (this.metrics.firstContentfulPaint > 1500) score -= 15;
    else if (this.metrics.firstContentfulPaint > 1000) score -= 5;

    // Largest Contentful Paint (weight: 25%)
    if (this.metrics.largestContentfulPaint > 2500) score -= 25;
    else if (this.metrics.largestContentfulPaint > 2000) score -= 15;
    else if (this.metrics.largestContentfulPaint > 1500) score -= 5;

    // Cumulative Layout Shift (weight: 25%)
    if (this.metrics.cumulativeLayoutShift > 0.25) score -= 25;
    else if (this.metrics.cumulativeLayoutShift > 0.1) score -= 15;
    else if (this.metrics.cumulativeLayoutShift > 0.05) score -= 5;

    return Math.max(0, Math.round(score));
  }

  getOptimizationRecommendations(): OptimizationRule[] {
    return this.optimizationRules.filter(rule => !rule.implemented);
  }

  async implementOptimization(ruleId: string): Promise<void> {
    const rule = this.optimizationRules.find(r => r.id === ruleId);
    if (rule) {
      rule.implemented = true;
      
      const { logAuditAction } = await import("@/hooks/useAuditLog");
      await logAuditAction(
        'performance_optimizations',
        ruleId,
        'OPTIMIZATION_IMPLEMENTED',
        null,
        {
          ruleId,
          ruleName: rule.name,
          implementedAt: new Date().toISOString()
        }
      );
    }
  }

  getAllOptimizationRules(): OptimizationRule[] {
    return this.optimizationRules;
  }

  getMetrics(): PerformanceMetrics {
    return this.metrics;
  }

  // Optimization utilities
  async preloadCriticalResources(): Promise<void> {
    if (typeof document !== 'undefined') {
      // Preload critical fonts
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = '/fonts/inter.woff2';
      fontLink.as = 'font';
      fontLink.type = 'font/woff2';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);

      // Preload critical images
      const imageLink = document.createElement('link');
      imageLink.rel = 'preload';
      imageLink.href = '/images/hero.webp';
      imageLink.as = 'image';
      document.head.appendChild(imageLink);
    }
  }

  async enableResourceHints(): Promise<void> {
    if (typeof document !== 'undefined') {
      // DNS prefetch for external domains
      const dnsLink = document.createElement('link');
      dnsLink.rel = 'dns-prefetch';
      dnsLink.href = '//fonts.googleapis.com';
      document.head.appendChild(dnsLink);

      // Preconnect to critical third parties
      const preconnectLink = document.createElement('link');
      preconnectLink.rel = 'preconnect';
      preconnectLink.href = 'https://api.openai.com';
      document.head.appendChild(preconnectLink);
    }
  }

  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
}

export const performanceService = new PerformanceService();
