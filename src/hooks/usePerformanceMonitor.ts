
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const startTime = performance.now();

  const logPerformance = useCallback((metrics: Partial<PerformanceMetrics>) => {
    // Only log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance [${componentName}]:`, metrics);
    }
    
    // In production, send to analytics service (placeholder for future implementation)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Implement analytics service integration
      // sendToAnalytics({ componentName, ...metrics });
    }
  }, [componentName]);

  useEffect(() => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;

    // Monitor memory usage if available
    let memoryUsage: number | undefined;
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      memoryUsage = memoryInfo.usedJSHeapSize / 1024 / 1024; // MB
    }

    logPerformance({ loadTime, memoryUsage });

    return () => {
      const cleanupTime = performance.now();
      const renderTime = cleanupTime - endTime;
      
      // Only log if render time is significant (> 16ms for 60fps)
      if (renderTime > 16) {
        logPerformance({ renderTime });
      }
    };
  }, [startTime, logPerformance]);

  return { 
    logPerformance,
    measureAsync: async <T>(operation: string, fn: () => Promise<T>): Promise<T> => {
      const operationStart = performance.now();
      try {
        const result = await fn();
        const operationTime = performance.now() - operationStart;
        logPerformance({ [`${operation}Time`]: operationTime } as any);
        return result;
      } catch (error) {
        const operationTime = performance.now() - operationStart;
        logPerformance({ [`${operation}ErrorTime`]: operationTime } as any);
        throw error;
      }
    }
  };
};
