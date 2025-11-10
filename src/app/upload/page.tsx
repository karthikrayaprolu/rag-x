'use client';

import { useState } from 'react';
import UploadBox from '../../components/UploadBox';
import { motion } from 'framer-motion';
// Import react-icons
import {
  FiUpload,
  FiCpu,
  FiFileText,
  FiGrid,
  FiDatabase,
} from 'react-icons/fi';
import { PiBrain } from 'react-icons/pi';

export default function UploadPage() {
  const [processingStage, setProcessingStage] = useState<string | null>(null);

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
            <FiUpload className="w-8 h-8" /> Upload & Connect
          </h1>
          <p className="text-gray-400">
            Add data sources to your RAG knowledge base
          </p>
        </div>

        {/* Processing Pipeline Info */}
        {/* Updated card styling to match theme (removed gradient) */}
        <div className="mb-8 bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
          {/* Replaced emoji with icon */}
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
            <FiCpu className="w-6 h-6" /> Automatic Processing Pipeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Replaced emojis with icons */}
            <div className="text-center">
              <FiFileText className="w-10 h-10 text-gray-400 mb-3 mx-auto" />
              <div className="text-sm font-semibold text-white mb-1">
                1. Extract
              </div>
              <div className="text-xs text-gray-300">
                Text extraction from files
              </div>
            </div>
            <div className="text-center">
              <FiGrid className="w-10 h-10 text-gray-400 mb-3 mx-auto" />
              <div className="text-sm font-semibold text-white mb-1">
                2. Chunk
              </div>
              <div className="text-xs text-gray-300">
                Split into semantic chunks
              </div>
            </div>
            <div className="text-center">
              <PiBrain className="w-10 h-10 text-gray-400 mb-3 mx-auto" />
              <div className="text-sm font-semibold text-white mb-1">
                3. Embed
              </div>
              <div className="text-xs text-gray-300">
                Convert to vector embeddings
              </div>
            </div>
            <div className="text-center">
              <FiDatabase className="w-10 h-10 text-gray-400 mb-3 mx-auto" />
              <div className="text-sm font-semibold text-white mb-1">
                4. Store
              </div>
              <div className="text-xs text-gray-300">
                Save in vector database
              </div>
            </div>
          </div>
        </div>

        {/* This component is imported, styling must be done in its own file */}
        <UploadBox onProcessingStageChange={setProcessingStage} />

        {/* Processing Status */}
        {processingStage && (
          // Updated card styling to match theme
          <div className="mt-6 bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-3">
              Processing Status
            </h3>
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
              <span className="text-gray-300">{processingStage}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}