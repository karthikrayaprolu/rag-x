'use client';

import { motion } from 'framer-motion';
import { FiCode, FiTerminal, FiZap } from 'react-icons/fi';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function DevelopersPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] right-[30%] w-[50%] h-[50%] bg-green-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-green-400 text-sm font-medium mb-6">
                        <FiCode className="w-4 h-4" />
                        <span>Build with Ragster</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                        Developer Hub
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Everything you need to integrate Ragster into your applications.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto auto-rows-[minmax(300px,auto)]">

                    {/* Item 1: FastAPI Specification (Top Left, 2/3rds) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-8 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between group h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="relative z-10 max-w-lg">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-400">
                                <FiCode className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">FastAPI Specification</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                Automatically generated, interactive API documentation. Test endpoints directly from your browser.
                            </p>
                        </div>

                        {/* Visual: OpenAPI Mockup */}
                        <div className="absolute top-10 right-10 w-64 bg-[#1e1e1e] rounded-lg border border-white/10 p-4 shadow-2xl opacity-80 rotate-3 transition-transform group-hover:rotate-0">
                            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                                <div className="text-green-500 font-bold text-xs">GET</div>
                                <div className="text-gray-400 text-xs font-mono">/v1/chat/completions</div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-3/4 bg-gray-700/50 rounded-full" />
                                <div className="h-2 w-1/2 bg-gray-700/50 rounded-full" />
                                <div className="h-2 w-full bg-gray-700/50 rounded-full" />
                            </div>
                        </div>
                    </CardSpotlight>

                    {/* Item 2: SDK Support (Top Right, 1/3rd) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-4 p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                <FiTerminal className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">SDK Support</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Official client libraries for Python and Node.js to get you started in minutes.
                            </p>
                        </div>

                        {/* Visual: Terminal */}
                        <div className="mt-8 bg-black rounded-lg border border-white/10 p-4 font-mono text-xs text-green-400 shadow-inner">
                            <div>$ pip install ragster</div>
                            <div className="text-gray-500">Installing dependencies...</div>
                            <div className="text-gray-500">Successfully installed.</div>
                            <div className="animate-pulse mt-1">_</div>
                        </div>
                    </CardSpotlight>

                    {/* Item 3: High Performance (Bottom Full Width) */}
                    <CardSpotlight
                        className="col-span-12 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="flex-1 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                                <FiZap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">High Performance</h3>
                            <p className="text-gray-400 leading-relaxed text-lg max-w-2xl">
                                Built on an async architecture for massive throughput. Handle thousands of concurrent requests with low latency.
                            </p>
                        </div>

                        {/* Visual: Performance Graph */}
                        <div className="flex-1 w-full flex items-end justify-around h-32 opacity-60 gap-2">
                            {[40, 60, 45, 80, 70, 90, 100].map((h, i) => (
                                <motion.div
                                    key={i}
                                    className="w-full bg-purple-500/50 rounded-t-sm"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    </CardSpotlight>

                </div>

                {/* API Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 max-w-4xl mx-auto rounded-xl overflow-hidden border border-white/10 bg-[#0A0A0A] shadow-2xl"
                >
                    <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        <div className="ml-4 text-xs text-gray-500 font-mono">POST /api/v1/chat/query</div>
                    </div>
                    <div className="p-6 overflow-x-auto">
                        <pre className="text-sm font-mono text-gray-300">
                            <code>{`{
  "query": "Explain the project structure",
  "session_id": "sess_123456",
  "filters": {
    "source": "documentation"
  }
}`}</code>
                        </pre>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
