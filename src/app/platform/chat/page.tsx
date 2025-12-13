'use client';

import { motion } from 'framer-motion';
import { FiMessageSquare, FiZap, FiSearch } from 'react-icons/fi';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function ChatPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-400 text-sm font-medium mb-6">
                        <FiMessageSquare className="w-4 h-4" />
                        <span>Context-Aware Chat</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                        Chat with Your Data
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        An intelligent assistant that knows your documents inside and out.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto auto-rows-[minmax(300px,auto)]">

                    {/* Item 1: Real-Time Streaming (Top Left, 2/3rds) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-8 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between group h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="relative z-10 max-w-lg">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                                <FiZap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Real-Time Streaming</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                Experience zero-latency interactions. Our engine streams responses token by token, so you're never left staring at a loading spinner. It feels just like talking to a human.
                            </p>
                        </div>

                        {/* Visual: Typing Simulation */}
                        <div className="absolute bottom-8 right-8 bg-[#1a1a1a] border border-white/10 p-4 rounded-2xl rounded-tr-none w-64 shadow-xl">
                            <div className="flex gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-75" />
                                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse delay-150" />
                            </div>
                            <div className="h-2 w-3/4 bg-gray-700/50 rounded-full mb-2" />
                            <div className="h-2 w-1/2 bg-gray-700/50 rounded-full" />
                        </div>
                    </CardSpotlight>

                    {/* Item 2: Source Citations (Top Right, 1/3rd) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-4 p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                <FiSearch className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Source Citations</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Trust but verify. Every claim includes a clickable link to the exact source page.
                            </p>
                        </div>

                        {/* Visual: Citation Card */}
                        <div className="mt-8 relative h-20">
                            <motion.div
                                className="absolute bottom-0 right-0 bg-blue-500/20 border border-blue-500/50 p-3 rounded-lg text-blue-300 text-xs font-mono flex items-center gap-2 shadow-lg backdrop-blur-md"
                                animate={{ y: [10, 0, 10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <span>📄</span> Page 42, Para 3
                            </motion.div>
                        </div>
                    </CardSpotlight>

                    {/* Item 3: Deep Contextual Memory (Bottom Full Width) */}
                    <CardSpotlight
                        className="col-span-12 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="flex-1 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6 text-pink-400">
                                <FiMessageSquare className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Deep Contextual Memory</h3>
                            <p className="text-gray-400 leading-relaxed text-lg max-w-2xl">
                                RAGx doesn't just answer one-off questions. It remembers the entire conversation history, allowing for multi-step reasoning and follow-up questions like "What did you mean by that?"
                            </p>
                        </div>

                        {/* Visual: Conversation Flow */}
                        <div className="flex-1 w-full max-w-md space-y-4 opacity-80">
                            <div className="flex items-end justify-end gap-2">
                                <div className="bg-purple-600 px-4 py-2 rounded-2xl rounded-br-none text-sm">Summarize the Q3 report.</div>
                                <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0" />
                            </div>
                            <div className="flex items-end justify-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-600 flex-shrink-0" />
                                <div className="bg-gray-800 border border-white/10 px-4 py-2 rounded-2xl rounded-bl-none text-sm text-gray-300">Revenue is up 20%...</div>
                            </div>
                            <div className="flex items-end justify-end gap-2">
                                <div className="bg-purple-600 px-4 py-2 rounded-2xl rounded-br-none text-sm">What drove that growth?</div>
                                <div className="w-6 h-6 rounded-full bg-gray-600 flex-shrink-0" />
                            </div>
                        </div>

                        <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent pointer-events-none"
                        />
                    </CardSpotlight>

                </div>
            </div>
        </div>
    );
}
