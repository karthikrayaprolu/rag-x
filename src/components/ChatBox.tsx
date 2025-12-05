'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiMenu, FiPlus } from 'react-icons/fi';
import { PiBrain } from 'react-icons/pi';
import Link from 'next/link';
import { chatQuery, chatStream, ChatSource } from '@/lib/api';
import MarkdownRenderer from './MarkdownRenderer';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: ChatSource[];
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your RAG assistant. I can help you find information from your uploaded documents. Upload some documents first, then ask me anything about them!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userQuery = input.trim();
    const userMessage: Message = {
      id: Date.now(),
      text: userQuery,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setStreamingText('');

    try {
      // Use streaming for real-time response
      let fullResponse = '';
      
      for await (const chunk of chatStream(userQuery)) {
        fullResponse += chunk;
        setStreamingText(fullResponse);
      }

      // After streaming completes, add the full message
      const botMessage: Message = {
        id: Date.now() + 1,
        text: fullResponse || "I couldn't find relevant information in your documents. Please make sure you've uploaded some documents first.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setStreamingText('');
      
    } catch (error: any) {
      console.error('Chat error:', error);
      
      // Fallback to non-streaming if stream fails
      try {
        const response = await chatQuery(userQuery);
        
        const botMessage: Message = {
          id: Date.now() + 1,
          text: response.answer,
          sender: 'bot',
          timestamp: new Date(),
          sources: response.sources,
        };
        
        setMessages(prev => [...prev, botMessage]);
      } catch (fallbackError: any) {
        const errorMessage: Message = {
          id: Date.now() + 1,
          text: `Sorry, I encountered an error: ${fallbackError.message}. Please make sure the backend server is running and you have uploaded some documents.`,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      setIsTyping(false);
      setStreamingText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What documents have I uploaded?",
    "Summarize the main points",
    "What is this document about?",
  ];

  return (
    <div className="flex flex-col h-screen bg-black pt-16">
      {/* Header */}
      {/* <motion.div
        className="fixed top-16 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 bg-black/40 backdrop-blur-xl"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-white flex items-center gap-2">
            <PiBrain className="w-6 h-6" />
            <span>RAGx Chat</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm text-white"
          >
            <FiMenu className="w-4 h-4" />
            Dashboard
          </Link>
          <button
            onClick={() => setMessages([{
              id: Date.now(),
              text: "Hello! I'm your RAG assistant. I can help you find information from your uploaded documents and connected databases. What would you like to know?",
              sender: 'bot',
              timestamp: new Date(),
            }])}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm text-white"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
        </div>
      </motion.div> */}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto mt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mb-8 flex gap-4 ${
                  message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.sender === 'user'
                      ? 'bg-white text-black'
                      : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  }`}
                >
                  {message.sender === 'user' ? (
                    <FiUser className="w-5 h-5" />
                  ) : (
                    <PiBrain className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block max-w-full md:max-w-[85%] rounded-2xl px-5 py-3 ${
                      message.sender === 'user'
                        ? 'bg-white text-black'
                        : 'bg-white/5 text-white border border-white/10'
                    }`}
                  >
                    {message.sender === 'bot' ? (
                      <MarkdownRenderer content={message.text} className="leading-relaxed" />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator / Streaming Response */}
          {(isTyping || streamingText) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex gap-4"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <PiBrain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-5 py-3 max-w-full md:max-w-[85%]">
                  {streamingText ? (
                    <div className="leading-relaxed text-white">
                      <MarkdownRenderer content={streamingText} />
                      <span className="animate-pulse text-purple-400">▊</span>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-400 rounded-full"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0, delay: 0.4 }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Suggested Questions (shown when no messages except initial) */}
          {messages.length === 1 && !isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  onClick={() => setInput(question)}
                  className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-sm text-gray-300 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {question}
                </motion.button>
              ))}
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="relative flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl p-3 focus-within:border-white/20 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask anything about your documents..."
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none max-h-[200px] py-2 px-2"
            />
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                input.trim() && !isTyping
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
              whileHover={input.trim() && !isTyping ? { scale: 1.05 } : {}}
              whileTap={input.trim() && !isTyping ? { scale: 0.95 } : {}}
            >
              <FiSend className="w-5 h-5" />
            </motion.button>
          </div>
          <p className="mt-2 text-xs text-gray-500 text-center">
            RAGx AI may make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
