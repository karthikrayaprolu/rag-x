'use client';

import ChatBox from '../../components/ChatBox';
// Import react-icons
import { FiMessageSquare, FiInfo } from 'react-icons/fi';

export default function ChatPage() {
  return (
    // Updated background to match theme
    <div className="min-h-screen bg-black text-white pt-24 pb-16">
      {/* Background blur shapes */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          {/* Replaced emoji with icon */}
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <FiMessageSquare className="w-8 h-8" /> Chat with Your Data
          </h1>
          <p className="text-gray-400">
            Ask questions and get AI-powered answers from your knowledge base
          </p>
        </div>

        {/* Info Banner */}
        {/* Updated card styling to match theme (removed gradient) */}
        <div className="mb-6 bg-black/40 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
          <p className="text-sm text-gray-300 flex items-start sm:items-center gap-3">
            {/* Replaced emoji with icon */}
            <FiInfo className="w-5 h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>How it works:</strong> Your question → Relevant data
              retrieval from vector DB → LLM generates contextual answer
            </span>
          </p>
        </div>

        {/* This component is imported, styling must be done in its own file */}
        <ChatBox />
      </div>
    </div>
  );
}