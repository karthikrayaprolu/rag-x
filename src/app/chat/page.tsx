'use client';

import ChatBox from '../../components/ChatBox';

export default function ChatPage() {
  return (
    // Full screen chat like ChatGPT/Grok - no padding, full height
    <div className="fixed inset-0 bg-black text-white">
      <ChatBox />
    </div>
  );
}