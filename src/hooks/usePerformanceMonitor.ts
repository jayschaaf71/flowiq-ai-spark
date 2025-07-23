
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  [key: string]: number | undefined;
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
    const memoryUsage: number | undefined = 'memory' in performance 
      ? (performance as Record<string, unknown> & { memory: { usedJSHeapSize: number } }).memory.usedJSHeapSize / 1024 / 1024 
      : undefined;

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
        logPerformance({ [`${operation}Time`]: operationTime });
        return result;
      } catch (error) {
        const operationTime = performance.now() - operationStart;
        logPerformance({ [`${operation}ErrorTime`]: operationTime });
        throw error;
      }
    }
  };
};
