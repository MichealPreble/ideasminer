import Dexie, { type EntityTable } from 'dexie';

export interface ChatMessage {
  id?: number;
  conversationId: string;
  source: 'chatgpt' | 'claude' | 'gemini' | 'other';
  timestamp: Date;
  role: 'user' | 'assistant';
  content: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  source: 'chatgpt' | 'claude' | 'gemini' | 'other';
  title: string;
  startDate: Date;
  endDate: Date;
  messageCount: number;
  topics?: string[];
  sentiment?: number;
  summary?: string;
}

export interface Idea {
  id?: number;
  conversationId: string;
  messageId: number;
  content: string;
  extractedAt: Date;
  category?: string;
  tags?: string[];
}

export interface AnalysisCache {
  id?: number;
  key: string;
  data: any;
  createdAt: Date;
}

const db = new Dexie('IdeasMinerDB') as Dexie & {
  messages: EntityTable<ChatMessage, 'id'>;
  conversations: EntityTable<Conversation, 'id'>;
  ideas: EntityTable<Idea, 'id'>;
  analysisCache: EntityTable<AnalysisCache, 'id'>;
};

db.version(1).stores({
  messages: '++id, conversationId, source, timestamp, role',
  conversations: 'id, source, startDate, endDate',
  ideas: '++id, conversationId, messageId, extractedAt',
  analysisCache: '++id, key, createdAt',
});

export { db };

