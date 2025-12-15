'use client';

import { motion } from 'framer-motion';
import { FiShield, FiLock, FiCheckCircle, FiServer } from 'react-icons/fi';
import { CardSpotlight } from '@/components/ui/card-spotlight';

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[30%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-medium mb-8 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
                        <FiShield className="w-3 h-3" />
                        <span>Uncompromising Security</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
                        Built for Trust
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
                        Security is not an afterthought. It's the foundation of everything we build.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 gap-6 max-w-6xl mx-auto auto-rows-[minmax(300px,auto)]">

                    {/* Item 1: End-to-End Encryption (Top Left, 2/3rds) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-8 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between group h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="relative z-10 max-w-lg">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 text-blue-400">
                                <FiLock className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">End-to-End Encryption</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                Data is encrypted in transit using TLS 1.3 and at rest using AES-256. Your keys, your data.
                            </p>
                        </div>

                        {/* Visual: Lock Animation */}
                        <div className="absolute top-1/2 right-16 -translate-y-1/2 flex flex-col items-center justify-center opacity-80 pointer-events-none">
                            <div className="relative">
                                <motion.div
                                    className="w-32 h-32 border-4 border-blue-500/30 rounded-full animate-spin-slow-reverse"
                                />
                                <motion.div
                                    className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"
                                />
                                <FiLock className="absolute inset-0 m-auto w-12 h-12 text-blue-400" />
                            </div>
                        </div>
                    </CardSpotlight>

                    {/* Item 2: Strict Isolation (Top Right, 1/3rd) */}
                    <CardSpotlight
                        className="col-span-12 lg:col-span-4 p-8 md:p-10 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden flex flex-col justify-between h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
                                <FiServer className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3">Strict Isolation</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Every customer gets a dedicated text namespace. No data mixing, ever.
                            </p>
                        </div>

                        {/* Visual: Server Isolation */}
                        <div className="mt-8 flex justify-center gap-4 opacity-70">
                            {[1, 2].map(i => (
                                <div key={i} className="w-12 h-24 bg-gray-800 rounded border border-white/10 flex flex-col items-center py-2 gap-1 relative overflow-hidden">
                                    <div className="w-8 h-1 bg-green-500/50 rounded-full animate-pulse" />
                                    <div className="w-8 h-1 bg-gray-600 rounded-full" />
                                    <div className="w-8 h-1 bg-gray-600 rounded-full" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                            ))}
                        </div>
                    </CardSpotlight>

                    {/* Item 3: Compliance Ready (Bottom Full Width) */}
                    <CardSpotlight
                        className="col-span-12 p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center gap-12 relative overflow-hidden h-full"
                        color="rgba(255,255,255,0.15)"
                    >
                        <div className="flex-1 relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 text-green-400">
                                <FiCheckCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">Compliance Ready</h3>
                            <p className="text-gray-400 leading-relaxed text-lg max-w-2xl">
                                We meet or exceed industry standards. GDPR, SOC2, and HIPAA compliant infrastructure ensures you can build with confidence in regulated industries.
                            </p>
                        </div>

                        {/* Visual: Compliance Badges */}
                        <div className="flex-1 w-full flex items-center justify-around gap-4 opacity-80">
                            {["SOC2", "GDPR", "HIPAA", "ISO"].map((badge, i) => (
                                <motion.div
                                    key={i}
                                    className="w-20 h-20 rounded-full border-2 border-green-500/20 bg-green-900/10 flex items-center justify-center text-green-500 font-bold text-xs relative shadow-[0_0_15px_rgba(34,197,94,0.1)]"
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    {badge}
                                    <div className="absolute -bottom-2 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-black text-[8px]">✓</div>
                                </motion.div>
                            ))}
                        </div>
                    </CardSpotlight>

                </div>
            </div>
        </div>
    );
}
