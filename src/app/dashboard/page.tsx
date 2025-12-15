'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiBarChart2,
  FiFileText,
  FiDatabase,
  FiUpload,
  FiMessageSquare,
  FiBookOpen,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiActivity,
  FiServer,
  FiX
} from 'react-icons/fi';
import { PiBrain } from 'react-icons/pi';
import { getUploadStats, healthCheck, testApiConnection, getApiBaseUrl, getApiKey, generateApiKey, getUserProfile } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardUpload from '@/components/DashboardUpload';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import ApiTestPanel from '@/components/ApiTestPanel';
import Swal from 'sweetalert2';

export default function DashboardPage() {
  const { user, loading: authLoading, userProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userId, setUserId] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPlan, setUserPlan] = useState('free');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [dataSources, setDataSources] = useState<Array<{ name: string; type: string; status: string; date: string; }>>([]);
  const [stats, setStats] = useState({
    totalQueries: 0,
    totalDocuments: 0,
    totalEmbeddings: 0,
  });
  const [apiKey, setApiKey] = useState('Loading...');
  const [isRegeneratingKey, setIsRegeneratingKey] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  // Check for success parameter from Stripe redirect
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      setShowSuccessBanner(true);
      // Show success alert
      Swal.fire({
        title: 'Payment Successful!',
        text: 'Your subscription is now active. Welcome to the Pro plan!',
        icon: 'success',
        confirmButtonText: 'Get Started',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#3b82f6',
      });
      
      // Remove success param from URL
      window.history.replaceState({}, '', '/dashboard');
      
      // Fetch updated user profile
      fetchUserProfile();
    }
  }, [searchParams]);

  const fetchUserProfile = async () => {
    if (authLoading || !user) return;
    try {
      const profile = await getUserProfile();
      setUserPlan(profile.plan || 'free');
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  };

  const fetchStats = async () => {
    if (authLoading || !user) {
      setIsLoadingStats(false);
      return;
    }

    setIsLoadingStats(true);
    try {
      console.log('📊 Fetching upload stats...');
      const uploadStats = await getUploadStats();
      console.log('✅ Stats fetched successfully:', uploadStats);

      setStats(prev => ({
        ...prev,
        totalEmbeddings: uploadStats.vector_count,
        totalQueries: uploadStats.query_count || 0,
        totalDocuments: uploadStats.total_documents || 0,
      }));
    } catch (error: any) {
      console.error('❌ Failed to fetch stats:', error);
      // Don't show error to user, just keep previous stats
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchApiKey = async () => {
    if (authLoading || !user) return;
    try {
      const key = await getApiKey();
      setApiKey(key);
    } catch (error) {
      console.error('Failed to fetch API key:', error);
      setApiKey('Error loading key');
    }
  };

  const handleRegenerateKey = async () => {
    if (!confirm('Are you sure? This will invalidate your old API key.')) return;
    setIsRegeneratingKey(true);
    try {
      const key = await generateApiKey();
      setApiKey(key);
    } catch (error) {
      console.error('Failed to regenerate key:', error);
    } finally {
      setIsRegeneratingKey(false);
    }
  };

  const checkBackendHealth = async () => {
    setBackendStatus('checking');
    try {
      console.log('🏥 Checking backend health...');
      await healthCheck();
      console.log('✅ Backend is online');
      setBackendStatus('online');
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
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
    fetchUserProfile();

    const timer = setTimeout(() => {
      fetchStats();
      fetchApiKey();
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

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCheck className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-green-400 font-medium">Payment Successful!</p>
                <p className="text-sm text-gray-400">Your subscription is now active</p>
              </div>
            </div>
            <button onClick={() => setShowSuccessBanner(false)} className="text-gray-400 hover:text-white">
              <FiX className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {userEmail}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                userPlan === 'pro' ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' :
                userPlan === 'business' ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400' :
                'bg-gray-500/10 border border-gray-500/20 text-gray-400'
              }`}>
                {userPlan.toUpperCase()} PLAN
              </span>
            </div>
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

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">

          {/* 1. Total Queries */}
          <div className="col-span-12 md:col-span-4 relative h-full rounded-3xl border border-white/10 p-2.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                  <FiBarChart2 className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-500 font-mono">TOTAL QUERIES</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalQueries}</div>
            </div>
          </div>

          {/* 2. Documents */}
          <div className="col-span-12 md:col-span-4 relative h-full rounded-3xl border border-white/10 p-2.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                  <FiFileText className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-500 font-mono">DOCUMENTS</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalDocuments}</div>
            </div>
          </div>

          {/* 3. Embeddings */}
          <div className="col-span-12 md:col-span-4 relative h-full rounded-3xl border border-white/10 p-2.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-pink-500/20 rounded-lg text-pink-400">
                  <PiBrain className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-500 font-mono">EMBEDDINGS</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalEmbeddings}</div>
            </div>
          </div>

          {/* 4. Upload Data (Large Card) */}
          <div className="col-span-12 lg:col-span-8 relative h-full rounded-3xl border border-white/10 p-2.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-200">
                <FiUpload className="text-gray-400" />
                Upload Data
              </h2>
              <DashboardUpload onUploadComplete={handleUploadComplete} />
            </div>
          </div>

          {/* 6. Recent Uploads Table (Now Small Right) */}
          <div className="col-span-12 lg:col-span-4 relative h-full rounded-3xl border border-white/10 p-2.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 p-0 backdrop-blur-xl border border-white/10">
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-200">
                  <FiDatabase className="text-gray-400" />
                  Recent Uploads
                </h2>
              </div>

              <div className="p-0 flex-grow overflow-hidden">
                {dataSources.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 border-b border-white/10">
                          <th className="pl-6 py-3 font-medium">NAME</th>
                          <th className="pr-6 py-3 font-medium text-right">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dataSources.map((source, i) => (
                          <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="pl-6 py-3 text-sm font-medium text-gray-300 truncate max-w-[120px]">{source.name}</td>
                            <td className="pr-6 py-3 text-right">
                              <span className="px-2 py-1 rounded-full text-[10px] bg-green-500/10 text-green-400 border border-green-500/20">
                                {source.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No recent uploads found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 5. Quick Actions (Now Large Left) */}
          <div className="col-span-12 lg:col-span-8 relative h-full rounded-3xl border border-white/10 p-2.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-200">
                <FiActivity className="text-gray-400" />
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  href="/chat"
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group"
                >
                  <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400 group-hover:scale-110 transition-transform">
                    <FiMessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-medium text-base">Chat Interface</div>
                    <div className="text-sm text-gray-500">Test your RAG interactively</div>
                  </div>
                </Link>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 hover:border-white/20 group cursor-pointer">
                  <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400 group-hover:scale-110 transition-transform">
                    <FiBookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-medium text-base">Documentation</div>
                    <div className="text-sm text-gray-500">View comprehensive API docs</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 7. API Access */}
          <div className="col-span-12 lg:col-span-4 relative h-full rounded-3xl border border-white/10 p-2.5">
            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white/5 p-6 backdrop-blur-xl border border-white/10">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-200">
                <FiServer className="text-gray-400" />
                API Access
              </h2>

              <div className="space-y-6">


                <div>
                  <label className="text-xs text-gray-500 font-mono mb-2 block uppercase tracking-wider flex justify-between items-center">
                    <span>API Key</span>
                    <button onClick={handleRegenerateKey} disabled={isRegeneratingKey} className="text-[10px] text-blue-400 hover:text-blue-300 cursor-pointer">
                      {isRegeneratingKey ? 'Generating...' : 'Regenerate'}
                    </button>
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 px-3 py-2.5 rounded-xl text-xs font-mono text-gray-300 truncate border border-white/5 filter blur-sm hover:blur-none transition-all cursor-pointer" title="Hover to reveal">
                      {apiKey}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiKey, 'apikey')}
                      className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
                    >
                      {copiedKey === 'apikey' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 font-mono mb-2 block uppercase tracking-wider">API Endpoint</label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-black/50 px-3 py-2.5 rounded-xl text-xs font-mono text-gray-300 truncate border border-white/5">
                      {apiEndpoint}
                    </code>
                    <button
                      onClick={() => copyToClipboard(apiEndpoint, 'url')}
                      className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors text-gray-400 hover:text-white"
                    >
                      {copiedKey === 'url' ? <FiCheck className="text-green-400" /> : <FiCopy />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* API Testing Panel */}
      <ApiTestPanel />
    </div>
  );
}