'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// Import react-icons
import {
  HiOutlineIdentification,
  HiOutlineKey,
} from 'react-icons/hi';
import {
  FiGlobe,
  FiBarChart2,
  FiFileText,
  FiZap,
  FiDatabase,
  FiUpload,
  FiMessageSquare,
  FiBookOpen,
  FiCopy,
  FiCheck,
  FiPlus,
} from 'react-icons/fi';
import { PiBrain } from 'react-icons/pi';

export default function DashboardPage() {
  const [userId, setUserId] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null); // For copy feedback
  const [dataSources, setDataSources] = useState<
    Array<{
      name: string;
      type: string;
      status: string;
      date: string;
    }>
  >([]);
  const [stats, setStats] = useState({
    totalQueries: 0,
    totalDocuments: 0,
    totalEmbeddings: 0,
    lastActivity: null as string | null,
  });

  useEffect(() => {
    // Get user data from localStorage (in production, fetch from API)
    const storedUserId = localStorage.getItem('user_id') || 'usr_demo123456';
    const storedApiKey =
      localStorage.getItem('api_key') || 'rg_demo_api_key_placeholder';
    const storedEmail =
      localStorage.getItem('user_email') || 'demo@ragx.com';

    setUserId(storedUserId);
    setApiKey(storedApiKey);
    setUserEmail(storedEmail);

    // Mock data sources
    setDataSources([
      {
        name: 'company_docs.pdf',
        type: 'PDF',
        status: 'Processed',
        date: '2025-11-05',
      },
      {
        name: 'product_catalog.csv',
        type: 'CSV',
        status: 'Processed',
        date: '2025-11-06',
      },
      {
        name: 'PostgreSQL - customers_db',
        type: 'Database',
        status: 'Connected',
        date: '2025-11-07',
      },
    ]);

    // Mock stats
    setStats({
      totalQueries: 156,
      totalDocuments: 12,
      totalEmbeddings: 3420,
      lastActivity: new Date().toISOString(),
    });
  }, []);

  // Removed alert() and added state feedback
  const copyToClipboard = (text: string, label: string) => {
    // Use execCommand for broader iFrame compatibility
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Avoid scrolling
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand('copy');
      setCopiedKey(label);
      setTimeout(() => setCopiedKey(null), 2000); // Reset feedback after 2s
    } catch (err) {
      console.error('Failed to copy: ', err);
    }

    document.body.removeChild(textArea);
  };

  const apiEndpoint = `https://api.ragx.com/ask/${userId}`;

  return (
    // Simplified background to match auth page
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* Background blur shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {userEmail}</p>
        </div>

        {/* API Credentials Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User ID Card */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <HiOutlineIdentification className="w-6 h-6 text-gray-400" />
              Your User ID
            </h2>
            <div className="flex items-center gap-4">
              <code className="flex-1 bg-black/50 text-gray-300 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                {userId}
              </code>
              <button
                onClick={() => copyToClipboard(userId, 'User ID')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
                  copiedKey === 'User ID'
                    ? 'bg-green-500/20 text-green-300' // Success state
                    : 'bg-white/10 hover:bg-white/20 text-white' // Normal state
                }`}
              >
                {copiedKey === 'User ID' ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiCopy className="w-4 h-4" />
                )}
                {copiedKey === 'User ID' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* API Key Card */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <HiOutlineKey className="w-6 h-6 text-gray-400" />
              Your API Key
            </h2>
            <div className="flex items-center gap-4">
              <code className="flex-1 bg-black/50 text-gray-300 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                {apiKey}
              </code>
              <button
                onClick={() => copyToClipboard(apiKey, 'API Key')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
                  copiedKey === 'API Key'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {copiedKey === 'API Key' ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiCopy className="w-4 h-4" />
                )}
                {copiedKey === 'API Key' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* API Endpoint Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <FiGlobe className="w-6 h-6 text-gray-400" />
            Your API Endpoint
          </h2>
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <code className="flex-1 bg-black/50 text-gray-300 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                {apiEndpoint}
              </code>
              <button
                onClick={() => copyToClipboard(apiEndpoint, 'API Endpoint')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
                  copiedKey === 'API Endpoint'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                {copiedKey === 'API Endpoint' ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiCopy className="w-4 h-4" />
                )}
                {copiedKey === 'API Endpoint' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className="bg-black/30 rounded-lg p-4 text-sm">
            <p className="text-gray-300 mb-2 font-semibold">
              Example cURL Request:
            </p>
            <code className="text-green-300 block overflow-x-auto whitespace-pre">
              {`curl -X POST ${apiEndpoint} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "What is our return policy?"}'`}
            </code>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <FiBarChart2 className="w-8 h-8 text-gray-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalQueries}
            </div>
            <div className="text-gray-300 text-sm">Total Queries</div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <FiFileText className="w-8 h-8 text-gray-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalDocuments}
            </div>
            <div className="text-gray-300 text-sm">Documents</div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <PiBrain className="w-8 h-8 text-gray-400 mb-4" />
            <div className="text-3xl font-bold text-white mb-1">
              {stats.totalEmbeddings}
            </div>
            <div className="text-gray-300 text-sm">Embeddings</div>
          </div>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <FiZap className="w-8 h-8 text-gray-400 mb-4" />
            <div className="text-lg font-bold text-green-400 mb-1">Active</div>
            <div className="text-gray-300 text-sm">System Status</div>
          </div>
        </div>

        {/* Data Sources Table */}
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <FiDatabase className="w-6 h-6" />
              Connected Data Sources
            </h2>
            <Link
              href="/upload"
              // Styled to match main CTA
              className="bg-white text-black hover:bg-gray-200 font-bold px-5 py-2.5 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Add New Source
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-gray-300 py-3 px-4">Name</th>
                  <th className="text-left text-gray-300 py-3 px-4">Type</th>
                  <th className="text-left text-gray-300 py-3 px-4">Status</th>
                  <th className="text-left text-gray-300 py-3 px-4">
                    Date Added
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataSources.map((source, index) => (
                  <tr
                    key={index}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="text-white py-3 px-4">{source.name}</td>
                    <td className="text-gray-300 py-3 px-4">{source.type}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          source.status === 'Processed' ||
                          source.status === 'Connected'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                      >
                        {source.status}
                      </span>
                    </td>
                    <td className="text-gray-300 py-3 px-4">{source.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/upload"
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group"
          >
            <FiUpload className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Upload Data
            </h3>
            <p className="text-gray-300 text-sm">
              Add new documents or connect databases
            </p>
          </Link>

          <Link
            href="/chat"
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group"
          >
            <FiMessageSquare className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Ask Questions
            </h3>
            <p className="text-gray-300 text-sm">
              Chat with your data using AI
            </p>
          </Link>

          <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group cursor-pointer">
            <FiBookOpen className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              API Documentation
            </h3>
            <p className="text-gray-300 text-sm">
              Learn how to integrate the API
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}