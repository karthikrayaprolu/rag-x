'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { gsap } from 'gsap';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    gsap.from('.auth-card', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Mock user_id and api_key generation
      const userId = 'usr_' + Math.random().toString(36).substring(2, 15);
      const apiKey =
        'rg_' +
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Store in localStorage (in production, use proper auth)
      localStorage.setItem('user_id', userId);
      localStorage.setItem('api_key', apiKey);
      localStorage.setItem('user_email', formData.email);

      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-24 pb-16 relative">
      {/* Background blur shapes */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      {/* Auth Card */}
      <div className="auth-card relative max-w-md w-full bg-black/60 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 text-white">
            {isLogin ? 'Welcome Back' : 'Join RAGx'}
          </h1>
          <p className="text-gray-400">
            {isLogin
              ? 'Login to access your RAG platform'
              : 'Create your custom RAG platform'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                placeholder="John Doe"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-300 mb-2 font-medium text-sm">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2 font-medium text-sm">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isLogin ? 'Login' : 'Create Account'}
                <span>→</span>
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            {isLogin ? (
              <span>
                Don't have an account?{' '}
                <span className="font-semibold underline">Register</span>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <span className="font-semibold underline">Login</span>
              </span>
            )}
          </button>
        </div>

        {!isLogin && (
          <div className="mt-6 p-4 bg-white/10 border border-white/20 rounded-2xl">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🔑</span>
              <p className="text-sm text-gray-300 leading-relaxed">
                After registration, you'll receive a unique{' '}
                <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">
                  user_id
                </code>{' '}
                and{' '}
                <code className="bg-white/10 px-2 py-1 rounded text-white font-mono text-xs">
                  api_key
                </code>{' '}
                to access your RAG platform!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}