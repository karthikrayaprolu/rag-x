'use client';

import { FiMessageSquare, FiFileText, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';

export default function SolutionsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/30 pt-32 pb-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">

                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-5xl font-bold mb-6 tracking-tight">
                        Built for <span className="text-gray-500">Real-World</span> Intelligence.
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        RagX isn't just a database. It's a semantic engine designed to transform how different industries interact with their proprietary data.
                    </p>
                </div>

                {/* Use Cases Grid */}
                <div className="space-y-32">

                    {/* Case 1: Customer Support */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-800/20 to-transparent rounded-3xl blur-2xl -z-10" />
                            <div className="border border-white/10 bg-[#0A0A0A] rounded-2xl p-8 shadow-2xl">
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-zinc-800 rounded w-3/4" />
                                            <div className="h-4 bg-zinc-800 rounded w-1/2" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 justify-end">
                                        <div className="space-y-2 flex-1 text-right">
                                            <div className="inline-block bg-white/10 text-white text-sm px-4 py-2 rounded-lg text-left">
                                                Based on the 'Refund Policy' document, users are eligible for a full refund within 14 days if usage is under 1,000 tokens.
                                            </div>
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Source: policy_v2.pdf (98% match)</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white flex-shrink-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                                <FiMessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-semibold mb-4">Customer Support Automation</h2>
                            <p className="text-gray-400 text-lg mb-6">
                                Reduce ticket volume by 40% with high-accuracy answers derived directly from your knowledge base. RagX ensures responses are always grounded in your latest documentation.
                            </p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> Instant answers from PDFs & docs</li>
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> Drastic reduction in human triage</li>
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> 24/7 availability for global teams</li>
                            </ul>
                        </div>
                    </div>

                    {/* Case 2: Legal & Research */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                                <FiFileText className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-semibold mb-4">Legal & Document Analysis</h2>
                            <p className="text-gray-400 text-lg mb-6">
                                Stop manually scanning thousands of pages. Upload contracts, briefs, and reports to RagX, then ask complex questions to extract specific clauses, summaries, and contradictions.
                            </p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> Summarize 100+ page contracts in seconds</li>
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> Cross-reference multiple documents</li>
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> Extract key dates and obligations</li>
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tl from-zinc-800/20 to-transparent rounded-3xl blur-2xl -z-10" />
                            <div className="border border-white/10 bg-[#0A0A0A] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-50">
                                    <FiFileText className="w-32 h-32 text-zinc-900" />
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div className="p-4 bg-zinc-900/50 border border-white/5 rounded-lg">
                                        <div className="text-xs text-gray-500 mb-1">QUERY</div>
                                        <div className="text-sm text-white">"What are the termination clauses in the vendor agreements?"</div>
                                    </div>
                                    <div className="p-4 bg-white/5 border border-white/10 rounded-lg">
                                        <div className="text-xs text-green-400 mb-1">EXTRACTED INSIGHT</div>
                                        <div className="text-sm text-gray-300">
                                            Found 3 distinct termination clauses across 5 documents:
                                            <br /><br />
                                            1. <span className="text-white">Mutual Agreement</span> (Vendor A, p.12)
                                            <br />
                                            2. <span className="text-white">Breach of Contract</span> (Vendor B, p.8)
                                            <br />
                                            3. <span className="text-white">Insolvency</span> (All Agreements)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Case 3: Financial Insights */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1 relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/20 to-transparent rounded-3xl blur-2xl -z-10" />
                            <div className="border border-white/10 bg-[#0A0A0A] rounded-2xl p-8 shadow-2xl h-80 flex items-center justify-center">
                                <div className="text-center space-y-4">
                                    <FiTrendingUp className="w-16 h-16 text-zinc-700 mx-auto" />
                                    <div className="text-2xl font-bold text-white">+145% Efficiency</div>
                                    <p className="text-gray-500">In analyst research time</p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 border border-white/10">
                                <FiTrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-3xl font-semibold mb-4">Financial Research</h2>
                            <p className="text-gray-400 text-lg mb-6">
                                Synthesize market reports, earnings calls, and structured CSV data. RagX helps analysts connect the dots between qualitative reports and quantitative data.
                            </p>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> Ingest CSV & Excel data</li>
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> Trend analysis across quarters</li>
                                <li className="flex items-center gap-2"><FiCheckCircle className="text-white" /> Secure data isolation for sensitive info</li>
                            </ul>
                        </div>
                    </div>

                </div>

                {/* CTA */}
                <div className="mt-32 text-center border-t border-white/10 pt-20">
                    <h2 className="text-3xl font-bold mb-6">Ready to solve real problems?</h2>
                    <Link href="/auth" className="inline-block px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors">
                        Start Building Now
                    </Link>
                </div>

            </div>
        </div>
    );
}
