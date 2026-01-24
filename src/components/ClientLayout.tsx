'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import PageTransition from '@/components/PageTransition';

const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), {
  ssr: false,
});

const ParallaxBackground = dynamic(() => import('@/components/ParallaxBackground'), {
  ssr: false,
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <ParallaxBackground />
      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
    </SmoothScroll>
  );
}
