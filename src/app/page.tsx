'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ParallaxElement from '@/components/ParallaxElement';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { useState, useEffect } from 'react';
import { getUploadStats } from '@/lib/api';

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
  const [totalQueries, setTotalQueries] = useState<number | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Fetch stats when user is logged in
  useEffect(() => {
    if (user && !loading) {
      const fetchStats = async () => {
        try {
          setStatsLoading(true);
          const stats = await getUploadStats();
          setTotalQueries(stats.query_count);
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        } finally {
          setStatsLoading(false);
        }
      };

      fetchStats();
      
      // Refresh every 5 seconds for real-time updates
      const interval = setInterval(fetchStats, 5000);
      return () => clearInterval(interval);
    } else {
      setTotalQueries(null);
    }
  }, [user, loading]);

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

            {/* Real-time Query Counter */}
            {user && totalQueries !== null && (
              <ParallaxElement offset={70}>
                <motion.div
                  className="mb-8 flex justify-center lg:justify-start"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500"></div>
                    
                    {/* Counter card */}
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4 flex items-center gap-4">
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-gray-400 font-medium">Total Queries</span>
                        <div className="flex items-baseline gap-2">
                          <motion.span
                            key={totalQueries}
                            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {totalQueries.toLocaleString()}
                          </motion.span>
                          {!statsLoading && (
                            <motion.div
                              className="w-2 h-2 rounded-full bg-green-400"
                              animate={{ opacity: [1, 0.5, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                        </div>
                      </div>
                      
                      {statsLoading && (
                        <div className="ml-2">
                          <motion.div
                            className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </ParallaxElement>
            )}

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
                      <button className="group relative px-8 py-3 bg-white text-black font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] active:scale-95">
                        <span className="relative z-10">Go to Dashboard</span>
                      </button>
                    </Link>
                    <Link href="/chat">
                      <button className="group relative px-8 py-3 bg-white text-black font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] active:scale-95">
                        <span className="relative z-10">Start Chatting</span>
                      </button>
                    </Link>
                  </>
                ) : (
                  // User is not logged in - show auth buttons
                  <>
                    <Link href="/auth">
                      <button className="group relative px-8 py-3 bg-white text-black font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] active:scale-95">
                        <span className="relative z-10">Get Started</span>
                      </button>
                    </Link>
                    <Link href="/auth">
                      <button className="group relative px-8 py-3 bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105 active:scale-95">
                        <span className="relative z-10">Login</span>
                      </button>
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
