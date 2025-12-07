'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiBarChart2,
  FiFileText,
  FiDatabase,
  FiUpload,
  FiMessageSquare,
  FiBookOpen,
  FiCopy,
  FiCheck,
  FiPlus,
  FiRefreshCw,
  FiActivity,
  FiServer
} from 'react-icons/fi';
import { PiBrain } from 'react-icons/pi';
import { getUploadStats, healthCheck } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardUpload from '@/components/DashboardUpload';

export default function DashboardPage() {
  const { user, loading: authLoading, userProfile } = useAuth();
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [dataSources, setDataSources] = useState<Array<{ name: string; type: string; status: string; date: string; }>>([]);
  const [stats, setStats] = useState({
    totalQueries: 0,
    totalDocuments: 0,
    totalEmbeddings: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  const fetchStats = async () => {
    if (authLoading || !user) {
      setIsLoadingStats(false);
      return;
    }

    setIsLoadingStats(true);
    try {
      const uploadStats = await getUploadStats();
      setStats(prev => ({
        ...prev,
        totalEmbeddings: uploadStats.vector_count,
        totalQueries: uploadStats.query_count || 0,
        totalDocuments: uploadStats.total_documents || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const checkBackendHealth = async () => {
    try {
      await healthCheck();
      setBackendStatus('online');
    } catch {
      setBackendStatus('offline');
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;

    const storedUserId = userProfile?.userId || localStorage.getItem('user_id') || user.uid || '';
    const storedEmail = userProfile?.email || localStorage.getItem('user_email') || user.email || '';

    setUserId(storedUserId);
    setUserEmail(storedEmail);

    checkBackendHealth();

    const timer = setTimeout(() => {
      fetchStats();
    }, 500);

    setDataSources([]);

    return () => clearTimeout(timer);
  }, [user, userProfile, authLoading]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(label);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleUploadComplete = () => {
    fetchStats();
    // In a real app, we'd also refresh the data sources list here
    // For now, we can simulate adding a new item
    const newSource = {
      name: 'New Upload',
      type: 'File',
      status: 'Processed',
      date: new Date().toLocaleDateString()
    };
    setDataSources(prev => [newSource, ...prev]);
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const apiEndpoint = `${apiBaseUrl}/chat/query`;

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-16 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {userEmail}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${backendStatus === 'online'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
              <div className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-xs font-medium">Backend: {backendStatus}</span>
            </div>
            <button
              onClick={fetchStats}
              disabled={isLoadingStats}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-gray-400 hover:text-white"
            >
              <FiRefreshCw className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                <FiBarChart2 className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-500 font-mono">TOTAL QUERIES</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalQueries}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                <FiFileText className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-500 font-mono">DOCUMENTS</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalDocuments}</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                <PiBrain className="w-6 h-6" />
              </div>
              <span className="text-xs text-gray-500 font-mono">EMBEDDINGS</span>
            </div>
            <div className="text-3xl font-bold text-white">{stats.totalEmbeddings}</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Upload & Data Sources */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upload Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiUpload className="text-gray-400" />
                Upload Data
              </h2>
              <DashboardUpload onUploadComplete={handleUploadComplete} />
            </motion.div>

            {/* Data Sources Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <FiDatabase className="text-gray-400" />
                  Recent Uploads
                </h2>
              </div>

              <div className="p-6">
                {dataSources.length > 0 ? (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs text-gray-500 border-b border-white/10">
                        <th className="pb-3 font-medium">NAME</th>
                        <th className="pb-3 font-medium">TYPE</th>
                        <th className="pb-3 font-medium">STATUS</th>
                        <th className="pb-3 font-medium">DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataSources.map((source, i) => (
                        <tr key={i} className="border-b border-white/5 last:border-0">
                          <td className="py-4 text-sm">{source.name}</td>
                          <td className="py-4 text-sm text-gray-400">{source.type}</td>
                          <td className="py-4">
                            <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20">
                              {source.status}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-400">{source.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No recent uploads found.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Quick Actions & API */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiActivity className="text-gray-400" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/chat"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group"
                >
                  <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:scale-110 transition-transform">
                    <FiMessageSquare />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Chat Interface</div>
                    <div className="text-xs text-gray-500">Test your RAG</div>
                  </div>
                </Link>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group cursor-pointer">
                  <div className="p-2 bg-orange-500/20 rounded-lg text-orange-400 group-hover:scale-110 transition-transform">
                    <FiBookOpen />
                  </div>
                  <div>
                    <div className="font-medium text-sm">Documentation</div>
                    <div className="text-xs text-gray-500">View API docs</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* API Credentials (Compact) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiServer className="text-gray-400" />
                API Access
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-500 font-mono mb-1 block">USER ID</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 px-3 py-2 rounded-lg text-xs font-mono text-gray-300 truncate">
                      {userId}
                    </code>
                    <button
                      onClick={() => copyToClipboard(userId, 'uid')}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      {copiedKey === 'uid' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-mono mb-1 block">API ENDPOINT</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 px-3 py-2 rounded-lg text-xs font-mono text-gray-300 truncate">
                      {apiEndpoint}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiEndpoint, 'url')}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
                    >
                      {copiedKey === 'url' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}