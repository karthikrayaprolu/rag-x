'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { FiLayers, FiShield, FiDatabase, FiZap, FiCpu, FiGlobe } from 'react-icons/fi'; // Added icons
import { useAuth } from '@/contexts/AuthContext';
import ParallaxElement from '@/components/ParallaxElement';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { StarsBackground } from '@/components/ui/stars-background';
import { CardSpotlight } from '@/components/ui/card-spotlight'; // Added CardSpotlight
import { Cover } from '@/components/ui/cover'; // Added Cover component
import Footer from '@/components/Footer';
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
          starColor="#FFFFFF"
          trailColor="#52525b"
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
                className="text-4xl lg:text-7xl font-bold mb-6 tracking-tight leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="block text-white">Build Intelligent</span>
                <span className="text-gray-400">
                  <Cover>RAG Applications</Cover>
                </span>
              </motion.h1>
            </ParallaxElement>

            <ParallaxElement offset={60}>
              <motion.p
                className="text-xl text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0 font-light"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                The complete platform for parsing, embedding, and retrieving knowledge.
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
                      <button className="group relative px-8 py-3 bg-white text-black font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-200 active:scale-95">
                        <span className="relative z-10">Go to Dashboard</span>
                      </button>
                    </Link>
                    <Link href="/chat">
                      <button className="group relative px-8 py-3 bg-zinc-900 text-white border border-white/10 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-zinc-800 active:scale-95">
                        <span className="relative z-10">Start Chatting</span>
                      </button>
                    </Link>
                  </>
                ) : (
                  // User is not logged in - show auth buttons
                  <>
                    <Link href="/auth">
                      <button className="group relative px-8 py-3 bg-white text-black font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-gray-200 active:scale-95">
                        <span className="relative z-10">Get Started</span>
                      </button>
                    </Link>
                    <Link href="/auth">
                      <button className="group relative px-8 py-3 bg-zinc-900 text-white border border-white/10 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:bg-zinc-800 active:scale-95">
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
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full -z-10"></div>
                <SplineScene />
              </div>
            </motion.div>
          </ParallaxElement>
        </div>


        {/* Features Section - Bento Grid */}
        <div className="py-24 relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              Everything you need to build <br /> world-class AI apps.
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From raw data to real-time answers, RAGx handles the entire pipeline so you can focus on building the future.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">

            {/* Feature 1: Ingestion (Large) */}
            <CardSpotlight className="md:col-span-2 rounded-3xl p-8 bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  <FiLayers className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Universal Ingestion</h3>
                <p className="text-gray-400 max-w-md">
                  Drag and drop PDFs, CSVs, or JSON files. We automatically parse, chunk, and embed your data using state-of-the-art models.
                </p>
              </div>

              {/* Visual Decorative */}
              <div className="absolute top-1/2 right-10 -translate-y-1/2 flex flex-col gap-3 opacity-30 group-hover:opacity-60 transition-opacity">
                <div className="w-24 h-8 bg-zinc-900 border border-white/20 rounded flex items-center justify-center text-[10px] text-gray-400">parsing...</div>
                <div className="w-24 h-8 bg-zinc-900 border border-white/20 rounded flex items-center justify-center text-[10px] text-gray-400">chunking...</div>
                <div className="w-24 h-8 bg-zinc-900 border border-white/20 rounded flex items-center justify-center text-[10px] text-gray-400">embedding...</div>
              </div>
            </CardSpotlight>

            {/* Feature 2: Speed */}
            <CardSpotlight className="rounded-3xl p-8 bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  <FiZap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Real-time</h3>
                <p className="text-gray-400">
                  Streaming responses with sub-50ms latency. No loading spinners.
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
            </CardSpotlight>

            {/* Feature 3: Security */}
            <CardSpotlight className="rounded-3xl p-8 bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  <FiShield className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Enterprise Secure</h3>
                <p className="text-gray-400">
                  Data isolation by default. Your knowledge base is yours alone and never used for training.
                </p>
              </div>
            </CardSpotlight>

            {/* Feature 4: Memory (Large) */}
            <CardSpotlight className="md:col-span-2 rounded-3xl p-8 bg-white/5 border border-white/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-300">
                  <FiDatabase className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Persistent Memory</h3>
                <p className="text-gray-400 max-w-md">
                  RAGx remembers context across sessions. Resume conversations days later without losing a beat.
                </p>
              </div>
              {/* Visual Decorative: Data/Memory Records */}
              <div className="absolute top-1/2 right-12 -translate-y-1/2 flex flex-col gap-4 opacity-40 group-hover:opacity-70 transition-opacity pointer-events-none font-mono text-xs">
                <div className="w-56 p-3 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-between shadow-lg transform translate-x-6 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiDatabase className="w-3 h-3" />
                    <span>session_store_v1</span>
                  </div>
                  <div className="text-white/40">24MB</div>
                </div>
                <div className="w-56 p-3 bg-zinc-800 border border-white/20 rounded-lg flex items-center justify-between shadow-xl backdrop-blur-md z-10">
                  <div className="flex items-center gap-2 text-white">
                    <FiDatabase className="w-3 h-3 text-white" />
                    <span>user_context_graph</span>
                  </div>
                  <div className="text-green-400/80">Active</div>
                </div>
                <div className="w-56 p-3 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-between shadow-lg transform translate-x-3 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-gray-400">
                    <FiDatabase className="w-3 h-3" />
                    <span>search_history_idx</span>
                  </div>
                  <div className="text-white/40">Synced</div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
            </CardSpotlight>

          </div>
        </div>

        {/* Footer */}
        <Footer />
      </main >
    </div >
  );
}
