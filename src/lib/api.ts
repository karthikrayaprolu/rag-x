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
 * Make an authenticated API request with retry logic
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retries: number = 3
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

  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`API Request: ${options.method || 'GET'} ${url}`);

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers as Record<string, string>),
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
        const errorMessage = errorData.detail || `API error: ${response.status}`;

        console.error(`API Error [${response.status}]:`, errorMessage);

        // Don't retry on 4xx errors (client errors)
        if (response.status >= 400 && response.status < 500) {
          throw new Error(errorMessage);
        }

        // Retry on 5xx errors (server errors)
        if (attempt < retries) {
          console.log(`Retrying... (${attempt + 1}/${retries})`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`API Success: ${options.method || 'GET'} ${endpoint}`);
      return data;
    } catch (error: any) {
      if (attempt === retries) {
        console.error(`API Request failed after ${retries} retries:`, error);
        throw error;
      }

      // Network errors - retry
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        console.log(`Network error, retrying... (${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        continue;
      }

      throw error;
    }
  }

  throw new Error('Request failed after all retries');
}

// ============ Auth API ============

export interface ApiKeyResponse {
  api_key: string;
}

/**
 * Get the current API Key for the user
 */
export async function getApiKey(): Promise<string> {
  const data = await apiRequest<ApiKeyResponse>('/auth/api-key');
  return data.api_key;
}

/**
 * Generate a new API Key for the user
 */
export async function generateApiKey(): Promise<string> {
  const data = await apiRequest<ApiKeyResponse>('/auth/api-key', {
    method: 'POST'
  });
  return data.api_key;
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
  total_documents: number;
  query_count: number;
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

// ============ Chat History API ============

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  sources?: ChatSource[];
}

export interface ChatSession {
  _id: string;
  id?: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

export async function getChatHistory(): Promise<ChatSession[]> {
  return apiRequest<ChatSession[]>('/history/');
}

export async function createChatSession(title: string = "New Chat"): Promise<ChatSession> {
  return apiRequest<ChatSession>('/history/', {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
}

export async function getChatSession(sessionId: string): Promise<ChatSession> {
  return apiRequest<ChatSession>(`/history/${sessionId}`);
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  return apiRequest<void>(`/history/${sessionId}`, {
    method: 'DELETE',
  });
}

export async function updateChatSession(sessionId: string, title: string): Promise<void> {
  return apiRequest<void>(`/history/${sessionId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
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
  systemPrompt?: string,
  sessionId?: string
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>('/chat/query', {
    method: 'POST',
    body: JSON.stringify({
      query,
      top_k: topK,
      filter,
      system_prompt: systemPrompt,
      session_id: sessionId,
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
  systemPrompt?: string,
  sessionId?: string
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
      session_id: sessionId,
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
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api/v1', '')}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Backend health check passed:', data);
    return data;
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
    throw error;
  }
}

// ============ API Info & Debugging ============

/**
 * Get API base URL for debugging
 */
export function getApiBaseUrl(): string {
  return API_BASE_URL;
}

/**
 * Test API connectivity
 */
export async function testApiConnection(): Promise<{
  connected: boolean;
  latency: number;
  url: string;
  error?: string;
}> {
  const startTime = Date.now();
  try {
    await healthCheck();
    return {
      connected: true,
      latency: Date.now() - startTime,
      url: API_BASE_URL,
    };
  } catch (error: any) {
    return {
      connected: false,
      latency: Date.now() - startTime,
      url: API_BASE_URL,
      error: error.message,
    };
  }
}

// ============ Payment API ============

export interface CheckoutSessionResponse {
  url: string;
}

export async function createCheckoutSession(priceId: string): Promise<CheckoutSessionResponse> {
  return apiRequest<CheckoutSessionResponse>('/payments/create-checkout-session', {
    method: 'POST',
    body: JSON.stringify({ priceId }),
  });
}
