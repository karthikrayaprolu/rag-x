'use client';


import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiUser,
  FiLogOut,
  FiChevronDown,
  FiCpu,
  FiMessageSquare,
  FiDatabase,
  FiLock,
  FiFileText,
} from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { user, userProfile, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setProfileMenuOpen(false);
      setActiveDropdown(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const platformFeatures = [
    {
      title: "Smart Ingestion",
      desc: "Parse PDF, CSV, TXT, JSON with auto-chunking & embeddings.",
      icon: FiFileText,
      href: "/platform/ingestion"
    },
    {
      title: "Context-Aware Chat",
      desc: "Streaming AI chat with source-backed answers.",
      icon: FiMessageSquare,
      href: "/platform/chat"
    },
    {
      title: "Knowledge Base",
      desc: "Manage and search your embedded documents.",
      icon: FiDatabase,
      href: "/platform/history"
    },
    {
      title: "Enterprise Security",
      desc: "SOC2 compliant infrastructure with isolation.",
      icon: FiLock,
      href: "/platform/security"
    }
  ];

  if (pathname?.startsWith('/dashboard')) return null;

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || activeDropdown
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/5 shadow-2xl'
          : 'bg-transparent border-b border-transparent'
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-shrink-0"
            >
              <Link
                href="/"
                className="relative z-10 text-2xl font-bold tracking-tight text-white flex items-center gap-2"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">RAGx</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Platform (Mega Menu) */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('platform')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1 ${activeDropdown === 'platform' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  Platform
                  <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'platform' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Solutions */}
              <Link
                href="/solutions"
                className="px-4 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white transition-all duration-300"
              >
                Solutions
              </Link>

              {/* Enterprise */}
              <Link
                href="/enterprise"
                className="px-4 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white transition-all duration-300"
              >
                Enterprise
              </Link>

              {/* Pricing */}
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-full text-sm font-medium text-zinc-400 hover:text-white transition-all duration-300"
              >
                Pricing
              </Link>

              {/* Documentation */}
              <Link
                href="/documentation"
                className="px-4 py-2 rounded-full text-sm font-medium text-gray-400 hover:text-white transition-all duration-300"
              >
                Documentation
              </Link>
            </div>

            {/* Right Side: Auth */}
            <motion.div
              className="hidden lg:flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {user ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/10 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner overflow-hidden">
                      {userProfile?.photo_url ? (
                        <img src={userProfile.photo_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <FiUser className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-white font-medium text-sm">
                      {userProfile?.display_name || user.email?.split('@')[0] || 'User'}
                    </span>
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <motion.div
                        className="absolute right-0 mt-4 w-64 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="p-5 border-b border-white/5 bg-white/5">
                          <p className="text-white font-semibold">{userProfile?.display_name || 'User'}</p>
                          <p className="text-gray-400 text-xs mt-1 truncate">{user.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            href="/dashboard"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            <FiUser className="w-4 h-4" />
                            <span className="text-sm">Dashboard</span>
                          </Link>
                          <Link
                            href="/chat"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            <FiMessageSquare className="w-4 h-4" />
                            <span className="text-sm">Chat</span>
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => {
                              setProfileMenuOpen(false);
                              setActiveDropdown(null);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            <FiUser className="w-4 h-4" />
                            <span className="text-sm">Settings</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all"
                          >
                            <FiLogOut className="w-4 h-4" />
                            <span className="text-sm">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth"
                    className="relative group px-5 py-2.5 bg-white text-black rounded-full font-bold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
                  >
                    <span className="relative z-10">Get Started</span>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center space-y-1.5 group z-10"
              aria-label="Toggle menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.span
                className="w-6 h-0.5 bg-white rounded-full"
                animate={mobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-white rounded-full"
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-6 h-0.5 bg-white rounded-full"
                animate={mobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeDropdown === 'platform' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-20 bg-black/90 backdrop-blur-3xl border-b border-white/10 shadow-2xl py-12"
              onMouseEnter={() => setActiveDropdown('platform')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-4 gap-8">
                  <div className="col-span-1">
                    <h3 className="text-lg font-bold text-white mb-2">RAGx Platform</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      A high-performance Multi-Tenant Retrieval-Augmented Generation platform. Parse, Index, and Chat with your documents securely.
                    </p>
                    <div className="mt-6">
                      <Link href="/auth" onClick={() => setActiveDropdown(null)} className="text-sm font-semibold text-white hover:text-zinc-300 flex items-center gap-1 border-b border-white pb-0.5 w-fit">
                        Get Started <FiChevronDown className="rotate-[-90deg]" />
                      </Link>
                    </div>
                  </div>
                  <div className="col-span-3 grid grid-cols-2 gap-x-12 gap-y-8">
                    {platformFeatures.map((feature, idx) => (
                      <Link key={idx} href={feature.href} onClick={() => setActiveDropdown(null)} className="group flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                          <feature.icon className="w-6 h-6 text-white group-hover:text-zinc-300" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-zinc-300 transition-colors">
                            {feature.title}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1 leading-snug">
                            {feature.desc}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="fixed inset-0 z-40 lg:hidden bg-black/95 backdrop-blur-xl pt-24 px-6 overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col space-y-6">
                <div className="space-y-4">
                  <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest px-2">Platform</h3>
                  {platformFeatures.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setActiveDropdown(null);
                        setProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5"
                    >
                      <item.icon className="w-5 h-5 text-zinc-400" />
                      <span className="text-lg font-medium text-white">{item.title}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-white/10 my-2" />

                <Link href="/solutions" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); setProfileMenuOpen(false); }} className="text-xl font-bold text-white hover:text-gray-300">Solutions</Link>
                <Link href="/enterprise" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); setProfileMenuOpen(false); }} className="text-xl font-bold text-white hover:text-gray-300">Enterprise</Link>
                <Link href="/pricing" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); setProfileMenuOpen(false); }} className="text-xl font-bold text-white hover:text-gray-300">Pricing</Link>
                <Link href="/documentation" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); setProfileMenuOpen(false); }} className="text-xl font-bold text-white hover:text-gray-300">Documentation</Link>

                <div className="h-px bg-white/10 my-4" />

                {user ? (
                  <div className="space-y-4">
                    <Link href="/dashboard" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); setProfileMenuOpen(false); }} className="block w-full text-center py-3 bg-white/10 rounded-xl text-white font-bold">Dashboard</Link>
                    <Link href="/settings" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); setProfileMenuOpen(false); }} className="block w-full text-center py-3 bg-white/5 hover:bg-white/10 rounded-xl text-white font-medium">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-center py-3 text-red-400 font-medium">Sign Out</button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link href="/auth" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); setProfileMenuOpen(false); }} className="w-full py-4 bg-white/5 rounded-full text-center text-white font-bold">Sign In</Link>
                    <Link href="/auth" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); setProfileMenuOpen(false); }} className="w-full py-4 bg-white rounded-full text-center text-black font-bold">Get Started</Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}