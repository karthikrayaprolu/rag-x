'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export default function SplineRobot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Use Intersection Observer for lazy loading
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Load Spline viewer only when visible
  useEffect(() => {
    if (!isVisible || isLoaded) return;

    const container = containerRef.current;
    if (!container) return;

    // Check if container has valid dimensions
    const rect = container.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) {
      // Wait for proper dimensions
      const resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry.contentRect.width > 10 && entry.contentRect.height > 10) {
          resizeObserver.disconnect();
          loadSplineViewer();
        }
      });
      resizeObserver.observe(container);
      return () => resizeObserver.disconnect();
    }

    loadSplineViewer();

    function loadSplineViewer() {
      // Check if script already exists
      let script = document.querySelector(
        'script[src*="spline-viewer"]'
      ) as HTMLScriptElement;

      const initViewer = () => {
        try {
          if (container && !viewerRef.current) {
            const viewer = document.createElement('spline-viewer') as HTMLElement;
            viewer.setAttribute(
              'url',
              'https://prod.spline.design/0LsgVd1AfB9ZbPti/scene.splinecode'
            );
            viewer.style.width = '100%';
            viewer.style.height = '100%';
            container.appendChild(viewer);
            viewerRef.current = viewer;
            setIsLoaded(true);
          }
        } catch (e) {
          console.error('Spline viewer error:', e);
          setHasError(true);
        }
      };

      if (script) {
        // Script already loaded
        initViewer();
      } else {
        script = document.createElement('script');
        script.type = 'module';
        script.src =
          'https://unpkg.com/@splinetool/viewer@1.11.6/build/spline-viewer.js';
        script.onload = initViewer;
        script.onerror = () => setHasError(true);
        document.head.appendChild(script);
      }
    }

    // Cleanup
    return () => {
      if (viewerRef.current && container?.contains(viewerRef.current)) {
        container.removeChild(viewerRef.current);
        viewerRef.current = null;
      }
    };
  }, [isVisible, isLoaded]);

  if (hasError) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[400px] md:h-[500px] rounded-lg bg-gray-900/50 text-gray-400 border border-white/10">
        <span className="text-lg font-semibold mb-2">3D Viewer unavailable</span>
        <span className="text-sm">Please refresh the page to try again.</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[400px] md:h-[500px] lg:h-[550px] rounded-lg overflow-hidden"
      style={{ minWidth: '200px', minHeight: '300px' }}
    >
      {!isLoaded && isVisible && (
        <div className="flex items-center justify-center w-full h-full bg-gray-900/30">
          <div className="animate-pulse text-gray-500">Loading 3D viewer...</div>
        </div>
      )}
    </div>
  );
}
