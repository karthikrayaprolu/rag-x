'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ParallaxElement from '@/components/ParallaxElement';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient';

// Dynamically import SplineScene to prevent SSR issues
const SplineScene = dynamic(() => import('@/components/SplineScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-gray-900/30 rounded-lg">
      <div className="animate-pulse text-gray-500">Loading 3D viewer...</div>
    </div>
  ),
});

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white relative w-full overflow-hidden">

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <StarsBackground
          starDensity={0.00015}
          allStarsTwinkle={true}
          twinkleProbability={0.7}
          minTwinkleSpeed={0.5}
          maxTwinkleSpeed={1.0}
        />
        <ShootingStars
          minSpeed={10}
          maxSpeed={30}
          minDelay={1200}
          maxDelay={4200}
          starColor="#9E00FF"
          trailColor="#2EB9DF"
          starWidth={10}
          starHeight={1}
        />
      </div>

      <main className="container mx-auto px-4 relative z-10" data-scroll-section>
        {/* Hero Section with 3D Robot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-0 min-h-[100vh]">
          {/* Left side - Text Content */}
          <div className="text-center lg:text-left ml-0 lg:ml-8">
            <ParallaxElement offset={20}>
              <motion.div
                className="flex justify-center lg:justify-start mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0 }}
              >
                <Image
                  src="/logo.svg"
                  alt="RAGx Logo"
                  width={100}
                  height={100}
                  priority
                  className="opacity-90"
                />
              </motion.div>
            </ParallaxElement>

            <ParallaxElement offset={40}>
              <motion.h1
                className="text-3xl lg:text-6xl font-bold mb-6 tracking-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="gradient-accent">Welcome to RAGx</span>
              </motion.h1>
            </ParallaxElement>

            <ParallaxElement offset={60}>
              <motion.p
                className="text-xl text-gray-400 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Upload documents. Connect databases. Deploy your knowledge API.
              </motion.p>
            </ParallaxElement>

            <ParallaxElement offset={80}>
              <motion.div
                className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {loading ? (
                  // Show loading state
                  <div className="px-8 py-4 text-gray-400">Loading...</div>
                ) : user ? (
                  // User is logged in - show dashboard button
                  <>
                    <Link href="/dashboard">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="div"
                        className="bg-neutral-900 text-white flex items-center space-x-2 px-8 py-3 text-lg"
                      >
                        <span>Go to Dashboard</span>
                      </HoverBorderGradient>
                    </Link>
                    <Link href="/chat">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="div"
                        className="bg-neutral-900 text-white flex items-center space-x-2 px-8 py-3 text-lg"
                      >
                        <span>Start Chatting</span>
                      </HoverBorderGradient>
                    </Link>
                  </>
                ) : (
                  // User is not logged in - show auth buttons
                  <>
                    <Link href="/auth">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="div"
                        className="bg-neutral-900 text-white flex items-center space-x-2 px-8 py-3 text-lg"
                      >
                        <span>Get Started</span>
                      </HoverBorderGradient>
                    </Link>
                    <Link href="/auth">
                      <HoverBorderGradient
                        containerClassName="rounded-full"
                        as="div"
                        className="bg-neutral-900 text-white flex items-center space-x-2 px-8 py-3 text-lg"
                      >
                        <span>Login</span>
                      </HoverBorderGradient>
                    </Link>
                  </>
                )}
              </motion.div>
            </ParallaxElement>
          </div>

          {/* Right side - Spline Scene */}
          <ParallaxElement offset={-50} className="flex justify-center items-center w-full h-full">
            <motion.div
              className="flex justify-center items-center w-full h-full"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.4 }}
            >
              <div className="relative w-full h-full min-h-[500px] flex justify-center items-center">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl rounded-full -z-10"></div>
                <SplineScene />
              </div>
            </motion.div>
          </ParallaxElement>
        </div>
      </main>
    </div>
  );
}
