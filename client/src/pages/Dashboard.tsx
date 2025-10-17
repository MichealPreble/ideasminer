import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { Brain, MessageSquare, Lightbulb, Database } from 'lucide-react';
import { format } from 'date-fns';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalConversations: 0,
    totalMessages: 0,
    totalIdeas: 0,
    dateRange: { start: '', end: '' },
    sources: {} as Record<string, number>,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const conversations = await db.conversations.toArray();
    const messages = await db.messages.toArray();
    const ideas = await db.ideas.toArray();

    const sources: Record<string, number> = {};
    conversations.forEach(conv => {
      sources[conv.source] = (sources[conv.source] || 0) + 1;
    });

    let startDate = '';
    let endDate = '';
    
    if (messages.length > 0) {
      const dates = messages.map(m => m.timestamp).sort((a, b) => a.getTime() - b.getTime());
      startDate = format(dates[0], 'MMM yyyy');
      endDate = format(dates[dates.length - 1], 'MMM yyyy');
    }

    setStats({
      totalConversations: conversations.length,
      totalMessages: messages.length,
      totalIdeas: ideas.length,
      dateRange: { start: startDate, end: endDate },
      sources,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Your personal AI conversation insights at a glance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConversations}</div>
              <p className="text-xs text-muted-foreground">
                {stats.dateRange.start && `${stats.dateRange.start} - ${stats.dateRange.end}`}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                Total exchanges analyzed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ideas Extracted</CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalIdeas}</div>
              <p className="text-xs text-muted-foreground">
                Insights discovered
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Sources</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.sources).length}</div>
              <p className="text-xs text-muted-foreground">
                Different platforms
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>Breakdown of your AI conversations by platform</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(stats.sources).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(stats.sources).map(([source, count]) => (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="capitalize">{source}</span>
                    </div>
                    <span className="text-muted-foreground">{count} conversations</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No data imported yet. Start by importing your chat history.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

