// src/hooks/usePerformanceMonitor.js
import { useEffect, useRef } from 'react';

/**
 * Hook to monitor component performance
 * Use in development to identify bottlenecks
 */
export const usePerformanceMonitor = (componentName, enabled = false) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    if (!enabled) return;

    renderCount.current++;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    console.log(`[Performance] ${componentName}:`, {
      renderCount: renderCount.current,
      timeSinceLastRender: `${timeSinceLastRender}ms`,
      timestamp: new Date().toISOString()
    });

    // Warn if re-rendering too frequently
    if (timeSinceLastRender < 16 && renderCount.current > 5) {
      console.warn(`⚠️ ${componentName} rendering too frequently! Consider optimization.`);
    }
  });
};

// Usage example in PronunciationCard:
// usePerformanceMonitor('PronunciationCard', process.env.NODE_ENV === 'development');
