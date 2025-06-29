
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = performance.now();

  const logPerformance = useCallback((metrics: Partial<PerformanceMetrics>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance [${componentName}]:`, metrics);
    }
    
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Send to analytics service
      console.log('Performance metrics:', { componentName, ...metrics });
    }
  }, [componentName]);

  useEffect(() => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    logPerformance({ loadTime });

    // Monitor memory usage if available
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      logPerformance({
        loadTime,
        memoryUsage: memoryInfo.usedJSHeapSize / 1024 / 1024 // MB
      });
    }

    return () => {
      const cleanupTime = performance.now();
      logPerformance({
        renderTime: cleanupTime - endTime
      });
    };
  }, [startTime, logPerformance]);

  return { logPerformance };
};
