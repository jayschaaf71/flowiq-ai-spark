
import React, { useState } from 'react';
import { EmbeddableBookingWidget } from '@/components/booking/EmbeddableBookingWidget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Eye, Copy, Check } from 'lucide-react';

export const BookingWidgetDemo: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [widgetConfig, setWidgetConfig] = useState({
    theme: 'light' as 'light' | 'dark',
    compact: false,
    practiceId: 'demo-practice'
  });

  const generateEmbedCode = () => {
    return `<!-- Embed this code on your website -->
<div id="booking-widget-container"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = '${window.location.origin}/widget.js';
    script.setAttribute('data-practice-id', '${widgetConfig.practiceId}');
    script.setAttribute('data-theme', '${widgetConfig.theme}');
    script.setAttribute('data-compact', '${widgetConfig.compact}');
    document.head.appendChild(script);
  })();
</script>`;
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Embeddable Booking Widget</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Add this widget to your practice website to allow patients to book appointments 
          and complete their intake process directly from Google search results.
        </p>
      </div>

      <Tabs defaultValue="preview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="embed" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Embed Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Widget Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <select
                    value={widgetConfig.theme}
                    onChange={(e) => setWidgetConfig(prev => ({
                      ...prev, 
                      theme: e.target.value as 'light' | 'dark'
                    }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Layout</label>
                  <select
                    value={widgetConfig.compact ? 'compact' : 'full'}
                    onChange={(e) => setWidgetConfig(prev => ({
                      ...prev, 
                      compact: e.target.value === 'compact'
                    }))}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="full">Full Widget</option>
                    <option value="compact">Compact Button</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Practice ID</label>
                  <input
                    type="text"
                    value={widgetConfig.practiceId}
                    onChange={(e) => setWidgetConfig(prev => ({
                      ...prev, 
                      practiceId: e.target.value
                    }))}
                    className="w-full p-2 border rounded-lg"
                    placeholder="your-practice-id"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Widget Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 p-8 rounded-lg bg-gray-50">
                <EmbeddableBookingWidget
                  practiceId={widgetConfig.practiceId}
                  theme={widgetConfig.theme}
                  compact={widgetConfig.compact}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <p className="text-gray-600">
                Copy this code and paste it anywhere on your website where you want the booking widget to appear.
              </p>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generateEmbedCode()}</code>
                </pre>
                <Button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2"
                  size="sm"
                  variant="secondary"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Integration Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">For Patients:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Book directly from Google search</li>
                    <li>• Complete intake before arrival</li>
                    <li>• No app download required</li>
                    <li>• Mobile-optimized experience</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">For Practices:</h4>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>• Reduce front desk workload</li>
                    <li>• Faster patient check-ins</li>
                    <li>• Pre-appointment preparation</li>
                    <li>• Automated intake processing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
