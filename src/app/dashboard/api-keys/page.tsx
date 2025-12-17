'use client';

import { useState, useEffect } from 'react';
import { FiKey, FiCopy, FiCheck, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { getApiKey, generateApiKey } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function ApiKeysPage() {
    const { user, loading: authLoading } = useAuth();
    const [apiKey, setApiKey] = useState('Loading...');
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);

    useEffect(() => {
        if (!authLoading && user) {
            loadKey();
        }
    }, [user, authLoading]);

    const loadKey = async () => {
        try {
            const key = await getApiKey();
            setApiKey(key);
        } catch (error) {
            setApiKey('Error loading key');
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(apiKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRegenerate = async () => {
        setRegenerating(true);
        try {
            const key = await generateApiKey();
            setApiKey(key);
        } catch (error) {
            console.error(error);
        } finally {
            setRegenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-white">API Keys</h1>
                <p className="text-gray-400 mt-1">Manage your secret keys for accessing the RAGx API.</p>
            </div>

            <div className="p-6 rounded-xl border border-white/10 bg-[#0F0F0F] space-y-6">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-300">Secret Key</label>
                        {copied && <span className="text-xs text-green-400 flex items-center gap-1"><FiCheck /> Copied to clipboard</span>}
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 bg-black border border-white/10 rounded-lg px-4 py-3 font-mono text-sm text-gray-300 relative group">
                            <span className="filter blur-[4px] group-hover:blur-none transition-all duration-300 select-all">{apiKey}</span>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors"
                        >
                            <FiCopy />
                        </button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        This key grants full access to your RAGx account. Keep it secure.
                    </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                        <FiAlertTriangle className="text-yellow-500" /> Danger Zone
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-lg">
                        <div>
                            <div className="text-sm font-medium text-red-200">Rotate Secret Key</div>
                            <div className="text-xs text-red-400/70 mt-1">This will invalidate your current key immediately.</div>
                        </div>
                        <button
                            onClick={handleRegenerate}
                            disabled={regenerating}
                            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                        >
                            {regenerating ? 'Rotating...' : 'Rotate Key'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
