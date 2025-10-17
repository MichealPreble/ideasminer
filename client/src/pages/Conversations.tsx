import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { db, type Conversation } from '@/lib/db';
import { format } from 'date-fns';
import { Search, MessageSquare } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Conversations() {
  const [, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter(conv =>
        conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.topics?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  async function loadConversations() {
    const convs = await db.conversations.orderBy('endDate').reverse().toArray();
    setConversations(convs);
    setFilteredConversations(convs);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Conversations</h1>
          <p className="text-muted-foreground">
            Browse and search through your AI chat history
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No conversations found matching your search.' : 'No conversations imported yet.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredConversations.map((conv) => (
              <Card key={conv.id} className="hover:border-primary transition-colors cursor-pointer"
                onClick={() => setLocation(`/conversation/${conv.id}`)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{conv.title}</CardTitle>
                      <CardDescription>
                        {format(conv.startDate, 'MMM d, yyyy')} • {conv.messageCount} messages
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {conv.source}
                    </Badge>
                  </div>
                </CardHeader>
                {conv.summary && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{conv.summary}</p>
                  </CardContent>
                )}
                {conv.topics && conv.topics.length > 0 && (
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {conv.topics.slice(0, 5).map((topic, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

