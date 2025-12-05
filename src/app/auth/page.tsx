'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { FcGoogle } from 'react-icons/fc';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login, signup, loginWithGoogle, user } = useAuth();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.email, formData.password, formData.name);
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      await loginWithGoogle();
      // Redirect to dashboard after successful Google login
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
      {/* Background blur shapes */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Auth Card */}
      <motion.div
        className="relative max-w-md w-full bg-black/60 backdrop-blur-xl rounded-3xl p-10 border border-white/20 shadow-2xl z-10"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.h1
                className="text-4xl font-bold mb-2 text-white"
                layout
              >
                {isLogin ? 'Welcome Back' : 'Join RAGx'}
              </motion.h1>
              <motion.p
                className="text-gray-400"
                layout
              >
                {isLogin
                  ? 'Login to access your RAG platform'
                  : 'Create your custom RAG platform'}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>

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

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-full font-bold text-lg hover:bg-gray-200 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  className="inline-block w-5 h-5 border-2 border-black/20 border-t-black rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                {isLogin ? 'Login' : 'Create Account'}
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
            )}
          </motion.button>
        </form>

        {/* Divider */}
        <div className="mt-6 mb-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10"></div>
          <span className="text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/10"></div>
        </div>

        {/* Google Sign In */}
        <motion.button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white py-4 rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <FcGoogle className="w-6 h-6" />
          <span>Continue with Google</span>
        </motion.button>

        <div className="mt-8 text-center">
          <motion.button
            onClick={() => {
              setIsLogin(!isLogin);
              setFormData({ email: '', password: '', name: '' });
              setError('');
            }}
            className="text-gray-400 hover:text-white transition-colors text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isLogin ? 'switch-to-register' : 'switch-to-login'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
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
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {!isLogin && (
            <motion.div
              className="mt-6 p-4 bg-white/10 border border-white/20 rounded-2xl overflow-hidden"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 24 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-start gap-3">
                <motion.span
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  🔑
                </motion.span>
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}