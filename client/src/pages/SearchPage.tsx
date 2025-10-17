import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { searchMessages, type SearchResult } from '@/lib/search';
import { format } from 'date-fns';
import { Search, Loader2, User, Bot } from 'lucide-react';
import { useLocation } from 'wouter';

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    setSearched(true);
    
    try {
      const searchResults = await searchMessages(query);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">
            Search through your AI conversations with semantic understanding
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ask a question or search for keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={searching || !query.trim()}>
              {searching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </>
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </form>

        {searched && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Found {results.length} result{results.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        <div className="space-y-4">
          {results.map((result, idx) => (
            <Card 
              key={idx} 
              className="hover:border-primary transition-colors cursor-pointer"
              onClick={() => setLocation(`/conversation/${result.message.conversationId}`)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {result.message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <CardDescription>
                      {format(result.message.timestamp, 'MMM d, yyyy h:mm a')}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {result.message.source}
                    </Badge>
                    <Badge variant="secondary">
                      {Math.round(result.relevanceScore * 100)}% match
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {result.highlights.map((highlight, hIdx) => (
                  <p key={hIdx} className="text-sm mb-2 last:mb-0">
                    {highlight}
                  </p>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {searched && results.length === 0 && !searching && (
          <Card>
            <CardContent className="py-12 text-center">
              <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No results found for "{query}". Try different keywords or rephrase your search.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

