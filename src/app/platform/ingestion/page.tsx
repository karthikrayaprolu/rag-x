'use client';

import { motion } from 'framer-motion';
import { FiFileText, FiLayers, FiCpu } from 'react-icons/fi';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function IngestionPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-sm font-medium mb-6">
                        <FiLayers className="w-4 h-4" />
                        <span>Smart Ingestion</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                        Data In, Intelligence Out
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Transform your raw documents into a structured knowledge base in seconds.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto auto-rows-[minmax(300px,auto)]">

                    {/* Item 1: Universal Parsing (Top Left, 2/3rds) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-8 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden group h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="relative z-10 max-w-md">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                <FiFileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Universal Parsing</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                Native support for PDF, CSV, TXT, and JSON. Just upload, and we automatically extract text, tables, and metadata without any configuration.
                            </p>
                        </div>

                        {/* Visual: Floating File Icons */}
                        <div className="absolute top-1/2 right-10 -translate-y-1/2 flex flex-col gap-4 opacity-30 group-hover:opacity-60 transition-opacity pointer-events-none">
                            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} className="w-16 h-20 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center text-xs font-bold rotate-6">PDF</motion.div>
                            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="w-16 h-20 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center text-xs font-bold -rotate-3">CSV</motion.div>
                            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="w-16 h-20 bg-gray-800 rounded-lg border border-gray-600 flex items-center justify-center text-xs font-bold rotate-12">JSON</motion.div>
                        </div>
                    </CardSpotlight>

                    {/* Item 2: Semantic Chunking (Top Right, 1/3rd) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-4 p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-400">
                                <FiLayers className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Semantic Chunking</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Preserve context by splitting text based on meaning, not just character count.
                            </p>
                        </div>
                        {/* Visual: Text Slicing */}
                        <div className="mt-8 space-y-2 opacity-50">
                            <div className="h-2 w-full bg-gray-700/50 rounded-full" />
                            <div className="flex gap-2">
                                <div className="h-2 w-1/3 bg-green-500/50 rounded-full" />
                                <div className="h-2 w-2/3 bg-gray-700/50 rounded-full" />
                            </div>
                            <div className="flex gap-2">
                                <div className="h-2 w-2/3 bg-gray-700/50 rounded-full" />
                                <div className="h-2 w-1/3 bg-green-500/50 rounded-full" />
                            </div>
                            <div className="h-2 w-1/2 bg-gray-700/50 rounded-full" />
                        </div>
                    </CardSpotlight>

                    {/* Item 3: AI Embeddings (Bottom Full Width) */}
                    <CardSpotlight
                        className="col-span-12 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="flex-1 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                                <FiCpu className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">High-Dimensional Embeddings</h3>
                            <p className="text-gray-400 leading-relaxed text-lg max-w-2xl">
                                We use OpenAI's latest models to transform your text into 1,536-dimensional vectors. This allows for semantic search that "understands" concepts, even if exact keywords don't match.
                            </p>
                        </div>

                        {/* Visual: Pipeline */}
                        <div className="flex-1 w-full flex items-center justify-center gap-4 opacity-60">
                            <div className="p-4 bg-black border border-white/10 rounded-lg text-xs font-mono">Raw Text</div>
                            <div className="text-purple-400">→</div>
                            <div className="p-4 bg-black border border-purple-500/30 rounded-lg font-mono text-purple-300 text-xs shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                                [0.12, -0.9, 0.4...]
                            </div>
                            <div className="text-purple-400">→</div>
                            <div className="p-4 bg-black border border-white/10 rounded-lg text-2xl">🗄️</div>
                        </div>

                        <motion.div
                            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-500/10 to-transparent pointer-events-none"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        />
                    </CardSpotlight>

                </div>
            </div>
        </div>
    );
}