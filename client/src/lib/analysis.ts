import nlp from 'compromise';
import { db, type ChatMessage, type Idea } from './db';

export interface TopicAnalysis {
  topic: string;
  count: number;
  percentage: number;
}

export interface SentimentScore {
  score: number; // -1 to 1
  label: 'negative' | 'neutral' | 'positive';
}

export function extractKeywords(text: string, limit: number = 10): string[] {
  const doc = nlp(text);
  
  // Extract nouns and noun phrases
  const nouns = doc.nouns().out('array');
  const topics = doc.topics().out('array');
  
  // Combine and deduplicate
  const combined = [...topics, ...nouns];
  const keywords = Array.from(new Set(combined));
  
  // Filter out common words and return top keywords
  const filtered = keywords
    .filter(k => k.length > 3)
    .slice(0, limit);
  
  return filtered;
}

export function analyzeSentiment(text: string): SentimentScore {
  const doc = nlp(text);
  
  // Simple sentiment analysis based on positive/negative words
  const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'perfect', 'best', 'happy', 'helpful'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor', 'disappointing', 'frustrating', 'difficult'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) score += 1;
    if (negativeWords.some(nw => word.includes(nw))) score -= 1;
  });
  
  // Normalize score
  const normalizedScore = Math.max(-1, Math.min(1, score / Math.max(words.length / 10, 1)));
  
  let label: 'negative' | 'neutral' | 'positive' = 'neutral';
  if (normalizedScore > 0.1) label = 'positive';
  if (normalizedScore < -0.1) label = 'negative';
  
  return { score: normalizedScore, label };
}

export function extractIdeas(text: string): string[] {
  const ideas: string[] = [];
  
  // Look for idea indicators
  const ideaPatterns = [
    /(?:idea|suggestion|concept|thought|plan|proposal)(?:\s+is)?:?\s+([^.!?]+[.!?])/gi,
    /(?:you could|we could|might|perhaps|maybe|consider)(?:\s+try)?(?:\s+to)?\s+([^.!?]+[.!?])/gi,
    /(?:what if|how about|why not)\s+([^.!?]+[.!?])/gi,
  ];
  
  ideaPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match[1] && match[1].trim().length > 10) {
        ideas.push(match[1].trim());
      }
    }
  });
  
  return ideas;
}

export async function analyzeConversationTopics(conversationId: string): Promise<TopicAnalysis[]> {
  const messages = await db.messages
    .where('conversationId')
    .equals(conversationId)
    .toArray();
  
  const allText = messages.map(m => m.content).join(' ');
  const keywords = extractKeywords(allText, 20);
  
  const topicCounts = new Map<string, number>();
  
  keywords.forEach(keyword => {
    const count = messages.filter(m => 
      m.content.toLowerCase().includes(keyword.toLowerCase())
    ).length;
    topicCounts.set(keyword, count);
  });
  
  const total = messages.length;
  const topics: TopicAnalysis[] = Array.from(topicCounts.entries())
    .map(([topic, count]) => ({
      topic,
      count,
      percentage: (count / total) * 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return topics;
}

export async function extractConversationIdeas(conversationId: string): Promise<void> {
  const messages = await db.messages
    .where('conversationId')
    .equals(conversationId)
    .toArray();
  
  const ideas: Idea[] = [];
  
  for (const message of messages) {
    const messageIdeas = extractIdeas(message.content);
    
    messageIdeas.forEach(ideaContent => {
      ideas.push({
        conversationId,
        messageId: message.id!,
        content: ideaContent,
        extractedAt: new Date(),
      });
    });
  }
  
  if (ideas.length > 0) {
    await db.ideas.bulkAdd(ideas);
  }
}

export async function generateConversationSummary(conversationId: string): Promise<string> {
  const messages = await db.messages
    .where('conversationId')
    .equals(conversationId)
    .toArray();
  
  if (messages.length === 0) return 'No messages found.';
  
  const allText = messages.map(m => m.content).join(' ');
  const keywords = extractKeywords(allText, 5);
  const sentiment = analyzeSentiment(allText);
  
  const summary = `This conversation contains ${messages.length} messages discussing ${keywords.join(', ')}. Overall sentiment: ${sentiment.label}.`;
  
  return summary;
}

