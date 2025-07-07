import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Code,
  Copy,
  Eye,
  Settings,
  Monitor,
  Smartphone,
  Tablet,
  ExternalLink
} from 'lucide-react';

export const IframeWidget = () => {
  const { toast } = useToast();
  const [widgetConfig, setWidgetConfig] = useState({
    practiceId: 'demo-practice',
    providerId: '',
    locationId: '',
    themeColor: '#3B82F6',
    showFollowups: true,
    width: '100%',
    height: '600px',
    borderRadius: '8px'
  });

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const generateEmbedCode = () => {
    const params = new URLSearchParams();
    params.set('practice_id', widgetConfig.practiceId);
    if (widgetConfig.providerId) params.set('provider_id', widgetConfig.providerId);
    if (widgetConfig.locationId) params.set('location_id', widgetConfig.locationId);
    params.set('theme_color', widgetConfig.themeColor.replace('#', ''));
    params.set('show_followups', widgetConfig.showFollowups.toString());

    const embedUrl = `${window.location.origin}/widget?${params.toString()}`;

    return `<iframe 
  src="${embedUrl}"
  width="${widgetConfig.width}"
  height="${widgetConfig.height}"
  frameborder="0"
  style="border-radius: ${widgetConfig.borderRadius}; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);"
  allow="clipboard-write"
  title="Appointment IQ Booking Widget">
</iframe>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    toast({
      title: "Copied!",
      description: "Embed code copied to clipboard"
    });
  };

  const openInNewTab = () => {
    const params = new URLSearchParams();
    params.set('practice_id', widgetConfig.practiceId);
    if (widgetConfig.providerId) params.set('provider_id', widgetConfig.providerId);
    if (widgetConfig.locationId) params.set('location_id', widgetConfig.locationId);
    params.set('theme_color', widgetConfig.themeColor.replace('#', ''));
    params.set('show_followups', widgetConfig.showFollowups.toString());

    const testUrl = `${window.location.origin}/widget?${params.toString()}`;
    window.open(testUrl, '_blank');
  };

  const getDeviceWidth = () => {
    switch (previewDevice) {
      case 'mobile': return '320px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  const getDeviceHeight = () => {
    switch (previewDevice) {
      case 'mobile': return '500px';
      case 'tablet': return '600px';
      default: return '600px';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Iframe Widget Builder</CardTitle>
              <CardDescription>
                Create embeddable booking widgets for your website
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Widget Configuration</h3>
              
              <div className="space-y-2">
                <Label htmlFor="practice-id">Practice ID</Label>
                <Input
                  id="practice-id"
                  value={widgetConfig.practiceId}
                  onChange={(e) => setWidgetConfig({ ...widgetConfig, practiceId: e.target.value })}
                  placeholder="your-practice-id"
                />
                <p className="text-sm text-muted-foreground">
                  Your unique practice identifier
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider-id">Provider ID (Optional)</Label>
                <Input
                  id="provider-id"
                  value={widgetConfig.providerId}
                  onChange={(e) => setWidgetConfig({ ...widgetConfig, providerId: e.target.value })}
                  placeholder="specific-provider-id"
                />
                <p className="text-sm text-muted-foreground">
                  Pre-select a specific provider
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location-id">Location ID (Optional)</Label>
                <Input
                  id="location-id"
                  value={widgetConfig.locationId}
                  onChange={(e) => setWidgetConfig({ ...widgetConfig, locationId: e.target.value })}
                  placeholder="specific-location-id"
                />
                <p className="text-sm text-muted-foreground">
                  Pre-select a specific location
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme-color">Theme Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="theme-color"
                    type="color"
                    value={widgetConfig.themeColor}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, themeColor: e.target.value })}
                    className="w-20"
                  />
                  <Input
                    value={widgetConfig.themeColor}
                    onChange={(e) => setWidgetConfig({ ...widgetConfig, themeColor: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Widget Dimensions</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="width" className="text-sm">Width</Label>
                    <Input
                      id="width"
                      value={widgetConfig.width}
                      onChange={(e) => setWidgetConfig({ ...widgetConfig, width: e.target.value })}
                      placeholder="100%"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-sm">Height</Label>
                    <Input
                      id="height"
                      value={widgetConfig.height}
                      onChange={(e) => setWidgetConfig({ ...widgetConfig, height: e.target.value })}
                      placeholder="600px"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="border-radius">Border Radius</Label>
                <Input
                  id="border-radius"
                  value={widgetConfig.borderRadius}
                  onChange={(e) => setWidgetConfig({ ...widgetConfig, borderRadius: e.target.value })}
                  placeholder="8px"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-followups"
                  checked={widgetConfig.showFollowups}
                  onChange={(e) => setWidgetConfig({ ...widgetConfig, showFollowups: e.target.checked })}
                />
                <Label htmlFor="show-followups">Show follow-up options</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Preview</h3>
                <div className="flex gap-2">
                  <Button
                    variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('tablet')}
                  >
                    <Tablet className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div 
                  className="mx-auto bg-white rounded-lg shadow-sm"
                  style={{ 
                    width: getDeviceWidth(),
                    height: getDeviceHeight(),
                    maxWidth: '100%'
                  }}
                >
                  <div 
                    className="w-full h-full rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: widgetConfig.themeColor + '10',
                      borderRadius: widgetConfig.borderRadius 
                    }}
                  >
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center"
                        style={{ backgroundColor: widgetConfig.themeColor }}
                      >
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm text-gray-600">Widget Preview</p>
                      <p className="text-xs text-gray-500">{previewDevice}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Embed Code</CardTitle>
          <CardDescription>
            Copy this code and paste it into your website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={copyEmbedCode}>
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
            <Button variant="outline" onClick={openInNewTab}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Test in New Tab
            </Button>
          </div>
          
          <Textarea
            readOnly
            value={generateEmbedCode()}
            className="font-mono text-sm"
            rows={10}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Examples</CardTitle>
          <CardDescription>
            Common ways to embed the widget
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Website Footer</h4>
              <p className="text-sm text-gray-600 mb-3">
                Add booking widget to your site footer for easy access
              </p>
              <Badge variant="outline">HTML</Badge>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Contact Page</h4>
              <p className="text-sm text-gray-600 mb-3">
                Replace contact forms with direct booking capability
              </p>
              <Badge variant="outline">WordPress</Badge>
            </div>
            
            <div className="border rounded-lg p-4">
              <h4 className="font-medium mb-2">Patient Portal</h4>
              <p className="text-sm text-gray-600 mb-3">
                Embed in existing patient dashboard systems
              </p>
              <Badge variant="outline">React</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Widget Communication</CardTitle>
          <CardDescription>
            Listen to widget events using postMessage API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            readOnly
            value={`// Listen for widget events
window.addEventListener('message', function(event) {
  if (event.origin !== '${window.location.origin}') return;
  
  switch (event.data.type) {
    case 'appointment_booked':
      console.log('Appointment booked:', event.data.appointment);
      // Handle successful booking
      break;
      
    case 'widget_loaded':
      console.log('Widget loaded successfully');
      break;
      
    case 'booking_cancelled':
      console.log('User cancelled booking');
      break;
  }
});`}
            className="font-mono text-sm"
            rows={15}
          />
        </CardContent>
      </Card>
    </div>
  );
};