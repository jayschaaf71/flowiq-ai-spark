
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Upload, Eye, Save } from 'lucide-react';
import { useTenantManagement, Tenant } from '@/hooks/useTenantManagement';

interface TenantBrandingCustomizerProps {
  tenant: Tenant;
}

export const TenantBrandingCustomizer: React.FC<TenantBrandingCustomizerProps> = ({
  tenant
}) => {
  const [brandingData, setBrandingData] = useState({
    brand_name: tenant.brand_name,
    tagline: tenant.tagline || '',
    primary_color: tenant.primary_color,
    secondary_color: tenant.secondary_color,
    logo_url: tenant.logo_url || '',
  });
  const [previewMode, setPreviewMode] = useState(false);
  const { updateTenant, isUpdating } = useTenantManagement();

  const handleSave = () => {
    updateTenant({
      id: tenant.id,
      updates: brandingData
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setBrandingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const previewStyles = {
    '--primary-color': brandingData.primary_color,
    '--secondary-color': brandingData.secondary_color,
  } as React.CSSProperties;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Brand Customization</h3>
          <p className="text-sm text-gray-600">Customize the look and feel for {tenant.brand_name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={handleSave} disabled={isUpdating}>
            <Save className="w-4 h-4 mr-2" />
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <Card style={previewStyles}>
          <CardHeader className="bg-[var(--primary-color)] text-white">
            <CardTitle className="flex items-center gap-3">
              {brandingData.logo_url && (
                <img src={brandingData.logo_url} alt="Logo" className="w-8 h-8 rounded" />
              )}
              {brandingData.brand_name}
            </CardTitle>
            <CardDescription className="text-gray-100">
              {brandingData.tagline}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Button style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                Primary Button
              </Button>
              <Button variant="outline" style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}>
                Secondary Button
              </Button>
              <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)', opacity: 0.1 }}>
                <p>This is how content areas will look with your branding.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="assets">Assets</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic branding information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brand_name">Brand Name</Label>
                  <Input
                    id="brand_name"
                    value={brandingData.brand_name}
                    onChange={(e) => handleInputChange('brand_name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Textarea
                    id="tagline"
                    value={brandingData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="Your company's tagline or motto"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Color Scheme
                </CardTitle>
                <CardDescription>Customize your brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary_color"
                        type="color"
                        value={brandingData.primary_color}
                        onChange={(e) => handleInputChange('primary_color', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={brandingData.primary_color}
                        onChange={(e) => handleInputChange('primary_color', e.target.value)}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        value={brandingData.secondary_color}
                        onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                        className="w-16 h-10"
                      />
                      <Input
                        value={brandingData.secondary_color}
                        onChange={(e) => handleInputChange('secondary_color', e.target.value)}
                        placeholder="#06B6D4"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-3">Color Preview</h4>
                  <div className="flex gap-3">
                    <div 
                      className="w-16 h-16 rounded-lg border-2 border-gray-200"
                      style={{ backgroundColor: brandingData.primary_color }}
                    />
                    <div 
                      className="w-16 h-16 rounded-lg border-2 border-gray-200"
                      style={{ backgroundColor: brandingData.secondary_color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Brand Assets
                </CardTitle>
                <CardDescription>Upload and manage brand assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={brandingData.logo_url}
                    onChange={(e) => handleInputChange('logo_url', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                {brandingData.logo_url && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Logo Preview</h4>
                    <img 
                      src={brandingData.logo_url} 
                      alt="Logo preview" 
                      className="max-w-32 max-h-16 object-contain"
                    />
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg">
                  <Badge variant="secondary" className="mb-2">Coming Soon</Badge>
                  <p className="text-sm text-gray-600">
                    File upload functionality will be available in the next update. For now, please use direct URLs.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
