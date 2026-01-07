'use client';

import { useEffect, useRef, useState } from 'react';

export default function SplineScene() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        let isMounted = true;

        // 1. Check if script is already loaded
        // Using a slightly older, stable version to avoid potential regressions
        const scriptSrc = 'https://unpkg.com/@splinetool/viewer@1.9.0/build/spline-viewer.js';
        let script = document.querySelector(`script[src="${scriptSrc}"]`) as HTMLScriptElement;

        if (!script) {
            script = document.createElement('script');
            script.type = 'module';
            script.src = scriptSrc;
            document.head.appendChild(script);
        }

        // 2. Wait for script to load (if not already) then show viewer
        const handleLoad = () => {
            if (isMounted) setIsLoaded(true);
        };

        // If already loaded (e.g. navigating back), set loaded immediately
        if (customElements.get('spline-viewer')) {
            setIsLoaded(true);
        } else {
            script.addEventListener('load', handleLoad);
        }

        return () => {
            isMounted = false;
            script.removeEventListener('load', handleLoad);
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="w-full h-[400px] lg:h-[500px] relative flex items-center justify-center overflow-hidden"
            style={{ position: 'relative', minHeight: '400px' }}
        >
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-xl animate-pulse z-10">
                    <span className="text-gray-500 font-medium">Loading 3D Scene...</span>
                </div>
            )}

            <div 
                className={`w-full h-full transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={{ position: 'relative', width: '100%', height: '100%' }}
            >
                {isLoaded && (
                    /* @ts-ignore - spline-viewer is a custom element */
                    <spline-viewer
                        url="https://prod.spline.design/0LsgVd1AfB9ZbPti/scene.splinecode"
                        style={{ width: '100%', height: '100%', display: 'block' }}
                    />
                )}
            </div>
        </div>
    );
}
