'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
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
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/chat', label: 'Chat' },
  ];

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'bg-black/60 backdrop-blur-md border-b border-white/5 shadow-lg'
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
            >
              <Link
                href="/"
                className="relative z-10 text-2xl font-bold tracking-tight text-white"
              >
                RAGx
              </Link>
            </motion.div>

            {/* Desktop Navigation - Hidden if not logged in */}
            <div className="hidden lg:flex items-center space-x-2">
              {user && navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.08 }}
                >
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === link.href
                        ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Button / User Profile */}
            <motion.div
              className="hidden lg:flex items-center"
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
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                      <FiUser className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white font-medium text-sm">
                      {userProfile?.name || user.email?.split('@')[0] || 'User'}
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
                          <p className="text-white font-semibold">{userProfile?.name || 'User'}</p>
                          <p className="text-gray-400 text-xs mt-1 truncate">{user.email}</p>
                        </div>
                        <div className="p-2 space-y-1">
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                          >
                            <FiUser className="w-4 h-4" />
                            <span className="text-sm">Dashboard</span>
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
                <Link
                  href="/auth"
                  className="relative group px-6 py-2.5 bg-white text-black rounded-full font-semibold text-sm transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95"
                >
                  <span className="relative z-10">Get Started</span>
                </Link>
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
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative h-full flex flex-col items-center justify-center space-y-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {user && navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-3xl font-bold tracking-tight transition-all duration-300 ${pathname === link.href
                        ? 'text-white'
                        : 'text-gray-500 hover:text-white'
                      }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {user ? (
                  <div className="flex flex-col items-center gap-6 mt-8">
                    <div className="flex items-center gap-3 px-6 py-3 bg-white/5 rounded-full border border-white/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-semibold">{userProfile?.name || 'User'}</p>
                        <p className="text-gray-400 text-xs">{user.email?.split('@')[0]}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors font-medium"
                    >
                      <FiLogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all"
                  >
                    Get Started
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}