
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { Palette, Upload, Eye, Globe, Smartphone } from 'lucide-react';

export const TenantBrandingSettings: React.FC = () => {
  const { tenants } = useTenantManagement();
  const [selectedTenant, setSelectedTenant] = useState(tenants?.[0]?.id || '');
  
  const currentTenant = tenants?.find(t => t.id === selectedTenant);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">White-Label Branding</h2>
          <p className="text-gray-600">Customize tenant appearance and branding</p>
        </div>
      </div>

      {/* Tenant Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tenants?.map((tenant) => (
              <div
                key={tenant.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTenant === tenant.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTenant(tenant.id)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: tenant.primary_color }}
                  >
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">{tenant.brand_name}</p>
                    <p className="text-sm text-gray-600">{tenant.specialty}</p>
                  </div>
                </div>
                {tenant.custom_branding_enabled && (
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Custom Branding Enabled
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {currentTenant && (
        <>
          {/* Brand Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Identity</CardTitle>
                <CardDescription>Core branding elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="brand_name">Brand Name</Label>
                  <Input 
                    id="brand_name" 
                    defaultValue={currentTenant.brand_name}
                    className="font-semibold"
                  />
                </div>

                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input 
                    id="tagline" 
                    defaultValue={currentTenant.tagline}
                    placeholder="Your practice tagline"
                  />
                </div>

                <div>
                  <Label htmlFor="logo_upload">Logo Upload</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Drop your logo here or click to browse
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG, SVG up to 2MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Color Scheme</CardTitle>
                <CardDescription>Customize your brand colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary_color">Primary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="primary_color"
                        type="color"
                        defaultValue={currentTenant.primary_color}
                        className="w-16 h-10"
                      />
                      <Input
                        defaultValue={currentTenant.primary_color}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary_color">Secondary Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="secondary_color"
                        type="color"
                        defaultValue={currentTenant.secondary_color}
                        className="w-16 h-10"
                      />
                      <Input
                        defaultValue={currentTenant.secondary_color}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Preview</Label>
                  <div className="grid grid-cols-4 gap-2">
                    <div 
                      className="h-12 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: currentTenant.primary_color }}
                    >
                      Primary
                    </div>
                    <div 
                      className="h-12 rounded-lg flex items-center justify-center text-white text-xs font-medium"
                      style={{ backgroundColor: currentTenant.secondary_color }}
                    >
                      Secondary
                    </div>
                    <div className="h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 text-xs font-medium">
                      Light
                    </div>
                    <div className="h-12 rounded-lg bg-gray-800 flex items-center justify-center text-white text-xs font-medium">
                      Dark
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Domain & URL Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Domain & URL Settings</CardTitle>
              <CardDescription>Configure custom domains and URLs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subdomain">Subdomain</Label>
                    <div className="flex">
                      <Input 
                        id="subdomain" 
                        defaultValue={currentTenant.subdomain}
                        placeholder="yourpractice"
                      />
                      <span className="flex items-center px-3 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                        .flowiq.ai
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="custom_domain">Custom Domain</Label>
                    <Input 
                      id="custom_domain" 
                      defaultValue={currentTenant.domain}
                      placeholder="yourpractice.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Requires DNS configuration
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>URL Preview</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {currentTenant.subdomain ? 
                          `https://${currentTenant.subdomain}.flowiq.ai` : 
                          'https://yourpractice.flowiq.ai'
                        }
                      </span>
                    </div>
                    {currentTenant.domain && (
                      <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
                        <Globe className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">https://{currentTenant.domain}</span>
                        <Badge className="bg-blue-100 text-blue-800">Custom</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="w-5 h-5" />
                  <span>Desktop Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden bg-white">
                  <div 
                    className="h-16 flex items-center px-6"
                    style={{ backgroundColor: currentTenant.primary_color }}
                  >
                    <h3 className="text-white font-semibold">
                      {currentTenant.brand_name}
                    </h3>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-semibold mb-2">
                      Welcome to {currentTenant.brand_name}
                    </h4>
                    <p className="text-gray-600 mb-4">{currentTenant.tagline}</p>
                    <Button 
                      size="sm"
                      style={{ backgroundColor: currentTenant.secondary_color }}
                    >
                      Get Started
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span>Mobile Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-48 mx-auto border rounded-xl overflow-hidden bg-white">
                  <div 
                    className="h-12 flex items-center px-4"
                    style={{ backgroundColor: currentTenant.primary_color }}
                  >
                    <h3 className="text-white font-medium text-sm">
                      {currentTenant.brand_name}
                    </h3>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-sm mb-2">
                      {currentTenant.specialty} Forms
                    </h4>
                    <p className="text-gray-600 text-xs mb-3">
                      Complete your intake form
                    </p>
                    <Button 
                      size="sm" 
                      className="w-full text-xs"
                      style={{ backgroundColor: currentTenant.secondary_color }}
                    >
                      Start Form
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline">Preview Changes</Button>
            <Button>Save Branding Settings</Button>
          </div>
        </>
      )}
    </div>
  );
};
