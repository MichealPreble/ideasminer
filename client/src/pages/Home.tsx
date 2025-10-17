import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Lock, Database, Search, Lightbulb, MessageSquare } from 'lucide-react';
import { useLocation } from 'wouter';

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <Brain className="h-12 w-12 text-primary" />
              <h1 className="text-5xl font-bold">IdeasMiner</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Privacy-focused personal LLM data mining platform. Analyze your AI chat history locally, 
              extract insights, and discover ideas—all without your data ever leaving your device.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => setLocation('/import')}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation('/dashboard')}>
                View Dashboard
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Lock className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Complete Privacy</CardTitle>
                <CardDescription>
                  All data processing happens locally in your browser. Your conversations never leave your device.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Database className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Local Storage</CardTitle>
                <CardDescription>
                  Uses IndexedDB to store your data securely in your browser. No external databases required.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Multi-Platform Support</CardTitle>
                <CardDescription>
                  Import chat history from ChatGPT, Claude, Gemini, and other AI platforms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Search className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Semantic Search</CardTitle>
                <CardDescription>
                  Find conversations by meaning, not just keywords. Understand context and intent.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Idea Extraction</CardTitle>
                <CardDescription>
                  Automatically identify and collect ideas, suggestions, and insights from your chats.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>NLP Analysis</CardTitle>
                <CardDescription>
                  Extract topics, analyze sentiment, and generate summaries using local processing.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Export Your Data</h3>
                <p className="text-muted-foreground">
                  Download your chat history from ChatGPT, Claude, or other AI platforms as JSON files.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Import Locally</h3>
                <p className="text-muted-foreground">
                  Upload your JSON files to IdeasMiner. All processing happens in your browser—no server uploads.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Analyze & Discover</h3>
                <p className="text-muted-foreground">
                  Search conversations, extract ideas, view analytics, and gain insights from your AI interactions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary/10">
        <div className="container max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Start Mining Your Ideas Today</h2>
          <p className="text-muted-foreground mb-8">
            Take control of your AI conversation data with complete privacy and cognitive sovereignty.
          </p>
          <Button size="lg" onClick={() => setLocation('/import')}>
            Import Your First Dataset
          </Button>
        </div>
      </section>
    </div>
  );
}

