'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiCheck, FiX, FiRefreshCw, FiDatabase, FiServer } from 'react-icons/fi';
import { testApiConnection, getApiBaseUrl, healthCheck, getUploadStats } from '@/lib/api';

interface TestResult {
  test: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  duration?: number;
}

export default function ApiTestPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runTests = async () => {
    setIsTesting(true);
    setResults([]);

    const testSuite: TestResult[] = [
      { test: 'API Configuration', status: 'pending', message: '' },
      { test: 'Backend Health', status: 'pending', message: '' },
      { test: 'Authentication', status: 'pending', message: '' },
      { test: 'Upload Stats', status: 'pending', message: '' },
    ];

    setResults([...testSuite]);

    // Test 1: API Configuration
    const startTime1 = Date.now();
    try {
      const apiUrl = getApiBaseUrl();
      testSuite[0] = {
        ...testSuite[0],
        status: 'success',
        message: `Connected to: ${apiUrl}`,
        duration: Date.now() - startTime1,
      };
    } catch (error: any) {
      testSuite[0] = {
        ...testSuite[0],
        status: 'error',
        message: error.message,
        duration: Date.now() - startTime1,
      };
    }
    setResults([...testSuite]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 2: Backend Health
    const startTime2 = Date.now();
    try {
      await healthCheck();
      testSuite[1] = {
        ...testSuite[1],
        status: 'success',
        message: 'Backend is responding',
        duration: Date.now() - startTime2,
      };
    } catch (error: any) {
      testSuite[1] = {
        ...testSuite[1],
        status: 'error',
        message: error.message || 'Backend unreachable',
        duration: Date.now() - startTime2,
      };
    }
    setResults([...testSuite]);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Test 3: Authentication
    const startTime3 = Date.now();
    try {
      // This will fail if not authenticated, which is expected
      await getUploadStats();
      testSuite[2] = {
        ...testSuite[2],
        status: 'success',
        message: 'Authentication successful',
        duration: Date.now() - startTime3,
      };

      // Test 4: Upload Stats (only if authenticated)
      const startTime4 = Date.now();
      try {
        const stats = await getUploadStats();
        testSuite[3] = {
          ...testSuite[3],
          status: 'success',
          message: `Retrieved stats: ${stats.total_documents} docs, ${stats.vector_count} vectors`,
          duration: Date.now() - startTime4,
        };
      } catch (error: any) {
        testSuite[3] = {
          ...testSuite[3],
          status: 'error',
          message: error.message,
          duration: Date.now() - startTime4,
        };
      }
    } catch (error: any) {
      testSuite[2] = {
        ...testSuite[2],
        status: 'error',
        message: error.message || 'Not authenticated',
        duration: Date.now() - startTime3,
      };
      testSuite[3] = {
        ...testSuite[3],
        status: 'error',
        message: 'Skipped (authentication required)',
      };
    }
    setResults([...testSuite]);

    setIsTesting(false);
  };

  return (
    <>
      {/* Floating Test Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform border border-white/20"
        title="Test API Connection"
      >
        <FiActivity className="w-6 h-6" />
      </button>

      {/* Test Panel */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onWheel={(e) => e.stopPropagation()}
          className="fixed bottom-24 right-6 z-40 w-96 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <FiServer className="text-purple-400" />
              <h3 className="font-semibold text-white">API Diagnostics</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={runTests}
                disabled={isTesting}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white disabled:opacity-50"
              >
                <FiRefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-96 overflow-y-auto overscroll-y-contain">
            {results.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FiDatabase className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Click the refresh button to run diagnostics</p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 bg-white/5 rounded-xl border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {result.status === 'pending' && (
                          <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                        )}
                        {result.status === 'success' && (
                          <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center">
                            <FiCheck className="w-3 h-3 text-green-400" />
                          </div>
                        )}
                        {result.status === 'error' && (
                          <div className="w-5 h-5 bg-red-500/20 rounded-full flex items-center justify-center">
                            <FiX className="w-3 h-3 text-red-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-white mb-1">
                          {result.test}
                        </div>
                        <div className={`text-xs ${result.status === 'success' ? 'text-green-400' :
                            result.status === 'error' ? 'text-red-400' :
                              'text-gray-500'
                          } break-words`}>
                          {result.message || 'Running test...'}
                        </div>
                        {result.duration && (
                          <div className="text-xs text-gray-600 mt-1">
                            {result.duration}ms
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-white/5">
            <button
              onClick={runTests}
              disabled={isTesting}
              className="w-full py-2.5 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <FiActivity className="w-4 h-4" />
                  Run Diagnostics
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
