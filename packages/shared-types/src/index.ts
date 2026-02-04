// ============================================
// AI Sales Trainer — Shared Type Definitions
// ============================================

// --- User ---
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  bio: string | null;
  role: 'USER' | 'ADMIN';
}

// --- Conversation ---
export type ConversationStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface ConversationSummary {
  id: string;
  title: string | null;
  scenario: string;
  status: ConversationStatus;
  duration: number | null;
  createdAt: string;
  overallScore?: number;
}

export interface ConversationDetail extends ConversationSummary {
  messages: TranscriptMessage[];
  analysis: AnalysisResult | null;
}

// --- Messages ---
export type MessageRole = 'USER' | 'ASSISTANT' | 'SYSTEM';

export interface TranscriptMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
}

// --- Analysis ---
export interface AnalysisResult {
  id: string;
  overallScore: number;
  rapport: number;
  discovery: number;
  presentation: number;
  objections: number;
  closing: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export interface AnalysisScores {
  rapport: number;
  discovery: number;
  presentation: number;
  objections: number;
  closing: number;
}

// --- Encryption ---
export interface EncryptedData {
  encrypted: ArrayBuffer;
  iv: Uint8Array;
  salt: Uint8Array;
}

export interface StoredApiKey {
  id: string;
  name: string;
  encrypted: ArrayBuffer;
  iv: Uint8Array;
  salt: Uint8Array;
  createdAt: string;
}

// --- API Responses ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SignedUrlResponse {
  signedUrl: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// --- Scenarios ---
export interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  industry: string;
  buyerPersona: string;
  objectives: string[];
}

// --- ElevenLabs ---
export interface ElevenLabsConfig {
  agentId: string;
  signedUrl: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface VoiceOrbState {
  isActive: boolean;
  isSpeaking: boolean;
  volume: number;
}
