'use client';

import { useEffect, useState } from 'react';
import { healthCheck, getApiBaseUrl } from '@/lib/api';

interface BackendStatusProps {
  className?: string;
  showUrl?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function BackendStatus({ 
  className = '', 
  showUrl = false,
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}: BackendStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkStatus = async () => {
    setStatus('checking');
    try {
      await healthCheck();
      setStatus('online');
      setLastChecked(new Date());
    } catch {
      setStatus('offline');
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    checkStatus();
    
    if (autoRefresh) {
      const interval = setInterval(checkStatus, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const statusConfig = {
    checking: {
      color: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400',
      dot: 'bg-yellow-400',
      text: 'Checking...'
    },
    online: {
      color: 'bg-green-500/10 border-green-500/20 text-green-400',
      dot: 'bg-green-400 animate-pulse',
      text: 'Online'
    },
    offline: {
      color: 'bg-red-500/10 border-red-500/20 text-red-400',
      dot: 'bg-red-400',
      text: 'Offline'
    }
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      <button
        onClick={checkStatus}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.color} transition-all hover:scale-105`}
        title="Click to refresh"
      >
        <div className={`w-2 h-2 rounded-full ${config.dot}`} />
        <span className="text-xs font-medium">Backend: {config.text}</span>
      </button>
      
      {showUrl && (
        <div className="text-[10px] text-gray-500 px-3 font-mono truncate max-w-xs">
          {getApiBaseUrl()}
        </div>
      )}
      
      {lastChecked && (
        <div className="text-[10px] text-gray-600 px-3">
          Last checked: {lastChecked.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}
