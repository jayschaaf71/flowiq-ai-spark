import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Globe, Code, Copy, ExternalLink, Settings } from 'lucide-react';

export const WebsiteIntegration: React.FC = () => {
    const integrations = [
        {
            id: 1,
            type: 'Booking Widget',
            status: 'active',
            url: 'https://yourbusiness.com',
            description: 'Embedded booking widget on homepage'
        },
        {
            id: 2,
            type: 'Customer Portal',
            status: 'active',
            url: 'https://yourbusiness.com/book',
            description: 'Dedicated booking page'
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'inactive': return 'bg-gray-100 text-gray-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const widgetCode = `<script src="https://connect.flow-iq.ai/widget.js"></script>
<div id="flowiq-booking-widget" 
     data-business-id="your-business-id"
     data-theme="light">
</div>`;

    return (
        <div className="space-y-6">
            {/* Current Integrations */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="h-5 w-5" />
                                Website Integrations
                            </CardTitle>
                            <CardDescription>Manage your website integrations</CardDescription>
                        </div>
                        <Button>
                            <Settings className="h-4 w-4 mr-2" />
                            Add Integration
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {integrations.map((integration) => (
                            <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Globe className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{integration.type}</div>
                                        <div className="text-sm text-gray-600">{integration.description}</div>
                                        <div className="text-xs text-gray-500">{integration.url}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(integration.status)}>
                                        {integration.status}
                                    </Badge>
                                    <Button variant="outline" size="sm">
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Widget Code */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Booking Widget Code
                    </CardTitle>
                    <CardDescription>Embed this code on your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Widget Code</Label>
                        <div className="relative">
                            <Textarea
                                value={widgetCode}
                                readOnly
                                rows={6}
                                className="font-mono text-sm"
                            />
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => navigator.clipboard.writeText(widgetCode)}
                            >
                                <Copy className="h-4 w-4 mr-1" />
                                Copy
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Customization Options</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="widgetTheme">Theme</Label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="auto">Auto (follows website)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="widgetPosition">Position</Label>
                                <select className="w-full p-2 border rounded-md">
                                    <option value="inline">Inline</option>
                                    <option value="popup">Popup</option>
                                    <option value="sidebar">Sidebar</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Customer Portal */}
            <Card>
                <CardHeader>
                    <CardTitle>Customer Portal</CardTitle>
                    <CardDescription>Your branded customer booking portal</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Portal URL</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value="https://yourbusiness.flowiq-connect.com"
                                readOnly
                            />
                            <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Visit
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Custom Domain (Optional)</Label>
                        <Input placeholder="book.yourbusiness.com" />
                    </div>

                    <div className="space-y-2">
                        <Label>Portal Branding</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="portalTitle">Portal Title</Label>
                                <Input id="portalTitle" placeholder="Book Your Service" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="portalColor">Primary Color</Label>
                                <Input id="portalColor" type="color" className="w-full h-10" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Integration Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Integration Instructions</CardTitle>
                    <CardDescription>Step-by-step guide to integrate with your website</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <h4 className="font-medium">1. Add Widget to Your Website</h4>
                            <p className="text-sm text-gray-600">
                                Copy the widget code above and paste it into your website where you want the booking form to appear.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">2. Customize Appearance</h4>
                            <p className="text-sm text-gray-600">
                                Use the customization options to match your website's design and branding.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">3. Test the Integration</h4>
                            <p className="text-sm text-gray-600">
                                Make a test booking to ensure everything is working correctly.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium">4. Share Your Portal</h4>
                            <p className="text-sm text-gray-600">
                                Share your customer portal URL with customers for direct bookings.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 