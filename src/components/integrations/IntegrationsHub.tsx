import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Calendar,
    Mail,
    CreditCard,
    Database,
    Zap,
    CheckCircle,
    AlertCircle,
    Settings,
    ExternalLink,
    RefreshCw
} from 'lucide-react';

interface Integration {
    id: string;
    name: string;
    category: string;
    description: string;
    status: 'connected' | 'disconnected' | 'pending';
    icon: string;
    isPopular?: boolean;
    isNew?: boolean;
}

export const IntegrationsHub: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const integrations: Integration[] = [
        // Calendar Integrations
        {
            id: 'google-calendar',
            name: 'Google Calendar',
            category: 'Calendar',
            description: 'Sync appointments with Google Calendar',
            status: 'connected',
            icon: '📅',
            isPopular: true
        },
        {
            id: 'outlook-calendar',
            name: 'Outlook Calendar',
            category: 'Calendar',
            description: 'Sync appointments with Outlook Calendar',
            status: 'disconnected',
            icon: '📅'
        },
        {
            id: 'apple-calendar',
            name: 'Apple Calendar',
            category: 'Calendar',
            description: 'Sync appointments with Apple Calendar',
            status: 'disconnected',
            icon: '📅'
        },

        // Payment & Billing
        {
            id: 'stripe',
            name: 'Stripe',
            category: 'Payment',
            description: 'Process payments and subscriptions',
            status: 'connected',
            icon: '💳',
            isPopular: true
        },
        {
            id: 'quickbooks',
            name: 'QuickBooks',
            category: 'Accounting',
            description: 'Sync invoices and financial data',
            status: 'connected',
            icon: '📊',
            isPopular: true
        },
        {
            id: 'xero',
            name: 'Xero',
            category: 'Accounting',
            description: 'Sync invoices and financial data',
            status: 'disconnected',
            icon: '📊'
        },

        // Communication
        {
            id: 'twilio',
            name: 'Twilio',
            category: 'Communication',
            description: 'Send SMS and voice calls',
            status: 'connected',
            icon: '📱',
            isPopular: true
        },
        {
            id: 'sendgrid',
            name: 'SendGrid',
            category: 'Communication',
            description: 'Send transactional emails',
            status: 'connected',
            icon: '📧'
        },
        {
            id: 'mailchimp',
            name: 'Mailchimp',
            category: 'Marketing',
            description: 'Email marketing campaigns',
            status: 'disconnected',
            icon: '📧'
        },

        // CRM & Business Tools
        {
            id: 'salesforce',
            name: 'Salesforce',
            category: 'CRM',
            description: 'Sync customer data and leads',
            status: 'disconnected',
            icon: '👥'
        },
        {
            id: 'hubspot',
            name: 'HubSpot',
            category: 'CRM',
            description: 'Sync customer data and marketing',
            status: 'disconnected',
            icon: '👥'
        },
        {
            id: 'zapier',
            name: 'Zapier',
            category: 'Automation',
            description: 'Connect with 5000+ apps',
            status: 'connected',
            icon: '⚡',
            isPopular: true
        },

        // Industry-Specific
        {
            id: 'service-titan',
            name: 'ServiceTitan',
            category: 'Field Service',
            description: 'Field service management',
            status: 'disconnected',
            icon: '🔧'
        },
        {
            id: 'housecall-pro',
            name: 'Housecall Pro',
            category: 'Field Service',
            description: 'Field service management',
            status: 'disconnected',
            icon: '🔧'
        },
        {
            id: 'mindbody',
            name: 'Mindbody',
            category: 'Wellness',
            description: 'Wellness and fitness management',
            status: 'disconnected',
            icon: '🧘'
        },

        // New Integrations
        {
            id: 'square',
            name: 'Square',
            category: 'Payment',
            description: 'Point of sale and payments',
            status: 'disconnected',
            icon: '💳',
            isNew: true
        },
        {
            id: 'shopify',
            name: 'Shopify',
            category: 'E-commerce',
            description: 'E-commerce platform integration',
            status: 'disconnected',
            icon: '🛒',
            isNew: true
        }
    ];

    const categories = ['All', 'Calendar', 'Payment', 'Communication', 'CRM', 'Automation', 'Field Service', 'Wellness', 'E-commerce', 'Accounting'];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'bg-green-100 text-green-700';
            case 'disconnected': return 'bg-gray-100 text-gray-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'disconnected': return <AlertCircle className="h-4 w-4 text-gray-400" />;
            case 'pending': return <RefreshCw className="h-4 w-4 text-yellow-600" />;
            default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
        }
    };

    const filteredIntegrations = integrations.filter(integration =>
        integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        integration.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Integrations Hub</h2>
                    <p className="text-gray-600">Connect FlowIQ Connect with your favorite tools</p>
                </div>
                <Button>
                    <Zap className="h-4 w-4 mr-2" />
                    Add Integration
                </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Input
                        placeholder="Search integrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                    <Zap className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
                <div className="flex gap-2">
                    {categories.map((category) => (
                        <Button key={category} variant="outline" size="sm">
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Popular Integrations */}
            <Card>
                <CardHeader>
                    <CardTitle>Popular Integrations</CardTitle>
                    <CardDescription>Most commonly used integrations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {integrations
                            .filter(integration => integration.isPopular)
                            .map((integration) => (
                                <div key={integration.id} className="p-4 border rounded-lg">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="text-2xl">{integration.icon}</div>
                                            <div>
                                                <h3 className="font-medium">{integration.name}</h3>
                                                <p className="text-sm text-gray-600">{integration.description}</p>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(integration.status)}>
                                            {integration.status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            {getStatusIcon(integration.status)}
                                            {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                                        </div>
                                        <Button variant="outline" size="sm">
                                            {integration.status === 'connected' ? 'Manage' : 'Connect'}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                    </div>
                </CardContent>
            </Card>

            {/* All Integrations */}
            <Card>
                <CardHeader>
                    <CardTitle>All Integrations</CardTitle>
                    <CardDescription>Browse and connect all available integrations</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredIntegrations.map((integration) => (
                            <div key={integration.id} className="p-4 border rounded-lg">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{integration.icon}</div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium">{integration.name}</h3>
                                                {integration.isNew && (
                                                    <Badge className="bg-blue-100 text-blue-700 text-xs">New</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{integration.description}</p>
                                            <p className="text-xs text-gray-500 mt-1">{integration.category}</p>
                                        </div>
                                    </div>
                                    <Badge className={getStatusColor(integration.status)}>
                                        {integration.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                        {getStatusIcon(integration.status)}
                                        {integration.status === 'connected' ? 'Connected' : 'Not Connected'}
                                    </div>
                                    <div className="flex gap-2">
                                        {integration.status === 'connected' && (
                                            <Button variant="outline" size="sm">
                                                <Settings className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button variant="outline" size="sm">
                                            {integration.status === 'connected' ? 'Manage' : 'Connect'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Integration Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-2xl font-bold">6</p>
                                <p className="text-sm text-gray-600">Connected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-8 w-8 text-gray-600" />
                            <div>
                                <p className="text-2xl font-bold">12</p>
                                <p className="text-sm text-gray-600">Available</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Zap className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-2xl font-bold">24</p>
                                <p className="text-sm text-gray-600">Automations</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Setup Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>Getting Started with Integrations</CardTitle>
                    <CardDescription>Follow these steps to connect your tools</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                1
                            </div>
                            <div>
                                <h4 className="font-medium">Choose Your Integration</h4>
                                <p className="text-sm text-gray-600">
                                    Browse the available integrations and select the ones you need for your business.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                2
                            </div>
                            <div>
                                <h4 className="font-medium">Connect Your Account</h4>
                                <p className="text-sm text-gray-600">
                                    Click "Connect" and follow the authentication process for each integration.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                3
                            </div>
                            <div>
                                <h4 className="font-medium">Configure Settings</h4>
                                <p className="text-sm text-gray-600">
                                    Customize how data flows between FlowIQ Connect and your connected tools.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                4
                            </div>
                            <div>
                                <h4 className="font-medium">Test & Verify</h4>
                                <p className="text-sm text-gray-600">
                                    Test the integration to ensure data is syncing correctly between systems.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 