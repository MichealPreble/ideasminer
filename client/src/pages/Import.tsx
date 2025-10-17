import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { importChatGPTData, importGenericData, clearAllData } from '@/lib/import';
import { toast } from 'sonner';

export default function Import() {
  const [source, setSource] = useState<'chatgpt' | 'claude' | 'gemini' | 'other'>('chatgpt');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);

      let stats;
      if (source === 'chatgpt') {
        stats = await importChatGPTData(jsonData);
      } else {
        stats = await importGenericData(jsonData, source);
      }

      setResult({
        success: true,
        message: `Successfully imported ${stats.conversations} conversations with ${stats.messages} messages`,
      });
      toast.success('Import completed successfully!');
    } catch (error) {
      console.error('Import error:', error);
      setResult({
        success: false,
        message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      toast.error('Import failed. Please check the file format.');
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  }

  async function handleClearData() {
    if (!confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      return;
    }

    try {
      await clearAllData();
      setResult({ success: true, message: 'All data cleared successfully' });
      toast.success('All data cleared');
    } catch (error) {
      console.error('Clear error:', error);
      toast.error('Failed to clear data');
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Import Data</h1>
          <p className="text-muted-foreground">
            Import your AI chat history to start mining insights. All data is processed locally and never leaves your device.
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select AI Platform</CardTitle>
              <CardDescription>
                Choose the source of your chat export file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="source">Platform</Label>
                <Select value={source} onValueChange={(v) => setSource(v as typeof source)}>
                  <SelectTrigger id="source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chatgpt">ChatGPT</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                    <SelectItem value="gemini">Google Gemini</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Upload JSON Export</Label>
                <div className="flex items-center gap-4">
                  <input
                    id="file"
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    disabled={importing}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById('file')?.click()}
                    disabled={importing}
                    className="w-full"
                  >
                    {importing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Choose File
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {result && (
                <div className={`flex items-start gap-2 p-4 rounded-lg ${
                  result.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 mt-0.5" />
                  )}
                  <p className="text-sm">{result.message}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export Instructions</CardTitle>
              <CardDescription>
                How to export your chat history from different platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">ChatGPT</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Go to ChatGPT Settings → Data Controls</li>
                  <li>Click "Export data"</li>
                  <li>Wait for the email with your data export</li>
                  <li>Download and extract the conversations.json file</li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Claude</h3>
                <p className="text-sm text-muted-foreground">
                  Export functionality may vary. Check Claude's settings for data export options.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Other Platforms</h3>
                <p className="text-sm text-muted-foreground">
                  For other platforms, export your chat history as JSON and use the "Other" option.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete all imported data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleClearData}>
                Clear All Data
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

