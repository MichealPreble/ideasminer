import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { db, type Idea, type Conversation } from '@/lib/db';
import { format } from 'date-fns';
import { Search, Lightbulb, ExternalLink } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Ideas() {
  const [, setLocation] = useLocation();
  const [ideas, setIdeas] = useState<(Idea & { conversation?: Conversation })[]>([]);
  const [filteredIdeas, setFilteredIdeas] = useState<(Idea & { conversation?: Conversation })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadIdeas();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = ideas.filter(idea =>
        idea.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        idea.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredIdeas(filtered);
    } else {
      setFilteredIdeas(ideas);
    }
  }, [searchQuery, ideas]);

  async function loadIdeas() {
    const allIdeas = await db.ideas.orderBy('extractedAt').reverse().toArray();
    
    // Enrich with conversation data
    const enrichedIdeas = await Promise.all(
      allIdeas.map(async (idea) => {
        const conversation = await db.conversations.get(idea.conversationId);
        return { ...idea, conversation };
      })
    );
    
    setIdeas(enrichedIdeas);
    setFilteredIdeas(enrichedIdeas);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Ideas Vault</h1>
          <p className="text-muted-foreground">
            Insights and ideas extracted from your AI conversations
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ideas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredIdeas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'No ideas found matching your search.' : 'No ideas extracted yet.'}
              </p>
              {!searchQuery && (
                <p className="text-sm text-muted-foreground">
                  Analyze your conversations to extract ideas automatically.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    {idea.conversation && (
                      <button
                        onClick={() => setLocation(`/conversation/${idea.conversationId}`)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <CardDescription className="text-xs">
                    {format(idea.extractedAt, 'MMM d, yyyy')}
                    {idea.conversation && ` • ${idea.conversation.title}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{idea.content}</p>
                  
                  {idea.category && (
                    <Badge variant="outline" className="mb-2">
                      {idea.category}
                    </Badge>
                  )}
                  
                  {idea.tags && idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {idea.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

