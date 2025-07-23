import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { 
  Code, 
  Copy, 
  Eye, 
  Settings, 
  Palette,
  Monitor,
  Smartphone,
  Globe,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { BrandedPatientPortal } from '../patient-experience/BrandedPatientPortal';

interface EmbedConfig {
  practiceName: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  tagline?: string;
  website?: string;
  phone?: string;
  width: string;
  height: string;
  allowFullscreen: boolean;
  showBorder: boolean;
  borderRadius: string;
}

export const EmbeddablePatientPortal: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('configure');
  const [config, setConfig] = useState<EmbedConfig>({
    practiceName: 'My Healthcare Practice',
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
    tagline: 'Your Health, Our Priority',
    width: '100%',
    height: '600px',
    allowFullscreen: true,
    showBorder: true,
    borderRadius: '8px'
  });

  const [embedCode, setEmbedCode] = useState('');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const generateEmbedCode = useCallback(() => {
    const baseUrl = window.location.origin;
    const tenantId = 'demo'; // In real implementation, this would be dynamic
    
    const embedUrl = `${baseUrl}/embedded-portal?` + new URLSearchParams({
      tenant: tenantId,
      practiceName: config.practiceName,
      primaryColor: config.primaryColor,
      secondaryColor: config.secondaryColor,
      tagline: config.tagline || '',
      website: config.website || '',
      phone: config.phone || '',
      logo: config.logo || ''
    }).toString();

    const iframeCode = `<iframe
  src="${embedUrl}"
  width="${config.width}"
  height="${config.height}"
  ${config.allowFullscreen ? 'allowfullscreen' : ''}
  ${config.showBorder ? `style="border: 1px solid #e5e7eb; border-radius: ${config.borderRadius};"` : 'frameborder="0"'}
  title="${config.practiceName} Patient Portal">
</iframe>`;

    setEmbedCode(iframeCode);
  }, [config]);

  // Generate embed code whenever config changes
  useEffect(() => {
    generateEmbedCode();
  }, [generateEmbedCode]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Embed code copied to clipboard"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadHTMLFile = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.practiceName} - Patient Portal</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .portal-container { max-width: 1200px; margin: 0 auto; }
        .portal-header { text-align: center; margin-bottom: 20px; }
        .portal-header h1 { color: ${config.primaryColor}; }
    </style>
</head>
<body>
    <div class="portal-container">
        <div class="portal-header">
            <h1>Welcome to ${config.practiceName}</h1>
            <p>Access your patient portal below</p>
        </div>
        ${embedCode}
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.practiceName.toLowerCase().replace(/\s+/g, '-')}-patient-portal.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Embeddable Patient Portal</h1>
        <p className="text-gray-600 mt-2">
          Create a branded patient portal widget for your practice website
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="configure">Configure</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="embed">Embed Code</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="configure" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Practice Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Practice Information
                </CardTitle>
                <CardDescription>
                  Configure your practice details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="practiceName">Practice Name *</Label>
                  <Input
                    id="practiceName"
                    value={config.practiceName}
                    onChange={(e) => setConfig(prev => ({ ...prev, practiceName: e.target.value }))}
                    placeholder="Your Healthcare Practice"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={config.tagline}
                    onChange={(e) => setConfig(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="Your Health, Our Priority"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    value={config.website}
                    onChange={(e) => setConfig(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourpractice.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={config.phone}
                    onChange={(e) => setConfig(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={config.logo}
                    onChange={(e) => setConfig(prev => ({ ...prev, logo: e.target.value }))}
                    placeholder="https://yourpractice.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Branding & Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Branding & Appearance
                </CardTitle>
                <CardDescription>
                  Customize colors and visual appearance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-20"
                    />
                    <Input
                      value={config.primaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={config.secondaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-20"
                    />
                    <Input
                      value={config.secondaryColor}
                      onChange={(e) => setConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#06B6D4"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width">Width</Label>
                    <Input
                      id="width"
                      value={config.width}
                      onChange={(e) => setConfig(prev => ({ ...prev, width: e.target.value }))}
                      placeholder="100%"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={config.height}
                      onChange={(e) => setConfig(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="600px"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowFullscreen">Allow Fullscreen</Label>
                    <Switch
                      id="allowFullscreen"
                      checked={config.allowFullscreen}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, allowFullscreen: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showBorder">Show Border</Label>
                    <Switch
                      id="showBorder"
                      checked={config.showBorder}
                      onCheckedChange={(checked) => setConfig(prev => ({ ...prev, showBorder: checked }))}
                    />
                  </div>
                </div>

                {config.showBorder && (
                  <div>
                    <Label htmlFor="borderRadius">Border Radius</Label>
                    <Input
                      id="borderRadius"
                      value={config.borderRadius}
                      onChange={(e) => setConfig(prev => ({ ...prev, borderRadius: e.target.value }))}
                      placeholder="8px"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Live Preview
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                  >
                    <Monitor className="w-4 h-4 mr-1" />
                    Desktop
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                  >
                    <Smartphone className="w-4 h-4 mr-1" />
                    Mobile
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Preview how your embedded portal will look on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`mx-auto border rounded-lg overflow-hidden ${
                previewMode === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
              }`} style={{ height: config.height }}>
                <BrandedPatientPortal
                  branding={{
                    practiceName: config.practiceName,
                    logo: config.logo,
                    primaryColor: config.primaryColor,
                    secondaryColor: config.secondaryColor,
                    tagline: config.tagline,
                    website: config.website,
                    phone: config.phone
                  }}
                  isEmbedded={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Embed Code
              </CardTitle>
              <CardDescription>
                Copy this code and paste it into your website
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  value={embedCode}
                  readOnly
                  rows={8}
                  className="font-mono text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(embedCode)}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => copyToClipboard(embedCode)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Embed Code
                </Button>
                <Button variant="outline" onClick={downloadHTMLFile}>
                  <Download className="w-4 h-4 mr-2" />
                  Download HTML File
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Direct Link</CardTitle>
              <CardDescription>
                Use this direct link to access the portal in a new window
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/embedded-portal?tenant=demo`}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => window.open(`${window.location.origin}/embedded-portal?tenant=demo`, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Integration Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Configure your portal</p>
                      <p className="text-sm text-gray-600">Set up practice information and branding</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Copy embed code</p>
                      <p className="text-sm text-gray-600">Get the iframe code from the Embed Code tab</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Paste on your website</p>
                      <p className="text-sm text-gray-600">Add the code to your website where you want the portal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-sm font-medium">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium">Your portal is live!</p>
                      <p className="text-sm text-gray-600">Patients can now access their portal through your site</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Platform Compatibility
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>WordPress</span>
                    <Badge variant="secondary">✓ Compatible</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Squarespace</span>
                    <Badge variant="secondary">✓ Compatible</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Wix</span>
                    <Badge variant="secondary">✓ Compatible</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Webflow</span>
                    <Badge variant="secondary">✓ Compatible</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Custom HTML</span>
                    <Badge variant="secondary">✓ Compatible</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shopify</span>
                    <Badge variant="secondary">✓ Compatible</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> The embedded portal uses secure HTTPS connections and follows 
              HIPAA compliance standards. Patient data is protected with industry-standard encryption.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
};