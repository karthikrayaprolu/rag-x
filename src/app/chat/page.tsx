'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ChatBox from '../../components/ChatBox';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return null;
  }

  return (
    // Full screen chat like ChatGPT/Grok - no padding, full height
    <div className="fixed inset-0 bg-black text-white">
      <ChatBox />
    </div>
  );
}