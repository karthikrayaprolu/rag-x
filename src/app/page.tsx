'use client';

import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ParallaxElement from '@/components/ParallaxElement';

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
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4" data-scroll-section>
        {/* Hero Section with 3D Robot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-0 min-h-[100vh]">
          {/* Left side - Text Content */}
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
                className="text-5xl lg:text-7xl font-bold mb-6"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Welcome to <span className="gradient-accent">RAGx</span>
              </motion.h1>
            </ParallaxElement>

            <ParallaxElement offset={60}>
              <motion.p
                className="text-xl text-gray-400 mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Your Custom RAG Platform. Upload documents, connect databases,
                and get AI-powered answers with your own API endpoint.
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
                    <Link
                      href="/dashboard"
                      className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-gray-200 transform hover:scale-105 text-center shadow-lg hover:shadow-xl"
                    >
                      Go to Dashboard
                    </Link>
                    <Link
                      href="/chat"
                      className="glass border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-white/10 transform hover:scale-105 text-center"
                    >
                      Start Chatting
                    </Link>
                  </>
                ) : (
                  // User is not logged in - show auth buttons
                  <>
                    <Link
                      href="/auth"
                      className="bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-gray-200 transform hover:scale-105 text-center shadow-lg hover:shadow-xl"
                    >
                      Get Started
                    </Link>
                    <Link
                      href="/auth"
                      className="glass border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-white/10 transform hover:scale-105 text-center"
                    >
                      Login
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
