import React, { useEffect } from 'react';

const PerformanceMonitor = ({ onPerformanceIssue }) => {
  useEffect(() => {
    let frames = 0;
    let lastTime = performance.now();
    let rafId;

    const checkPerformance = () => {
      const now = performance.now();
      const delta = now - lastTime;
      
      if (delta >= 1000) {
        const fps = (frames * 1000) / delta;
        if (fps < 24) {
          onPerformanceIssue(fps);
        }
        frames = 0;
        lastTime = now;
      }
      frames++;
      rafId = requestAnimationFrame(checkPerformance);
    };

    checkPerformance();
    return () => cancelAnimationFrame(rafId);
  }, [onPerformanceIssue]);

  return null;
};

export default PerformanceMonitor; 