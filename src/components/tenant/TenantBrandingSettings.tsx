
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Brush, Image, Settings } from 'lucide-react';

export const TenantBrandingSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Branding Settings</h2>
        <p className="text-gray-600">Configure tenant-specific branding and customization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5 text-blue-600" />
              <span>Color Themes</span>
            </CardTitle>
            <CardDescription>Manage color schemes for different tenants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Primary Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded border"></div>
                  <input type="color" defaultValue="#3b82f6" className="w-8 h-8 rounded border" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Secondary Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-600 rounded border"></div>
                  <input type="color" defaultValue="#8b5cf6" className="w-8 h-8 rounded border" />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Accent Color</label>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded border"></div>
                  <input type="color" defaultValue="#059669" className="w-8 h-8 rounded border" />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Preset Themes</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <div className="flex gap-1 mb-1">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                  <p className="text-xs">Default</p>
                </div>
                <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <div className="flex gap-1 mb-1">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  </div>
                  <p className="text-xs">Warm</p>
                </div>
                <div className="p-2 border rounded cursor-pointer hover:bg-gray-50">
                  <div className="flex gap-1 mb-1">
                    <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                  <p className="text-xs">Professional</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brush className="w-5 h-5 text-purple-600" />
              <span>Typography</span>
            </CardTitle>
            <CardDescription>Font and text styling options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Heading Font</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="inter">Inter (Default)</option>
                  <option value="roboto">Roboto</option>
                  <option value="open-sans">Open Sans</option>
                  <option value="lato">Lato</option>
                  <option value="montserrat">Montserrat</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Body Font</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="inter">Inter (Default)</option>
                  <option value="roboto">Roboto</option>
                  <option value="open-sans">Open Sans</option>
                  <option value="source-sans">Source Sans Pro</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Font Size Scale</label>
                <select className="w-full p-2 border rounded-md">
                  <option value="small">Compact</option>
                  <option value="medium">Standard (Default)</option>
                  <option value="large">Comfortable</option>
                </select>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <h3 className="text-lg font-semibold mb-1">Sample Heading</h3>
              <p className="text-sm">This is how body text will appear with your selected typography settings.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Image className="w-5 h-5 text-green-600" />
              <span>Logo Management</span>
            </CardTitle>
            <CardDescription>Upload and manage tenant logos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                  <Image className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Drop your logo here or click to browse</p>
                  <input type="file" accept="image/*" className="hidden" id="primary-logo" />
                  <label htmlFor="primary-logo" className="cursor-pointer">
                    <button className="text-sm text-blue-600 hover:text-blue-700">Choose File</button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">Recommended: 200x60px, PNG or SVG</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Favicon</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-green-400 transition-colors">
                  <div className="w-8 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600 mb-2">Upload favicon</p>
                  <input type="file" accept="image/*" className="hidden" id="favicon-upload" />
                  <label htmlFor="favicon-upload" className="cursor-pointer">
                    <button className="text-sm text-blue-600 hover:text-blue-700">Choose File</button>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">32x32px, ICO or PNG</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Logo Guidelines:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-resolution images for crisp display</li>
                <li>• Ensure good contrast for readability</li>
                <li>• Test logos on both light and dark backgrounds</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-orange-600" />
              <span>White Label</span>
            </CardTitle>
            <CardDescription>Remove platform branding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Settings className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">White Label Options</h3>
              <p className="text-gray-600">Complete branding removal for enterprise clients</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
