'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiDatabase, FiType, FiUploadCloud, FiCheckCircle, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { uploadDocument } from '@/lib/api';

export default function DashboardUpload({ onUploadComplete }: { onUploadComplete?: () => void }) {
    const [activeTab, setActiveTab] = useState<'text' | 'files' | 'database'>('files');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    // File Upload State
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Text Upload State
    const [textTitle, setTextTitle] = useState('');
    const [textContent, setTextContent] = useState('');

    // Database State
    const [dbType, setDbType] = useState('postgresql');
    const [dbUrl, setDbUrl] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setStatus({ type: null, message: '' });
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const result = await uploadDocument(selectedFile);
            setStatus({
                type: 'success',
                message: `Successfully processed ${selectedFile.name} (${result.chunks_created} chunks)`
            });
            setSelectedFile(null);
            onUploadComplete?.();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Upload failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleTextUpload = async () => {
        if (!textTitle || !textContent) return;
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            // Create a file from the text content
            const blob = new Blob([textContent], { type: 'text/plain' });
            const file = new File([blob], `${textTitle}.txt`, { type: 'text/plain' });

            const result = await uploadDocument(file);
            setStatus({
                type: 'success',
                message: `Successfully processed text "${textTitle}" (${result.chunks_created} chunks)`
            });
            setTextTitle('');
            setTextContent('');
            onUploadComplete?.();
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Upload failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleDbConnect = async () => {
        if (!dbUrl) return;
        setLoading(true);
        setStatus({ type: null, message: '' });

        // Simulate connection for now
        setTimeout(() => {
            setStatus({ type: 'error', message: 'Database connection feature coming soon!' });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'text' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <FiType className="w-4 h-4" /> Text
                </button>
                <button
                    onClick={() => setActiveTab('files')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'files' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <FiFileText className="w-4 h-4" /> Files
                </button>
                <button
                    onClick={() => setActiveTab('database')}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'database' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <FiDatabase className="w-4 h-4" /> Database
                </button>
            </div>

            <div className="p-6">
                <AnimatePresence mode="wait">
                    {/* Status Message */}
                    {status.message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                                : 'bg-red-500/10 border border-red-500/20 text-red-300'
                                }`}
                        >
                            {status.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                            <span className="text-sm">{status.message}</span>
                        </motion.div>
                    )}

                    {/* Text Tab */}
                    {activeTab === 'text' && (
                        <motion.div
                            key="text"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Title</label>
                                <input
                                    type="text"
                                    value={textTitle}
                                    onChange={(e) => setTextTitle(e.target.value)}
                                    placeholder="e.g. Meeting Notes"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Content</label>
                                <textarea
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    placeholder="Paste your text here..."
                                    rows={6}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors resize-none"
                                />
                            </div>
                            <button
                                onClick={handleTextUpload}
                                disabled={!textTitle || !textContent || loading}
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <FiUploadCloud />}
                                {loading ? 'Processing...' : 'Upload Text'}
                            </button>
                        </motion.div>
                    )}

                    {/* Files Tab */}
                    {activeTab === 'files' && (
                        <motion.div
                            key="files"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-colors relative group">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf,.txt,.doc,.docx,.csv,.json"
                                />
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                    <FiUploadCloud className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                                </div>
                                {selectedFile ? (
                                    <div>
                                        <p className="text-white font-medium mb-1">{selectedFile.name}</p>
                                        <p className="text-gray-500 text-sm">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                                        <p className="text-gray-500 text-sm">PDF, TXT, DOCX, CSV, JSON (Max 10MB)</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleFileUpload}
                                disabled={!selectedFile || loading}
                                className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <FiUploadCloud />}
                                {loading ? 'Processing...' : 'Upload File'}
                            </button>
                        </motion.div>
                    )}

                    {/* Database Tab */}
                    {activeTab === 'database' && (
                        <motion.div
                            key="database"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Database Type</label>
                                <div className="relative">
                                    <select
                                        value={dbType}
                                        onChange={(e) => setDbType(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all appearance-none cursor-pointer hover:bg-white/10"
                                    >
                                        <option value="postgresql" className="bg-neutral-900 text-white">PostgreSQL</option>
                                        <option value="mysql" className="bg-neutral-900 text-white">MySQL</option>
                                        <option value="mongodb" className="bg-neutral-900 text-white">MongoDB</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 font-medium mb-2 uppercase tracking-wider">Connection String</label>
                                <input
                                    type="text"
                                    value={dbUrl}
                                    onChange={(e) => setDbUrl(e.target.value)}
                                    placeholder="postgresql://user:password@localhost:5432/mydb"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                                />
                            </div>
                            <button
                                onClick={handleDbConnect}
                                disabled={!dbUrl || loading}
                                className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? <FiLoader className="animate-spin" /> : <FiDatabase />}
                                {loading ? 'Connecting...' : 'Connect Database'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
