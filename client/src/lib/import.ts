import { db, type ChatMessage, type Conversation } from './db';

interface ChatGPTExport {
  title?: string;
  create_time?: number;
  update_time?: number;
  mapping?: Record<string, {
    id: string;
    message?: {
      id: string;
      author: { role: string };
      content: { parts: string[] };
      create_time: number;
    };
  }>;
}

export async function importChatGPTData(jsonData: any): Promise<{ conversations: number; messages: number }> {
  const conversations: Conversation[] = [];
  const messages: ChatMessage[] = [];
  
  // Handle array of conversations
  const conversationsArray = Array.isArray(jsonData) ? jsonData : [jsonData];
  
  for (const conv of conversationsArray) {
    const chatGPTConv = conv as ChatGPTExport;
    const conversationId = crypto.randomUUID();
    
    // Extract messages from mapping
    const messageNodes = Object.values(chatGPTConv.mapping || {})
      .filter(node => node.message && node.message.content?.parts?.length > 0)
      .sort((a, b) => (a.message?.create_time || 0) - (b.message?.create_time || 0));
    
    if (messageNodes.length === 0) continue;
    
    const conversationMessages: ChatMessage[] = messageNodes.map(node => ({
      conversationId,
      source: 'chatgpt',
      timestamp: new Date((node.message?.create_time || 0) * 1000),
      role: node.message?.author.role === 'user' ? 'user' : 'assistant',
      content: node.message?.content.parts.join('\n') || '',
    }));
    
    const conversation: Conversation = {
      id: conversationId,
      source: 'chatgpt',
      title: chatGPTConv.title || 'Untitled Conversation',
      startDate: conversationMessages[0].timestamp,
      endDate: conversationMessages[conversationMessages.length - 1].timestamp,
      messageCount: conversationMessages.length,
    };
    
    conversations.push(conversation);
    messages.push(...conversationMessages);
  }
  
  // Store in IndexedDB
  await db.conversations.bulkAdd(conversations);
  await db.messages.bulkAdd(messages);
  
  return {
    conversations: conversations.length,
    messages: messages.length,
  };
}

export async function importGenericData(
  jsonData: any,
  source: 'claude' | 'gemini' | 'other'
): Promise<{ conversations: number; messages: number }> {
  // Generic import for other formats
  // This is a placeholder - actual implementation would depend on the specific format
  const conversations: Conversation[] = [];
  const messages: ChatMessage[] = [];
  
  const conversationId = crypto.randomUUID();
  
  // Try to parse as array of messages
  const messageArray = Array.isArray(jsonData) ? jsonData : [jsonData];
  
  const conversationMessages: ChatMessage[] = messageArray.map((msg: any, index: number) => ({
    conversationId,
    source,
    timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
    role: msg.role || (index % 2 === 0 ? 'user' : 'assistant'),
    content: msg.content || msg.text || JSON.stringify(msg),
  }));
  
  if (conversationMessages.length > 0) {
    const conversation: Conversation = {
      id: conversationId,
      source,
      title: 'Imported Conversation',
      startDate: conversationMessages[0].timestamp,
      endDate: conversationMessages[conversationMessages.length - 1].timestamp,
      messageCount: conversationMessages.length,
    };
    
    conversations.push(conversation);
    messages.push(...conversationMessages);
    
    await db.conversations.bulkAdd(conversations);
    await db.messages.bulkAdd(messages);
  }
  
  return {
    conversations: conversations.length,
    messages: messages.length,
  };
}

export async function clearAllData(): Promise<void> {
  await db.messages.clear();
  await db.conversations.clear();
  await db.ideas.clear();
  await db.analysisCache.clear();
}

