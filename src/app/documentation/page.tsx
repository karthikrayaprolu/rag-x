'use client';

import { motion } from 'framer-motion';
import { FiServer, FiLayers, FiActivity, FiGlobe, FiDatabase, FiShield, FiCpu, FiCode, FiArrowRight, FiFileText, FiMessageSquare, FiUser, FiKey, FiLock } from 'react-icons/fi';

// --- Visual Components ---

const ArchitectureNode = ({ icon: Icon, label, subLabel, color = "gray" }: { icon: any, label: string, subLabel?: string, color?: string }) => {
    const colorClasses: any = {
        gray: "border-white/10 bg-zinc-900 text-gray-400",
        blue: "border-blue-500/30 bg-blue-500/10 text-blue-400",
        green: "border-green-500/30 bg-green-500/10 text-green-400",
        purple: "border-purple-500/30 bg-purple-500/10 text-purple-400",
        orange: "border-orange-500/30 bg-orange-500/10 text-orange-400",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`flex flex-col items-center justify-center p-6 rounded-2xl border ${colorClasses[color]} backdrop-blur-sm shadow-xl min-w-[160px] relative z-10 transition-colors duration-300`}
        >
            <Icon className="w-8 h-8 mb-3" />
            <div className="text-sm font-bold text-white text-center">{label}</div>
            {subLabel && <div className="text-[10px] uppercase tracking-wider font-semibold opacity-70 mt-1">{subLabel}</div>}
        </motion.div>
    );
};

