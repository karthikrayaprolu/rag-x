"use client";
import React from "react";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { FiCloud, FiCommand, FiCpu, FiGlobe, FiKey, FiLayers, FiTerminal, FiZap } from "react-icons/fi";

const CodeWindow = ({ title, lang, code }: { title: string; lang: string; code: string }) => (
    <div className="w-full h-full bg-[#0e0e0e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col font-mono text-xs ring-1 ring-white/5">
        {/* Window Chrome */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#18181b] border-b border-white/5">
            <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-transparent shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-transparent shadow-inner" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-transparent shadow-inner" />
            </div>
            <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider font-sans select-none">{title}</div>
            <div className="w-12 h-4" />
        </div>

        {/* Code Content */}
        <div className="p-6 md:p-8 overflow-x-auto text-gray-300 leading-relaxed custom-scrollbar selection:bg-white/20">
            <pre dangerouslySetInnerHTML={{ __html: code }} />
        </div>

        {/* Status Bar */}
        <div className="mt-auto px-6 py-2 bg-[#18181b] text-gray-500 border-t border-white/5 flex items-center justify-between text-[10px] font-sans uppercase tracking-widest">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                <span>{lang}</span>
            </div>
            <span>UTF-8</span>
        </div>
    </div>
);

const content = [
    {
        title: "1. Authentication",
        description:
            "Secure your requests with an API Key. Include it in the header of every request to identify your application and track usage quota.",
        content: (
            <CodeWindow
                title="TERMINAL"
                lang="BASH"
                code={`<span class="text-purple-400">curl</span> https://api.ragx.ai/v1/models \\
  <span class="text-yellow-400">-H</span> <span class="text-green-400">"Authorization: Bearer sk_live_..."</span> \\
  <span class="text-yellow-400">-H</span> <span class="text-green-400">"Content-Type: application/json"</span>`}
            />
        ),
    },
    {
        title: "2. Ingest Documents",
        description:
            "Upload knowledge to your vector index. We support PDF, TXT, CSV, and JSON. Files are automatically chunked, embedded, and stored for retrieval.",
        content: (
            <div className="w-full h-full bg-[#0e0e0e] rounded-3xl border border-white/10 p-6 flex flex-col items-center justify-center gap-8 relative overflow-hidden shadow-2xl ring-1 ring-white/5">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />

                {/* Radial Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/10 via-transparent to-transparent pointer-events-none" />

                {/* Visual Animation */}
                <div className="flex items-center gap-6 relative z-10 scale-110">
                    <div className="w-20 h-24 bg-[#18181b] border border-white/10 rounded-xl flex items-center justify-center shadow-xl">
                        <FiLayers className="w-10 h-10 text-gray-500" />
                    </div>

                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-[ping_1.5s_infinite]" />
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-[ping_1.5s_infinite_0.2s]" />
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-[ping_1.5s_infinite_0.4s]" />
                    </div>

                    <div className="w-24 h-24 bg-green-950/30 border border-green-500/20 rounded-2xl flex items-center justify-center relative shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]">
                        <div className="absolute inset-0 bg-green-500/10 blur-xl rounded-full" />
                        <FiCloud className="w-10 h-10 text-green-400 relative z-10 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                    </div>
                </div>

                <div className="text-[10px] text-green-400/80 font-mono relative z-10 bg-green-900/10 px-4 py-1.5 rounded-full border border-green-500/20 uppercase tracking-widest shadow-lg backdrop-blur-sm">
                    POST /v1/upload
                </div>
            </div>
        ),
    },
    {
        title: "3. Chat Completions",
        description:
            "Generate natural language responses grounded in your uploaded data. Use specialized filters to target specific document namespaces.",
        content: (
            <CodeWindow
                title="request.json"
                lang="JSON"
                code={`{
  <span class="text-sky-400">"model"</span>: <span class="text-orange-400">"ragx-turbo"</span>,
  <span class="text-sky-400">"messages"</span>: [
    {
      <span class="text-sky-400">"role"</span>: <span class="text-green-400">"user"</span>,
      <span class="text-sky-400">"content"</span>: <span class="text-green-400">"Summarize Q3 reports"</span>
    }
  ],
  <span class="text-sky-400">"filters"</span>: {
    <span class="text-sky-400">"namespace"</span>: <span class="text-green-400">"finance-2024"</span>
  }
}`}
            />
        ),
    },
    {
        title: "4. Streaming Responses",
        description:
            "Achieve real-time latency with Server-Sent Events (SSE). Receive tokens as they are generated for a snappy user experience.",
        content: (
            <div className="w-full h-full bg-[#0e0e0e] rounded-3xl border border-white/10 overflow-hidden shadow-2xl flex flex-col font-mono text-xs ring-1 ring-white/5 relative">


                {/* Window Chrome */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#18181b] border-b border-white/5">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-transparent shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-transparent shadow-inner" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-transparent shadow-inner" />
                    </div>
                    <div className="text-gray-500 font-medium text-[10px] uppercase tracking-wider font-sans select-none flex items-center gap-2">
                        <span>stream.ts</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="flex items-center">
                        <span className="text-[9px] text-green-500/70 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/10 tracking-widest font-sans font-medium">LIVE</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-hidden relative flex-1 bg-[#0e0e0e]">
                    <div className="space-y-4 relative z-10">
                        <div className="text-gray-600 italic">{"// Receiving token stream..."}</div>
                        <div className="space-y-2 border-l-2 border-white/5 pl-4 ml-1">
                            <div className="flex gap-3 animate-[fadeIn_0.2s_ease-out]">
                                <span className="text-purple-400">data:</span>
                                <span className="text-gray-300">{"{"} "content": "Based" {"}"}</span>
                            </div>
                            <div className="flex gap-3 animate-[fadeIn_0.2s_ease-out_0.1s_both]">
                                <span className="text-purple-400">data:</span>
                                <span className="text-gray-300">{"{"} "content": " on" {"}"}</span>
                            </div>
                            <div className="flex gap-3 animate-[fadeIn_0.2s_ease-out_0.2s_both]">
                                <span className="text-purple-400">data:</span>
                                <span className="text-gray-300">{"{"} "content": " the" {"}"}</span>
                            </div>
                            <div className="flex gap-3 animate-[fadeIn_0.2s_ease-out_0.3s_both]">
                                <span className="text-purple-400">data:</span>
                                <span className="text-gray-300">{"{"} "content": " analysis" {"}"}</span>
                            </div>
                            <div className="flex gap-3 opacity-50">
                                <span className="text-purple-400">data:</span>
                                <div className="w-1.5 h-4 bg-green-500 animate-[pulse_1s_infinite]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="mt-auto px-6 py-2 bg-[#18181b] text-gray-500 border-t border-white/5 flex items-center justify-between text-[10px] font-sans uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>Connected</span>
                    </div>
                    <span>45ms</span>
                </div>
            </div>
        ),
    },
];

export default function DocumentationPage() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20 selection:bg-green-500/30">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-medium mb-8 uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
                        <FiGlobe className="w-3 h-3" />
                        <span>HTTP API Reference</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500">
                        Integrate RagX
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto font-light">
                        Direct REST API access for complete control. Simple, powerful, and built for scale.
                    </p>
                </div>

                {/* Main Content */}
                <div className="max-w-7xl mx-auto">
                    <StickyScroll content={content} />
                </div>
            </div>
        </div>
    );
}
