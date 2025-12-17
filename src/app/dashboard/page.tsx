'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FiBarChart2,
  FiFileText,
  FiDatabase,
  FiUpload,
  FiCheck,
  FiCopy,
  FiServer,
  FiX,
  FiRefreshCw
} from 'react-icons/fi';
import { PiBrain } from 'react-icons/pi';
import { getUploadStats, healthCheck, getApiKey, generateApiKey, getUserDocuments } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import DashboardUpload from '@/components/DashboardUpload';
import Swal from 'sweetalert2';

function DashboardContent() {
  const { user, loading: authLoading, userProfile, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<Array<{
    document_id: string;
    name: string;
    type: string;
    status: string;
    date: string;
  }>>([]);
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
      Swal.fire({
        title: 'Payment Successful!',
        text: 'Your subscription is now active.',
        icon: 'success',
        confirmButtonText: 'Continue',
        background: '#09090b',
        color: '#e5e7eb',
        confirmButtonColor: '#ffffff',
        customClass: {
          confirmButton: '!text-black !font-bold !px-6 !py-2 !rounded-full'
        }
      });
      window.history.replaceState({}, '', '/dashboard');
      setTimeout(async () => await refreshProfile(), 2000);
    }
  }, [searchParams, refreshProfile]);

  const fetchStats = async () => {
    if (authLoading || !user) return;
    setIsLoadingStats(true);
    try {
      const uploadStats = await getUploadStats();
      setStats({
        totalEmbeddings: uploadStats.vector_count,
        totalQueries: uploadStats.query_count || 0,
        totalDocuments: uploadStats.total_documents || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchDocuments = async () => {
    if (authLoading || !user) return;
    try {
      const response = await getUserDocuments();
      const formattedDocs = response.documents.map(doc => ({
        document_id: doc.document_id,
        name: doc.filename,
        type: doc.file_type,
        status: doc.status,
        date: new Date(doc.created_at).toLocaleDateString()
      }));
      setDataSources(formattedDocs);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const fetchApiKey = async () => {
    if (authLoading || !user) return;
    try {
      const key = await getApiKey();
      setApiKey(key);
    } catch (error) {
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

  useEffect(() => {
    if (authLoading || !user) return;
    const timer = setTimeout(() => {
      fetchStats();
      fetchApiKey();
      fetchDocuments();
    }, 500);
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
    fetchDocuments();
  };

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
  const apiEndpoint = `${apiBaseUrl}/chat/query`;

  if (authLoading || !user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white tracking-tight">Overview</h1>
        <button
          onClick={fetchStats}
          className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          title="Refresh Data"
        >
          <FiRefreshCw className={`w-4 h-4 ${isLoadingStats ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {showSuccessBanner && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiCheck className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-green-400 font-medium text-sm">Subscription Active</p>
              <p className="text-xs text-gray-400">Your pro features are now enabled.</p>
            </div>
          </div>
          <button onClick={() => setShowSuccessBanner(false)} className="text-gray-400 hover:text-white">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-white/10 bg-[#0F0F0F]">
          <div className="flex items-center gap-3 mb-2">
            <FiBarChart2 className="text-gray-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Queries</span>
          </div>
          <div className="text-2xl font-semibold text-white">{stats.totalQueries}</div>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-[#0F0F0F]">
          <div className="flex items-center gap-3 mb-2">
            <FiFileText className="text-gray-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</span>
          </div>
          <div className="text-2xl font-semibold text-white">{stats.totalDocuments}</div>
        </div>
        <div className="p-6 rounded-xl border border-white/10 bg-[#0F0F0F]">
          <div className="flex items-center gap-3 mb-2">
            <PiBrain className="text-gray-500" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vectors</span>
          </div>
          <div className="text-2xl font-semibold text-white">{stats.totalEmbeddings.toLocaleString()}</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Upload & API */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border border-white/10 rounded-xl bg-[#0F0F0F] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-medium text-sm text-gray-300 flex items-center gap-2">
                <FiUpload className="text-gray-500" /> Upload Data
              </h3>
            </div>
            <div className="p-6">
              <DashboardUpload onUploadComplete={handleUploadComplete} />
            </div>
          </div>

          <div className="border border-white/10 rounded-xl bg-[#0F0F0F] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-medium text-sm text-gray-300 flex items-center gap-2">
                <FiServer className="text-gray-500" /> API Access
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-gray-500 uppercase tracking-wider font-medium">Secret Key</label>
                  <button onClick={handleRegenerateKey} disabled={isRegeneratingKey} className="text-[10px] text-red-400 hover:text-red-300">
                    {isRegeneratingKey ? 'Rotating...' : 'Rotate Key'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black border border-white/10 px-3 py-2 rounded-lg text-xs font-mono text-gray-300 truncate filter blur-[2px] hover:blur-none transition-all duration-200">
                    {apiKey}
                  </code>
                  <button onClick={() => copyToClipboard(apiKey, 'apikey')} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    {copiedKey === 'apikey' ? <FiCheck className="w-4 h-4 text-green-400" /> : <FiCopy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Query Endpoint</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-black border border-white/10 px-3 py-2 rounded-lg text-xs font-mono text-gray-300 truncate">
                    {apiEndpoint}
                  </code>
                  <button onClick={() => copyToClipboard(apiEndpoint, 'url')} className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
                    {copiedKey === 'url' ? <FiCheck className="w-4 h-4 text-green-400" /> : <FiCopy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Documents List */}
        <div className="lg:col-span-1">
          <div className="border border-white/10 rounded-xl bg-[#0F0F0F] h-full flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-medium text-sm text-gray-300 flex items-center gap-2">
                <FiDatabase className="text-gray-500" /> Knowledge Base
              </h3>
              <Link href="/dashboard/documents" className="text-xs text-blue-400 hover:text-blue-300">
                View All
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[500px]">
              {dataSources.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {dataSources.slice(0, 10).map((source, i) => (
                    <div key={i} className="px-6 py-3 hover:bg-white/[0.02] transition-colors group">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium text-gray-200 truncate pr-4">{source.name}</div>
                        <div className={`w-1.5 h-1.5 rounded-full ${source.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{source.type.toUpperCase()}</span>
                        <span>{source.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No documents found. Upload your first document to get started.
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="text-center pt-20 text-gray-500">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}