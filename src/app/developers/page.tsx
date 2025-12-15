'use client';

import { motion } from 'framer-motion';
import { FiCode, FiUsers, FiZap } from 'react-icons/fi';
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-green-400 text-xs font-medium mb-8 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
                        <FiCode className="w-3 h-3" />
                        <span>Build with RagX</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
                        Developer Hub
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
                        Everything you need to integrate RagX into your applications.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto auto-rows-[minmax(300px,auto)]">

                    {/* Item 1: FastAPI Specification (Top Left, 2/3rds) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-8 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between group h-full gap-8"
                        color="rgba(255,255,255,0.15)"
                    >
                        {/* Text Content */}
                        <div className="relative z-10 max-w-md flex flex-col justify-center">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/10 flex items-center justify-center mb-6 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                                <FiCode className="w-7 h-7 text-green-400" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                Open Standard APIs
                            </h3>
                            <p className="text-gray-400 leading-relaxed text-lg font-light">
                                Fully documented, type-safe endpoints. Generated automatically with FastAPI.
                                <br />
                                <span className="text-green-400/80 text-sm mt-4 block font-mono flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Live Documentation Available
                                </span>
                            </p>

                            {/* Action Badges */}
                            <div className="mt-8 flex flex-wrap gap-3">
                                <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
                                    Swagger UI
                                </div>
                                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-400">
                                    ReDoc
                                </div>
                            </div>
                        </div>

                        {/* Visual: High-Tech Request Monitor */}
                        <div className="relative flex-1 min-h-[280px] w-full mt-8 md:mt-0">
                            {/* Main Code Window */}
                            <div className="absolute inset-0 bg-[#0F0F0F] rounded-xl border border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-500">
                                {/* Window Header */}
                                <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-500 flex items-center gap-2">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-green-500/90">200 OK</span>
                                        </div>
                                        <span className="w-[1px] h-3 bg-white/10" />
                                        <span>45ms</span>
                                    </div>
                                </div>

                                {/* Request Info Bar */}
                                <div className="px-4 py-2 bg-[#121212] border-b border-white/5 flex items-center gap-3">
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 tracking-wide">POST</span>
                                    <span className="text-xs text-gray-400 font-mono truncate opacity-60">api/v1/generate</span>
                                </div>

                                {/* Code Content */}
                                <div className="p-5 font-mono text-xs overflow-hidden relative flex-1">
                                    <div className="space-y-1.5">
                                        <div className="text-gray-500">{"// Response Body"}</div>
                                        <div className="text-purple-400">{"{"}</div>
                                        <div className="pl-4">
                                            <span className="text-sky-400">"status"</span>: <span className="text-emerald-400">"success"</span>,
                                        </div>
                                        <div className="pl-4">
                                            <span className="text-sky-400">"data"</span>: <span className="text-purple-400">{"{"}</span>
                                        </div>
                                        <div className="pl-8">
                                            <span className="text-sky-400">"id"</span>: <span className="text-orange-300">"chat_8x92"</span>,
                                        </div>
                                        <div className="pl-8">
                                            <span className="text-sky-400">"usage"</span>: <span className="text-purple-400">{"{"}</span>
                                        </div>
                                        <div className="pl-12">
                                            <span className="text-sky-400">"prompt"</span>: <span className="text-yellow-400">45</span>
                                        </div>
                                        <div className="pl-8 text-purple-400">{"}"}</div>
                                        <div className="pl-4 text-purple-400">{"}"}</div>
                                        <div className="text-purple-400">{"}"}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative background elements behind the card */}
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-green-500/20 transition-all duration-500" />
                        </div>
                    </CardSpotlight>

                    {/* Item 2: Community Support (Top Right, 1/3rd) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-4 p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                <FiUsers className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Community Support</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Join our active Discord community. Get help, share your projects, and connect with other developers.
                            </p>
                        </div>

                        {/* Visual: Chat Interface */}
                        <div className="mt-8 bg-[#1a1a1a] rounded-lg border border-white/10 p-4 shadow-inner flex flex-col gap-3 overflow-hidden relative">
                            {/* Header */}
                            <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-1">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-medium text-gray-500"># developers</span>
                            </div>

                            {/* Message 1 */}
                            <div className="flex gap-2 mr-8">
                                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex-shrink-0 border border-indigo-500/30" />
                                <div className="bg-white/5 rounded-2xl rounded-tl-none p-2 border border-white/5">
                                    <div className="h-1.5 w-16 bg-gray-700 rounded-full mb-1.5 opacity-50" />
                                    <div className="h-1.5 w-24 bg-gray-700 rounded-full opacity-50" />
                                </div>
                            </div>

                            {/* Message 2 */}
                            <div className="flex gap-2 ml-8 flex-row-reverse">
                                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex-shrink-0 border border-blue-500/30" />
                                <div className="bg-blue-500/10 rounded-2xl rounded-tr-none p-2 border border-blue-500/20">
                                    <div className="h-1.5 w-20 bg-blue-400/30 rounded-full mb-1.5" />
                                    <div className="h-1.5 w-12 bg-blue-400/30 rounded-full" />
                                </div>
                            </div>
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
