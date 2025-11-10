'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-50"
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
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-50"
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

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {userEmail}</p>
        </motion.div>

        {/* API Credentials Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* User ID Card */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <HiOutlineIdentification className="w-6 h-6 text-gray-400" />
              Your User ID
            </h2>
            <div className="flex items-center gap-4">
              <code className="flex-1 bg-black/50 text-gray-300 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                {userId}
              </code>
              <motion.button
                onClick={() => copyToClipboard(userId, 'User ID')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
                  copiedKey === 'User ID'
                    ? 'bg-green-500/20 text-green-300' // Success state
                    : 'bg-white/10 hover:bg-white/20 text-white' // Normal state
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copiedKey === 'User ID' ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiCopy className="w-4 h-4" />
                )}
                {copiedKey === 'User ID' ? 'Copied' : 'Copy'}
              </motion.button>
            </div>
          </motion.div>

          {/* API Key Card */}
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.02, borderColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <HiOutlineKey className="w-6 h-6 text-gray-400" />
              Your API Key
            </h2>
            <div className="flex items-center gap-4">
              <code className="flex-1 bg-black/50 text-gray-300 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                {apiKey}
              </code>
              <motion.button
                onClick={() => copyToClipboard(apiKey, 'API Key')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
                  copiedKey === 'API Key'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copiedKey === 'API Key' ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiCopy className="w-4 h-4" />
                )}
                {copiedKey === 'API Key' ? 'Copied' : 'Copy'}
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* API Endpoint Card */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ scale: 1.01, borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
            <FiGlobe className="w-6 h-6 text-gray-400" />
            Your API Endpoint
          </h2>
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-4">
              <code className="flex-1 bg-black/50 text-gray-300 px-4 py-3 rounded-lg font-mono text-sm overflow-x-auto">
                {apiEndpoint}
              </code>
              <motion.button
                onClick={() => copyToClipboard(apiEndpoint, 'API Endpoint')}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium flex items-center gap-2 ${
                  copiedKey === 'API Endpoint'
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {copiedKey === 'API Endpoint' ? (
                  <FiCheck className="w-4 h-4" />
                ) : (
                  <FiCopy className="w-4 h-4" />
                )}
                {copiedKey === 'API Endpoint' ? 'Copied' : 'Copy'}
              </motion.button>
            </div>
          </div>

          <motion.div
            className="bg-black/30 rounded-lg p-4 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-gray-300 mb-2 font-semibold">
              Example cURL Request:
            </p>
            <code className="text-green-300 block overflow-x-auto whitespace-pre">
              {`curl -X POST ${apiEndpoint} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"question": "What is our return policy?"}'`}
            </code>
          </motion.div>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <FiBarChart2 className="w-8 h-8 text-gray-400 mb-4" />
            <motion.div
              className="text-3xl font-bold text-white mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6, type: "spring" }}
            >
              {stats.totalQueries}
            </motion.div>
            <div className="text-gray-300 text-sm">Total Queries</div>
          </motion.div>

          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <FiFileText className="w-8 h-8 text-gray-400 mb-4" />
            <motion.div
              className="text-3xl font-bold text-white mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7, type: "spring" }}
            >
              {stats.totalDocuments}
            </motion.div>
            <div className="text-gray-300 text-sm">Documents</div>
          </motion.div>

          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <PiBrain className="w-8 h-8 text-gray-400 mb-4" />
            <motion.div
              className="text-3xl font-bold text-white mb-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8, type: "spring" }}
            >
              {stats.totalEmbeddings}
            </motion.div>
            <div className="text-gray-300 text-sm">Embeddings</div>
          </motion.div>

          <motion.div
            className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <FiZap className="w-8 h-8 text-gray-400 mb-4" />
            <motion.div
              className="text-lg font-bold text-green-400 mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Active
            </motion.div>
            <div className="text-gray-300 text-sm">System Status</div>
          </motion.div>
        </div>

        {/* Data Sources Table */}
        <motion.div
          className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-3">
              <FiDatabase className="w-6 h-6" />
              Connected Data Sources
            </h2>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/upload"
                // Styled to match main CTA
                className="bg-white text-black hover:bg-gray-200 font-bold px-5 py-2.5 rounded-full transition-colors text-sm flex items-center justify-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add New Source
              </Link>
            </motion.div>
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
                  <motion.tr
                    key={index}
                    className="border-b border-white/10 hover:bg-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                  >
                    <td className="text-white py-3 px-4">{source.name}</td>
                    <td className="text-gray-300 py-3 px-4">{source.type}</td>
                    <td className="py-3 px-4">
                      <motion.span
                        className={`px-3 py-1 rounded-full text-xs ${
                          source.status === 'Processed' ||
                          source.status === 'Connected'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3, delay: 1 + index * 0.1 }}
                      >
                        {source.status}
                      </motion.span>
                    </td>
                    <td className="text-gray-300 py-3 px-4">{source.date}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link
              href="/upload"
              className="block bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group"
            >
              <motion.div
                // whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                // transition={{ duration: 0.5 }}
              >
                <FiUpload className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Upload Data
              </h3>
              <p className="text-gray-300 text-sm">
                Add new documents or connect databases
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <Link
              href="/chat"
              className="block bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group"
            >
              <motion.div
                // whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                // transition={{ duration: 0.5 }}
              >
                <FiMessageSquare className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ask Questions
              </h3>
              <p className="text-gray-300 text-sm">
                Chat with your data using AI
              </p>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-purple-500/50 transition-all group cursor-pointer">
              <motion.div
                // whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                // transition={{ duration: 0.5 }}
              >
                <FiBookOpen className="w-10 h-10 text-gray-400 group-hover:text-purple-400 transition-colors mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-2">
                API Documentation
              </h3>
              <p className="text-gray-300 text-sm">
                Learn how to integrate the API
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}