const ConnectionLine = ({ vertical = false, label }: { vertical?: boolean, label?: string }) => (
    <div className={`flex items-center justify-center ${vertical ? 'h-16 w-px flex-col' : 'w-16 h-px'} bg-white/10 relative`}>
        {vertical ? (
            <div className="w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        ) : (
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
        {label && (
            <div className={`absolute ${vertical ? 'left-4' : '-top-6'} text-[10px] text-gray-500 font-mono whitespace-nowrap bg-black/50 px-2 py-1 rounded border border-white/5`}>
                {label}
            </div>
        )}
    </div>
);

const FlowStep = ({ number, title, description, icon: Icon, isLast = false }: { number: string, title: string, description: string, icon: any, isLast?: boolean }) => (
    <div className="flex gap-6 relative">
        {!isLast && <div className="absolute left-6 top-14 bottom-0 w-px bg-white/10" />}
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center flex-shrink-0 z-10 relative">
            <Icon className="w-5 h-5 text-gray-400" />
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white text-black text-[10px] font-bold flex items-center justify-center border-2 border-black">
                {number}
            </div>
        </div>
        <div className="pb-12">
            <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md">{description}</p>
        </div>
    </div>
);

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function DocumentationPage() {
    const { user } = useAuth();
    const router = useRouter();

    const handleApiKeysClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (user) {
            router.push('/dashboard/api-keys');
        } else {
            router.push('/auth');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/30 pt-32 pb-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-6xl">

                {/* Header */}
                <div className="mb-20 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-6 uppercase tracking-widest">
                        <FiLayers className="w-3 h-3" /> System Architecture
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        How RAGx <span className="text-gray-500">Works</span>
                    </h1>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        A visual deep-dive into the microservices, data pipelines, and secure request flows that power the platform.
                    </p>
                </div>

                {/* 1. High Level Architecture Visualization */}
                <div className="mb-32">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="h-8 w-1 bg-white rounded-full" />
                        <h2 className="text-2xl font-bold">Platform Topology</h2>
                    </div>

                    <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 md:p-16 relative overflow-hidden">
                        {/* Background Grid */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative z-10">

                            {/* Client Side */}
                            <div className="flex flex-col gap-6 items-center">
                                <ArchitectureNode icon={FiGlobe} label="User Browser" subLabel="Next.js Client" color="blue" />
                                <ConnectionLine vertical label="JSON / HTTPS" />
                                <ArchitectureNode icon={FiShield} label="Firebase Auth" subLabel="Identity Provider" color="orange" />
                            </div>

                            <ConnectionLine label="Secure Token" />

                            {/* Server Side */}
                            <div className="flex flex-col gap-6 items-center">
                                <div className="p-8 border border-white/10 border-dashed rounded-3xl bg-white/5 relative">
                                    <div className="absolute -top-3 left-6 px-2 bg-[#050505] text-xs text-gray-500 font-mono">BACKEND INFRASTRUCTURE</div>

                                    <div className="flex flex-col items-center gap-8">
                                        <ArchitectureNode icon={FiServer} label="FastAPI Server" subLabel="Request Processing" color="green" />

                                        <div className="grid grid-cols-2 gap-8 w-full">
                                            <div className="flex flex-col items-center gap-4">
                                                <ConnectionLine vertical />
                                                <ArchitectureNode icon={FiDatabase} label="Pinecone" subLabel="Vector Store" color="purple" />
                                            </div>
                                            <div className="flex flex-col items-center gap-4">
                                                <ConnectionLine vertical />
                                                <ArchitectureNode icon={FiLayers} label="MongoDB" subLabel="Metadata & History" color="gray" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Request Flows */}
                <div className="grid lg:grid-cols-2 gap-16 mb-32">

                    {/* Upload Flow */}
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-8 w-1 bg-blue-500 rounded-full" />
                            <h2 className="text-2xl font-bold">Ingestion Pipeline</h2>
                        </div>
                        <div className="pl-4">
                            <FlowStep
                                number="1"
                                icon={FiFileText}
                                title="Document Upload"
                                description="User selects a file (PDF, TXT, CSV). The client requests a secure upload URL and generates a Firebase ID token."
                            />
                            <FlowStep
                                number="2"
                                icon={FiLock}
                                title="Validation & Auth"
                                description="Backend middleware verifies the Firebase token. File size and type are validated against quota limits."
                            />
                            <FlowStep
                                number="3"
                                icon={FiCode}
                                title="Parsing & Chunking"
                                description="The document is parsed into raw text, then split into semantic chunks (overlapping windows) to preserve context."
                            />
                            <FlowStep
                                number="4"
                                icon={FiCpu}
                                title="Embedding Generation"
                                description="Text chunks are sent to OpenAI's embedding model to generate high-dimensional vector representations."
                            />
                            <FlowStep
                                number="5"
                                icon={FiDatabase}
                                title="Vector Upsert"
                                description="Vectors are stored in a dedicated Pinecone index namespace. Metadata is synced to MongoDB."
                                isLast
                            />
                        </div>
                    </div>

                    {/* Chat Flow */}
                    <div>
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-8 w-1 bg-green-500 rounded-full" />
                            <h2 className="text-2xl font-bold">RAG Retrieval Flow</h2>
                        </div>
                        <div className="pl-4">
                            <FlowStep
                                number="1"
                                icon={FiMessageSquare}
                                title="User Query"
                                description="User sends a natural language question. The state includes the active chat session ID."
                            />
                            <FlowStep
                                number="2"
                                icon={FiActivity}
                                title="Semantic Search"
                                description="The query is embedded. We perform a cosine-similarity search against the user's vector namespace to find top-K relevant chunks."
                            />
                            <FlowStep
                                number="3"
                                icon={FiLayers}
                                title="Context Assembly"
                                description="Relevant chunks are injected into a system prompt: 'Answer based only on the provided context...'"
                            />
                            <FlowStep
                                number="4"
                                icon={FiServer}
                                title="LLM Inference"
                                description="The augmented prompt is sent to GPT-4. The model generates a response grounded in the retrieved data."
                            />
                            <FlowStep
                                number="5"
                                icon={FiArrowRight}
                                title="Stream Response"
                                description="Tokens are streamed back to the client via Server-Sent Events (SSE) for minimal latency."
                                isLast
                            />
                        </div>
                    </div>

                </div>

                {/* 3. Authentication & Security */}
                <div className="mb-32">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="h-8 w-1 bg-red-500 rounded-full" />
                        <h2 className="text-2xl font-bold">Security & Authentication</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-red-500/30 transition-colors group">
                            <FiShield className="w-10 h-10 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-3">Token Verification</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                Every API request must carry a valid <code className="text-white/80 bg-white/10 px-1 rounded">Bearer token</code>. The FastAPI backend validates this signature against Google's public keys before executing any logic.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-red-500/30 transition-colors group">
                            <FiKey className="w-10 h-10 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-3">Namespace Isolation</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                User data is logically isolated. When a user queries chunks, the vector database filter is strictly enforced with <code className="text-white/80 bg-white/10 px-1 rounded">namespace: user_id</code> to prevent cross-tenant data leakage.
                            </p>
                        </div>

                        <div className="p-8 rounded-3xl bg-[#0A0A0A] border border-white/10 hover:border-red-500/30 transition-colors group">
                            <FiLock className="w-10 h-10 text-red-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-bold mb-3">Encrypted Storage</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                All documents are encrypted at rest in MongoDB. Vector embeddings in Pinecone are anonymized where possible, storing only semantic representations, not raw PII.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. API Reference Link */}
                <div className="bg-gradient-to-r from-zinc-900 to-black border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent z-0" />
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Ready to implement?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Explore the comprehensive API reference to start building your own RAG pipelines programmatically.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button onClick={handleApiKeysClick} className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                                Get API Keys
                            </button>
                            <a href="https://github.com/karthikrayaprolu/rag-x" className="px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-colors">
                                View Swagger Docs
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
