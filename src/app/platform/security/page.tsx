'use client';

import { motion } from 'framer-motion';
import { FiLock, FiShield, FiUserCheck } from 'react-icons/fi';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[20%] left-[20%] w-[50%] h-[50%] bg-red-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-red-500 text-sm font-medium mb-6">
                        <FiShield className="w-4 h-4" />
                        <span>Enterprise Grade</span>
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                        Total Data Privacy
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Your data is yours alone. We ensure strict isolation and encryption at rest and in transit.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto auto-rows-[minmax(300px,auto)]">

                    {/* Item 1: Private by Design (Moved from Bottom to Top Left) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-8 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="flex-1 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-gray-500/10 flex items-center justify-center mb-6 text-gray-400">
                                <FiLock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Private by Design</h3>
                            <p className="text-gray-400 leading-relaxed text-lg max-w-2xl">
                                We do not train our models on your data. Your uploaded documents and chat history remain strictly within your isolated environment.
                            </p>
                        </div>

                        {/* Visual: Secure Vault */}
                        <div className="flex-1 w-full flex items-center justify-center opacity-80">
                            <div className="relative w-48 h-48 border-4 border-gray-700 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] bg-[#050505]">
                                <div className="absolute inset-0 rounded-full border-t-4 border-red-500 animate-spin-slow" />
                                <div className="text-6xl">🔒</div>
                                <div className="absolute -bottom-6 bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-xs font-mono border border-green-500/20">
                                    ENCRYPTED
                                </div>
                            </div>
                        </div>

                        <motion.div
                            className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-900/10 to-transparent pointer-events-none"
                        />
                    </CardSpotlight>

                    {/* Item 2: Authenticated Access (Top Right, 1/3rd) - Unchanged Position */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-4 p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                <FiUserCheck className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Authenticated Access</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Integrated with Firebase Auth. Only users with valid types (Google, Email) can generate tokens.
                            </p>
                        </div>

                        {/* Visual: Shield Animation */}
                        <div className="mt-8 flex items-center justify-center relative h-32">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <FiShield className="w-24 h-24 text-gray-800" />
                            </motion.div>
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center text-green-400"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                            >
                                <FiUserCheck className="w-10 h-10" />
                            </motion.div>
                        </div>
                    </CardSpotlight>

                    {/* Item 3: Namespace Isolation (Moved from Top Left to Bottom) */}
                    <CardSpotlight
                        className="col-span-12 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between group h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="relative z-10 max-w-lg">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
                                <FiLock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Namespace Isolation</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                We use Pinecone Namespaces to create logical firewalls between customers. Data from "Company A" is mathematically invisible to "Company B", even though they share the same infrastructure.
                            </p>
                        </div>

                        {/* Visual: Data Silos */}
                        <div className="absolute bottom-10 right-10 flex items-end gap-1 opacity-80 pointer-events-none">
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-xs font-mono text-gray-500">Tenant A</div>
                                <div className="w-24 h-32 border border-white/10 bg-white/5 rounded-t-xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-500/10" />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-blue-500 rounded text-[10px] font-bold">ACCESS</div>
                                </div>
                            </div>
                            <div className="w-[2px] h-40 bg-red-500/50 animate-pulse" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-xs font-mono text-gray-500">Tenant B</div>
                                <div className="w-24 h-32 border border-white/10 bg-white/5 rounded-t-xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-red-500/10 striped-bg" />
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-red-500 rounded text-[10px] font-bold">DENIED</div>
                                </div>
                            </div>
                        </div>
                    </CardSpotlight>

                </div>
            </div>
        </div>
    );
}
