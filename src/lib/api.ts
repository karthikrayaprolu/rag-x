'use client';

import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

/**
 * Wait for Firebase auth to be ready and get the current user
 */
function waitForAuth(): Promise<typeof auth.currentUser> {
  return new Promise((resolve) => {
    if (auth.currentUser) {
      resolve(auth.currentUser);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
    
    // Timeout after 5 seconds
    setTimeout(() => {
      resolve(auth.currentUser);
    }, 5000);
  });
}

/**
 * Get the Firebase auth token for API requests
 */
async function getAuthToken(): Promise<string | null> {
  // Wait for auth to be ready
  const user = await waitForAuth();
  if (!user) return null;
  
  try {
    return await user.getIdToken(true); // Force refresh token
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAuthToken();
  
  const headers: Record<string, string> = {};

  // Add auth header if user is logged in
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // User must be logged in to make API requests
    throw new Error('Please log in to continue');
  }
  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

// ============ Upload API ============

export interface UploadResponse {
  document_id: string;
  filename: string;
  chunks_created: number;
  vectors_stored: number;
  user_id: string;
  message: string;
}

export interface UploadStats {
  namespace: string;
  vector_count: number;
  total_index_vectors: number;
}

/**
 * Upload a document file (PDF, TXT, CSV, XLSX)
 */
export async function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  return apiRequest<UploadResponse>('/upload/document', {
    method: 'POST',
    body: formData,
  });
}

/**
 * Upload raw text content
 */
export async function uploadText(
  text: string,
  sourceName: string = 'direct_input',
  metadata?: Record<string, any>
): Promise<UploadResponse> {
  return apiRequest<UploadResponse>('/upload/text', {
    method: 'POST',
    body: JSON.stringify({
      text,
      source_name: sourceName,
      metadata,
    }),
  });
}

/**
 * Get upload statistics for the current user
 */
export async function getUploadStats(): Promise<UploadStats> {
  return apiRequest<UploadStats>('/upload/stats');
}

/**
 * Delete a specific document
 */
export async function deleteDocument(documentId: string): Promise<{ deleted: boolean; message: string }> {
  return apiRequest('/upload/document', {
    method: 'DELETE',
    body: JSON.stringify({ document_id: documentId }),
  });
}

/**
 * Delete all documents for the current user
 */
export async function deleteAllDocuments(): Promise<{ deleted: boolean; message: string }> {
  return apiRequest('/upload/all', {
    method: 'DELETE',
  });
}

// ============ Chat API ============

export interface ChatSource {
  filename: string | null;
  score: number;
  text_preview: string;
}

export interface ChatResponse {
  answer: string;
  sources: ChatSource[];
  tokens_used: {
    prompt: number;
    completion: number;
    total: number;
  };
}

/**
 * Send a chat query and get a response
 */
export async function chatQuery(
  query: string,
  topK: number = 5,
  filter?: Record<string, any>,
  systemPrompt?: string
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>('/chat/query', {
    method: 'POST',
    body: JSON.stringify({
      query,
      top_k: topK,
      filter,
      system_prompt: systemPrompt,
    }),
  });
}

/**
 * Stream a chat response (returns an async generator)
 */
export async function* chatStream(
  query: string,
  topK: number = 5,
  filter?: Record<string, any>,
  systemPrompt?: string
): AsyncGenerator<string, void, unknown> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Please log in to continue');
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      top_k: topK,
      filter,
      system_prompt: systemPrompt,
    }),
  });

  if (!response.ok) {
    throw new Error(`Stream error: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('No response body');

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          if (data.content) {
            yield data.content;
          }
          if (data.done) {
            return;
          }
        } catch {
          // Skip invalid JSON
        }
      }
    }
  }
}

// ============ Health Check ============

export async function healthCheck(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`);
  return response.json();
}
