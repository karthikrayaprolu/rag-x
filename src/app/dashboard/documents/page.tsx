'use client';

import { useState, useEffect } from 'react';
import { FiSearch, FiFileText, FiTrash2, FiDownload, FiLoader } from 'react-icons/fi';
import { getUserDocuments, deleteDocument } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function DocumentsPage() {
    const { user, loading: authLoading } = useAuth();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading && user) {
            fetchDocuments();
        }
    }, [user, authLoading]);

    const fetchDocuments = async () => {
        setLoading(true);
        try {
            const res = await getUserDocuments();
            setDocuments(res.documents || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (docId: string) => {
        if (!confirm('Are you sure you want to delete this document?')) return;
        try {
            await deleteDocument(docId);
            setDocuments(docs => docs.filter(d => d.document_id !== docId));
        } catch (error) {
            console.error(error);
        }
    };

    const filteredDocs = documents.filter(doc =>
        doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Knowledge Base</h1>
                    <p className="text-gray-400 mt-1">Manage your indexed documents and sources.</p>
                </div>
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-zinc-900 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-white/30 transition-colors w-64"
                    />
                </div>
            </div>

            <div className="bg-[#0F0F0F] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left bg-zinc-900/10">
                    <thead>
                        <tr className="border-b border-white/10 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Size</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    <FiLoader className="w-6 h-6 animate-spin mx-auto mb-2" />
                                    Loading documents...
                                </td>
                            </tr>
                        ) : filteredDocs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No documents found.
                                </td>
                            </tr>
                        ) : (
                            filteredDocs.map((doc) => (
                                <tr key={doc.document_id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                                                <FiFileText className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-gray-200">{doc.filename}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400 uppercase">{doc.file_type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{doc.file_size ? (doc.file_size / 1024).toFixed(1) : '0.0'} KB</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">{new Date(doc.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(doc.document_id)}
                                            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
