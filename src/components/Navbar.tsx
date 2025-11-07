'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Simplified animations without hiding elements
    gsap.from('.nav-logo', {
      x: -20,
      duration: 0.6,
      ease: 'power3.out',
    });

    gsap.from('.nav-link', {
      y: -10,
      duration: 0.4,
      stagger: 0.08,
      ease: 'power2.out',
      delay: 0.2,
    });
  }, []);

  // Removed icon property
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/upload', label: 'Upload' },
    { href: '/chat', label: 'Chat' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-black/40 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl'
            : 'bg-black/20 backdrop-blur-md border-b border-gray-800/30'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          {/* Height increased back to h-20 for more vertical space */}
          <div className="flex items-center justify-between h-20">
            {/* Logo: Simplified to just text */}
            <Link
              href="/"
              className="nav-logo relative z-10 text-2xl font-semibold text-white"
            >
              RAGx
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  // Padding increased to py-3
                  className={`nav-link relative group px-4 py-3 rounded-full text-sm font-medium transition-colors duration-300 ${
                    pathname === link.href
                      ? 'bg-white/20 text-white' // Active
                      : 'text-gray-300 hover:text-white hover:bg-white/10' // Inactive
                  }`}
                >
                  {/* Icon span removed */}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center">
              <Link
                href="/auth"
                // Padding increased to py-3, arrow icon removed
                className="nav-link relative group px-6 py-3 mt-4 bg-white text-black rounded-full font-bold text-sm overflow-hidden transition-all"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative w-10 h-10 flex flex-col items-center justify-center space-y-1.5 group z-10"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : ''
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              ></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
        <div
          className={`relative h-full flex flex-col items-center justify-center space-y-8 transition-all duration-500 ${
            mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-3xl font-bold transition-all duration-300 ${
                pathname === link.href
                  ? 'text-white scale-110'
                  : 'text-gray-400 hover:text-white hover:scale-105'
              }`}
              style={{
                transitionDelay: mobileMenuOpen ? `${index * 100}ms` : '0ms',
              }}
            >
              {/* Icon span removed */}
              <span>{link.label}</span>
            </Link>
          ))}
          {/* Mobile CTA: Arrow removed */}
          <Link
            href="/auth"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-200 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>
    </>
  );
}