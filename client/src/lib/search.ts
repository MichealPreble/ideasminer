import { db, type ChatMessage } from './db';
import nlp from 'compromise';

export interface SearchResult {
  message: ChatMessage;
  relevanceScore: number;
  highlights: string[];
}

export async function searchMessages(query: string, limit: number = 50): Promise<SearchResult[]> {
  const allMessages = await db.messages.toArray();
  const results: SearchResult[] = [];
  
  const queryLower = query.toLowerCase();
  const queryDoc = nlp(query);
  const queryKeywords = queryDoc.terms().out('array').map((t: string) => t.toLowerCase());
  
  for (const message of allMessages) {
    const contentLower = message.content.toLowerCase();
    
    // Exact match
    if (contentLower.includes(queryLower)) {
      const highlights = extractHighlights(message.content, query);
      results.push({
        message,
        relevanceScore: 1.0,
        highlights,
      });
      continue;
    }
    
    // Keyword match
    const messageDoc = nlp(message.content);
    const messageKeywords = messageDoc.terms().out('array').map((t: string) => t.toLowerCase());
    
    const matchingKeywords = queryKeywords.filter((qk: string) => 
      messageKeywords.some((mk: string) => mk.includes(qk) || qk.includes(mk))
    );
    
    if (matchingKeywords.length > 0) {
      const relevanceScore = matchingKeywords.length / queryKeywords.length;
      const highlights = extractHighlights(message.content, matchingKeywords.join(' '));
      
      results.push({
        message,
        relevanceScore,
        highlights,
      });
    }
  }
  
  // Sort by relevance and limit
  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);
}

function extractHighlights(text: string, query: string, contextLength: number = 100): string[] {
  const highlights: string[] = [];
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  let index = textLower.indexOf(queryLower);
  
  while (index !== -1 && highlights.length < 3) {
    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + query.length + contextLength);
    
    let highlight = text.substring(start, end);
    if (start > 0) highlight = '...' + highlight;
    if (end < text.length) highlight = highlight + '...';
    
    highlights.push(highlight);
    index = textLower.indexOf(queryLower, index + 1);
  }
  
  return highlights.length > 0 ? highlights : [text.substring(0, 200) + '...'];
}

export async function searchByDateRange(
  startDate: Date,
  endDate: Date
): Promise<ChatMessage[]> {
  return await db.messages
    .where('timestamp')
    .between(startDate, endDate)
    .toArray();
}

export async function searchBySource(
  source: 'chatgpt' | 'claude' | 'gemini' | 'other'
): Promise<ChatMessage[]> {
  return await db.messages
    .where('source')
    .equals(source)
    .toArray();
}

