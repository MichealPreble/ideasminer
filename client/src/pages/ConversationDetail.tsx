import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db, type Conversation, type ChatMessage } from '@/lib/db';
import { analyzeConversationTopics, generateConversationSummary, extractConversationIdeas } from '@/lib/analysis';
import { format } from 'date-fns';
import { ArrowLeft, User, Bot, Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ConversationDetail() {
  const [, params] = useRoute('/conversation/:id');
  const [, setLocation] = useLocation();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadConversation(params.id);
    }
  }, [params?.id]);

  async function loadConversation(id: string) {
    const conv = await db.conversations.get(id);
    if (!conv) {
      toast.error('Conversation not found');
      setLocation('/conversations');
      return;
    }

    const msgs = await db.messages.where('conversationId').equals(id).toArray();
    msgs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

    setConversation(conv);
    setMessages(msgs);
  }

  async function handleAnalyze() {
    if (!conversation) return;

    setAnalyzing(true);
    try {
      const topics = await analyzeConversationTopics(conversation.id);
      const summary = await generateConversationSummary(conversation.id);
      await extractConversationIdeas(conversation.id);

      // Update conversation with analysis
      await db.conversations.update(conversation.id, {
        topics: topics.slice(0, 5).map(t => t.topic),
        summary,
      });

      // Reload conversation
      await loadConversation(conversation.id);
      toast.success('Analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button variant="ghost" onClick={() => setLocation('/conversations')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Conversations
        </Button>

        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">{conversation.title}</h1>
              <p className="text-muted-foreground">
                {format(conversation.startDate, 'MMM d, yyyy')} • {conversation.messageCount} messages
              </p>
            </div>
            <Badge variant="outline" className="capitalize">
              {conversation.source}
            </Badge>
          </div>

          {conversation.summary && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{conversation.summary}</p>
              </CardContent>
            </Card>
          )}

          {conversation.topics && conversation.topics.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2">Topics</h3>
              <div className="flex flex-wrap gap-2">
                {conversation.topics.map((topic, idx) => (
                  <Badge key={idx} variant="secondary">
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleAnalyze} disabled={analyzing} className="mb-6">
            {analyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Analyze Conversation
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <Card className={`max-w-3xl ${message.role === 'user' ? 'bg-primary/10' : ''}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <CardDescription>
                      {format(message.timestamp, 'MMM d, yyyy h:mm a')}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

