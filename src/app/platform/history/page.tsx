
'use client';

import { motion } from 'framer-motion';
import { FiDatabase, FiClock, FiRotateCcw } from 'react-icons/fi';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function HistoryPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] right-[20%] w-[50%] h-[50%] bg-orange-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-sm font-medium mb-6">
                        <FiDatabase className="w-4 h-4" />
                        <span>Memory & History</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                        Never Lose Context
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Your conversations are valuable assets. We treat them that way.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto auto-rows-[minmax(300px,auto)]">

                    {/* Item 1: Persistent Storage (Top Left, 2/3rds) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-8 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between group h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="relative z-10 max-w-lg">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 text-orange-400">
                                <FiDatabase className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Persistent Storage</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                Every interaction is automatically serialized and stored in our high-availability MongoDB cluster. We use write-ahead logging to ensure zero data loss, even during power outages.
                            </p>
                        </div>

                        {/* Visual: Database Stack */}
                        <div className="absolute top-1/2 right-16 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    className="w-32 h-12 rounded-[100%] border-2 border-orange-500/40 bg-orange-900/20 relative shadow-[0_0_20px_rgba(249,115,22,0.15)]"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 rounded-[100%] border-t border-white/20" />
                                </motion.div>
                            ))}
                            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent blur-xl -z-10" />
                        </div>
                    </CardSpotlight>

                    {/* Item 2: Timeline View (Top Right, 1/3rd) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-4 p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                                <FiClock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Chronological</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Easily scroll back through time to find that one key insight from last month.
                            </p>
                        </div>

                        {/* Visual: Timeline Scroll */}
                        <div className="mt-8 relative h-32 overflow-hidden mask-linear-fade">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
                            <motion.div
                                className="space-y-4 pl-8"
                                animate={{ y: [-20, -100] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            >
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-1.5 w-3 h-3 rounded-full bg-gray-600 border border-black" />
                                        <div className="h-2 w-24 bg-gray-700/50 rounded-full mb-1" />
                                        <div className="h-2 w-16 bg-gray-700/30 rounded-full" />
                                    </div>
                                ))}
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/80 pointer-events-none" />
                        </div>
                    </CardSpotlight>

                    {/* Item 3: Seamless Resume (Bottom Full Width) */}
                    <CardSpotlight
                        className="col-span-12 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="flex-1 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-400">
                                <FiRotateCcw className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Pick Up Where You Left Off</h3>
                            <p className="text-gray-400 leading-relaxed text-lg max-w-2xl">
                                Life happens. Close the tab, switch devices, or come back next year. Your session state is preserved so you never have to re-explain context to the AI.
                            </p>
                        </div>

                        {/* Visual: Play/Pause Interface */}
                        <div className="flex-1 w-full flex items-center justify-center gap-8 opacity-80">
                            <div className="p-4 bg-black/50 border border-white/10 rounded-2xl flex items-center gap-3 grayscale opacity-60">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">⏸</div>
                                <div className="text-xs font-mono text-gray-500">Session Paused<br />2 days ago</div>
                            </div>
                            <div className="text-2xl text-gray-600">→</div>
                            <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black font-bold">▶</div>
                                <div className="text-xs font-mono text-green-400">Resuming...<br />Context Loaded</div>
                            </div>
                        </div>

                        <motion.div
                            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-orange-900/10 to-transparent pointer-events-none"
                        />
                    </CardSpotlight>

                </div>
            </div>
        </div>
    );
}
