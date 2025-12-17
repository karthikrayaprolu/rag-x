'use client';

import { FiShield, FiServer, FiGlobe, FiLock } from 'react-icons/fi';
import Link from 'next/link';

export default function EnterprisePage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/30 pt-32 pb-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

                {/* Hero */}
                <div className="mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-6 uppercase tracking-widest">
                        RagX Enterprise
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight max-w-4xl">
                        Scale your RAG infrastructure with <span className="text-gray-500">complete confidence.</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl">
                        Advanced security, dedicated isolation, and high-throughput pipelines designed for mission-critical applications.
                    </p>
                    <div className="mt-8 flex gap-4">
                        <Link href="/auth" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                            Contact Sales
                        </Link>
                        <Link href="/documentation" className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-colors">
                            View Architecture
                        </Link>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-32">
                    <div className="p-8 border border-white/10 bg-[#0A0A0A] rounded-3xl hover:border-white/20 transition-colors">
                        <FiShield className="w-10 h-10 text-white mb-6" />
                        <h3 className="text-xl font-bold mb-3">Data Sovereignty</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Your data never trains our models. We employ strict logical separation with namespace isolation for every document you upload.
                        </p>
                    </div>
                    <div className="p-8 border border-white/10 bg-[#0A0A0A] rounded-3xl hover:border-white/20 transition-colors">
                        <FiLock className="w-10 h-10 text-white mb-6" />
                        <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
                        <p className="text-gray-400 leading-relaxed">
                            End-to-end encryption for data in transit and at rest. Integration with enterprise identity providers coming soon.
                        </p>
                    </div>
                    <div className="p-8 border border-white/10 bg-[#0A0A0A] rounded-3xl hover:border-white/20 transition-colors">
                        <FiServer className="w-10 h-10 text-white mb-6" />
                        <h3 className="text-xl font-bold mb-3">Dedicated Throughput</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Skip the shared queue. Enterprise plans get dedicated vector processing pipelines for massive document ingestion jobs.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="border-y border-white/10 py-20 mb-32">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">99.9%</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Uptime SLA</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">SOC2</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Compliant Layout</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">Unlim</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Storage Growth</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">24/7</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wider">Priority Support</div>
                        </div>
                    </div>
                </div>

                {/* Integration Architecture */}
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Built for your Private Cloud</h2>
                        <p className="text-gray-400 text-lg mb-8">
                            Need RagX running in your own VPC? We offer self-hosted enterprise containers that give you full control over the infrastructure while we manage the updates.
                        </p>
                        <Link href="#" className="flex items-center gap-2 text-white hover:text-gray-300 font-medium">
                            Read the deployment guide &rarr;
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/20 to-zinc-900/20 blur-3xl -z-10" />
                        <div className="border border-white/10 bg-black rounded-xl p-8 font-mono text-sm leading-relaxed text-gray-400">
                            <div className="flex gap-2 mb-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                            </div>
                            <p><span className="text-purple-400">docker</span> run -d \</p>
                            <p className="pl-4">--name ragx-enterprise \</p>
                            <p className="pl-4">--env LICENSE_KEY=<span className="text-green-400">"ent_..."</span> \</p>
                            <p className="pl-4">--env VPC_network=<span className="text-green-400">"subnet-123"</span> \</p>
                            <p className="pl-4">ragx/core:latest</p>
                            <p className="mt-4 text-green-500 animate-pulse">_ Container started successfully.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
