'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiUser, FiMenu, FiPlus, FiTrash2, FiHome } from 'react-icons/fi';
import { PiBrain } from 'react-icons/pi';
import Link from 'next/link';
import {
  chatQuery,
  chatStream,
  ChatSource,
  getChatHistory,
  createChatSession,
  getChatSession,
  deleteChatSession,
  ChatSession
} from '@/lib/api';
import MarkdownRenderer from './MarkdownRenderer';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: number | string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sources?: ChatSource[];
}

export default function ChatBox() {
  const { userProfile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText]);

  // Fetch chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory();
      setChatHistory(history);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
  };

  const handleNewChat = async () => {
    setMessages([{
      id: 'welcome',
      text: "Hello! I'm your RAG assistant. I can help you find information from your uploaded documents. Upload some documents first, then ask me anything about them!",
      sender: 'bot',
      timestamp: new Date(),
    }]);
    setCurrentSessionId(null);
    setIsSidebarOpen(false);
  };

  const handleLoadSession = async (sessionId: string) => {
    try {
      const session = await getChatSession(sessionId);
      setCurrentSessionId(session._id || session.id || sessionId);

      // Convert API messages to UI messages
      const uiMessages: Message[] = session.messages.map((msg, index) => ({
        id: `${session._id}-${index}`,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot',
        timestamp: new Date(msg.timestamp),
        sources: msg.sources
      }));

      setMessages(uiMessages);
      setIsSidebarOpen(false);
    } catch (error) {
      console.error("Failed to load session:", error);
    }
  };

  const handleDeleteSession = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setDeletingSessionId(sessionId);
    try {
      await deleteChatSession(sessionId);
      setChatHistory(prev => prev.filter(s => (s._id || s.id) !== sessionId));
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
    } finally {
      setDeletingSessionId(null);
    }
  };

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

    let sessionId = currentSessionId;

    try {
      // Use streaming for real-time response
      let fullResponse = '';

      for await (const chunk of chatStream(userQuery, 5, undefined, undefined, sessionId || undefined)) {
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
      
      // Reload chat history to get the new session
      if (!sessionId) {
        await loadChatHistory();
        // Set the current session to the most recent one
        const history = await getChatHistory();
        if (history && history.length > 0) {
          setCurrentSessionId(history[0]._id || history[0].id || null);
        }
      }

    } catch (error: any) {
      console.error('Chat error:', error);

      // Fallback to non-streaming if stream fails
      try {
        const response = await chatQuery(userQuery, 5, undefined, undefined, sessionId || undefined);

        const botMessage: Message = {
          id: Date.now() + 1,
          text: response.answer,
          sender: 'bot',
          timestamp: new Date(),
          sources: response.sources,
        };

        setMessages(prev => [...prev, botMessage]);
        
        // Reload chat history to get the new session
        if (!sessionId) {
          await loadChatHistory();
          const history = await getChatHistory();
          if (history && history.length > 0) {
            setCurrentSessionId(history[0]._id || history[0].id || null);
          }
        }
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
    <div className="flex h-screen bg-black pt-24 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'mr-80' : 'mr-0'}`}>

        {/* Toggle Sidebar Button (Floating) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-24 right-6 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md border border-white/10"
          title={isSidebarOpen ? "Close History" : "Open History"}
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Dashboard Button (Floating) */}
        <Link
          href="/dashboard"
          className="absolute top-24 left-6 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md border border-white/10 group"
          title="Back to Dashboard"
        >
          <FiHome className="w-5 h-5" />
        </Link>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto mt-4" data-lenis-prevent>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-8 flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-lg overflow-hidden ${message.sender === 'user'
                      ? 'bg-white text-black border-2 border-white/20'
                      : 'bg-gradient-to-br from-indigo-500 to-purple-500 border border-white/10'
                      }`}
                  >
                    {message.sender === 'user' ? (
                      userProfile?.photo_url ? (
                        <img 
                          src={userProfile.photo_url} 
                          alt="User" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-5 h-5" />
                      )
                    ) : (
                      <PiBrain className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block max-w-full md:max-w-[85%] rounded-2xl px-6 py-4 shadow-lg backdrop-blur-md ${message.sender === 'user'
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
                    <div className="mt-2 text-xs text-gray-500 px-2 font-medium">
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
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center border border-white/10 shadow-lg">
                  <PiBrain className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-white/5 border border-white/10 rounded-2xl px-6 py-4 max-w-full md:max-w-[85%] backdrop-blur-md shadow-lg">
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
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setInput(question)}
                    className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left text-sm text-gray-300 transition-all hover:scale-[1.02] hover:shadow-lg backdrop-blur-sm"
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
        <div className="p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-end gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 focus-within:border-white/20 transition-colors backdrop-blur-xl shadow-2xl">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask anything about your documents..."
                rows={1}
                className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none max-h-[200px] py-3 px-4 min-h-[50px]"
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all mb-0.5 ${input.trim() && !isTyping
                  ? 'bg-white text-black hover:bg-gray-200 shadow-lg'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
                  }`}
                whileHover={input.trim() && !isTyping ? { scale: 1.05 } : {}}
                whileTap={input.trim() && !isTyping ? { scale: 0.95 } : {}}
              >
                <FiSend className="w-5 h-5" />
              </motion.button>
            </div>
            <p className="mt-3 text-xs text-gray-500 text-center font-medium">
              RAGx AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Chat History */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isSidebarOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-80 bg-black/80 backdrop-blur-xl border-l border-white/10 z-30 pt-24 shadow-2xl"
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Chat History</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <FiMenu className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleNewChat}
            className="w-full mb-6 flex items-center gap-2 px-4 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors shadow-lg"
          >
            <FiPlus className="w-5 h-5" />
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2" data-lenis-prevent>
            {chatHistory.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                <p>No chat history yet.</p>
              </div>
            ) : (
              chatHistory.map((session) => (
                <div
                  key={session._id}
                  className={`group relative rounded-xl transition-colors border ${currentSessionId === session._id
                    ? 'bg-white/10 border-white/20'
                    : 'hover:bg-white/5 border-transparent hover:border-white/10'
                    }`}
                >
                  <button
                    onClick={() => handleLoadSession(session._id)}
                    className="w-full text-left p-3 pr-10"
                  >
                    <div className="text-xs text-gray-500 font-medium mb-1">
                      {new Date(session.updated_at).toLocaleDateString()}
                    </div>
                    <p className="text-sm text-gray-200 truncate font-medium">{session.title}</p>
                  </button>

                  <button
                    onClick={(e) => handleDeleteSession(e, session._id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Chat"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>

      {/* Transparent Loading Overlay for Delete */}
      <AnimatePresence>
        {deletingSessionId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <motion.div
                    className="absolute inset-0 border-4 border-red-500/30 rounded-full"
                  />
                  <motion.div
                    className="absolute inset-0 border-4 border-transparent border-t-red-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-lg">Deleting Chat</p>
                  <p className="text-gray-400 text-sm mt-1">Please wait...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
