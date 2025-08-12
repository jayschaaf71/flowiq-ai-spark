import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Brain,
    MessageSquare,
    Phone,
    Calendar,
    FileText,
    Bot,
    Zap,
    Settings,
    Play,
    Pause,
    Volume2,
    Mail,
    MessageCircle,
    Clock,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    Users,
    CreditCard,
    Shield,
    Globe,
    Sparkles
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AIIntegration {
    id: string;
    name: string;
    description: string;
    icon: React.ComponentType<any>;
    status: 'active' | 'inactive' | 'configuring';
    category: 'communication' | 'scheduling' | 'billing' | 'analytics' | 'automation';
    features: string[];
    configOptions: {
        key: string;
        label: string;
        type: 'text' | 'textarea' | 'select' | 'switch';
        value: any;
        options?: string[];
    }[];
}

export const AIIntegrationsHub: React.FC = () => {
    const [selectedIntegration, setSelectedIntegration] = useState<AIIntegration | null>(null);
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [configValues, setConfigValues] = useState<Record<string, any>>({});

    const aiIntegrations: AIIntegration[] = [
        {
            id: 'voice-ai',
            name: 'Voice AI Assistant',
            description: 'AI-powered voice calls with natural language processing',
            icon: Phone,
            status: 'active',
            category: 'communication',
            features: [
                'Natural language understanding',
                'Call routing and screening',
                'Appointment scheduling via voice',
                'Customer service automation',
                'Multi-language support'
            ],
            configOptions: [
                { key: 'greeting', label: 'Greeting Message', type: 'textarea', value: 'Hello, thank you for calling. How can I help you today?' },
                { key: 'language', label: 'Primary Language', type: 'select', value: 'English', options: ['English', 'Spanish', 'French'] },
                { key: 'callScreening', label: 'Enable Call Screening', type: 'switch', value: true },
                { key: 'appointmentBooking', label: 'Allow Appointment Booking', type: 'switch', value: true }
            ]
        },
        {
            id: 'chat-ai',
            name: 'Chat AI Assistant',
            description: 'Intelligent chat bot for customer inquiries and support',
            icon: MessageSquare,
            status: 'active',
            category: 'communication',
            features: [
                '24/7 customer support',
                'FAQ automation',
                'Service booking via chat',
                'Payment processing',
                'Multi-channel integration'
            ],
            configOptions: [
                { key: 'welcomeMessage', label: 'Welcome Message', type: 'textarea', value: 'Hi! I\'m your AI assistant. How can I help you today?' },
                { key: 'responseTime', label: 'Response Time (seconds)', type: 'text', value: '2' },
                { key: 'autoBooking', label: 'Auto-booking Enabled', type: 'switch', value: true },
                { key: 'paymentIntegration', label: 'Payment Integration', type: 'switch', value: true }
            ]
        },
        {
            id: 'scheduling-ai',
            name: 'Smart Scheduling AI',
            description: 'AI-powered appointment scheduling and optimization',
            icon: Calendar,
            status: 'active',
            category: 'scheduling',
            features: [
                'Intelligent slot optimization',
                'Customer preference learning',
                'Conflict resolution',
                'Automated reminders',
                'Predictive scheduling'
            ],
            configOptions: [
                { key: 'optimizationLevel', label: 'Optimization Level', type: 'select', value: 'High', options: ['Low', 'Medium', 'High'] },
                { key: 'learningEnabled', label: 'Enable Learning', type: 'switch', value: true },
                { key: 'autoReminders', label: 'Auto Reminders', type: 'switch', value: true },
                { key: 'predictiveScheduling', label: 'Predictive Scheduling', type: 'switch', value: true }
            ]
        },
        {
            id: 'billing-ai',
            name: 'Billing AI Assistant',
            description: 'Automated billing, invoicing, and payment processing',
            icon: CreditCard,
            status: 'active',
            category: 'billing',
            features: [
                'Automatic invoice generation',
                'Payment processing',
                'Late payment detection',
                'Financial reporting',
                'Tax calculation'
            ],
            configOptions: [
                { key: 'autoInvoicing', label: 'Auto Invoice Generation', type: 'switch', value: true },
                { key: 'paymentReminders', label: 'Payment Reminders', type: 'switch', value: true },
                { key: 'latePaymentDetection', label: 'Late Payment Detection', type: 'switch', value: true },
                { key: 'taxCalculation', label: 'Auto Tax Calculation', type: 'switch', value: true }
            ]
        },
        {
            id: 'analytics-ai',
            name: 'Business Intelligence AI',
            description: 'AI-powered analytics and business insights',
            icon: TrendingUp,
            status: 'active',
            category: 'analytics',
            features: [
                'Revenue forecasting',
                'Customer behavior analysis',
                'Performance optimization',
                'Trend identification',
                'Predictive analytics'
            ],
            configOptions: [
                { key: 'forecastingEnabled', label: 'Revenue Forecasting', type: 'switch', value: true },
                { key: 'behaviorAnalysis', label: 'Customer Behavior Analysis', type: 'switch', value: true },
                { key: 'performanceTracking', label: 'Performance Tracking', type: 'switch', value: true },
                { key: 'reportingFrequency', label: 'Reporting Frequency', type: 'select', value: 'Weekly', options: ['Daily', 'Weekly', 'Monthly'] }
            ]
        },
        {
            id: 'automation-ai',
            name: 'Workflow Automation AI',
            description: 'Intelligent workflow automation and task management',
            icon: Zap,
            status: 'configuring',
            category: 'automation',
            features: [
                'Task automation',
                'Process optimization',
                'Smart routing',
                'Quality assurance',
                'Compliance monitoring'
            ],
            configOptions: [
                { key: 'taskAutomation', label: 'Task Automation', type: 'switch', value: false },
                { key: 'processOptimization', label: 'Process Optimization', type: 'switch', value: false },
                { key: 'smartRouting', label: 'Smart Routing', type: 'switch', value: false },
                { key: 'complianceMonitoring', label: 'Compliance Monitoring', type: 'switch', value: false }
            ]
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-700';
            case 'inactive': return 'bg-gray-100 text-gray-700';
            case 'configuring': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'communication': return 'bg-blue-100 text-blue-700';
            case 'scheduling': return 'bg-green-100 text-green-700';
            case 'billing': return 'bg-purple-100 text-purple-700';
            case 'analytics': return 'bg-orange-100 text-orange-700';
            case 'automation': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const handleConfigure = (integration: AIIntegration) => {
        setSelectedIntegration(integration);
        setConfigValues(
            integration.configOptions.reduce((acc, option) => {
                acc[option.key] = option.value;
                return acc;
            }, {} as Record<string, any>)
        );
        setIsConfigOpen(true);
    };

    const handleSaveConfig = () => {
        if (!selectedIntegration) return;

        // Mock save functionality
        console.log('Saving config for:', selectedIntegration.name, configValues);

        toast({
            title: "Configuration Saved",
            description: `${selectedIntegration.name} settings have been updated successfully.`,
        });

        setIsConfigOpen(false);
        setSelectedIntegration(null);
    };

    const handleToggleIntegration = (integrationId: string) => {
        const integration = aiIntegrations.find(i => i.id === integrationId);
        if (!integration) return;

        const newStatus = integration.status === 'active' ? 'inactive' : 'active';

        toast({
            title: `${integration.name} ${newStatus === 'active' ? 'Activated' : 'Deactivated'}`,
            description: `The AI integration has been ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully.`,
        });
    };

    const getCategoryStats = () => {
        const stats = {
            communication: aiIntegrations.filter(i => i.category === 'communication' && i.status === 'active').length,
            scheduling: aiIntegrations.filter(i => i.category === 'scheduling' && i.status === 'active').length,
            billing: aiIntegrations.filter(i => i.category === 'billing' && i.status === 'active').length,
            analytics: aiIntegrations.filter(i => i.category === 'analytics' && i.status === 'active').length,
            automation: aiIntegrations.filter(i => i.category === 'automation' && i.status === 'active').length
        };
        return stats;
    };

    const stats = getCategoryStats();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">AI Integrations Hub</h2>
                    <p className="text-slate-600 mt-2">Configure and manage all AI-powered features</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {aiIntegrations.filter(i => i.status === 'active').length} Active
                    </Badge>
                    <Badge variant="outline">
                        {aiIntegrations.length} Total
                    </Badge>
                </div>
            </div>

            {/* AI Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <MessageSquare className="w-8 h-8 text-blue-600" />
                            <div>
                                <p className="text-sm font-medium text-blue-700">Communication</p>
                                <p className="text-2xl font-bold text-blue-900">{stats.communication}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-8 h-8 text-green-600" />
                            <div>
                                <p className="text-sm font-medium text-green-700">Scheduling</p>
                                <p className="text-2xl font-bold text-green-900">{stats.scheduling}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-8 h-8 text-purple-600" />
                            <div>
                                <p className="text-sm font-medium text-purple-700">Billing</p>
                                <p className="text-2xl font-bold text-purple-900">{stats.billing}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 text-orange-600" />
                            <div>
                                <p className="text-sm font-medium text-orange-700">Analytics</p>
                                <p className="text-2xl font-bold text-orange-900">{stats.analytics}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <Zap className="w-8 h-8 text-red-600" />
                            <div>
                                <p className="text-sm font-medium text-red-700">Automation</p>
                                <p className="text-2xl font-bold text-red-900">{stats.automation}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* AI Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiIntegrations.map((integration) => {
                    const IconComponent = integration.icon;
                    return (
                        <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                                            <CardDescription className="text-sm">{integration.description}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={getStatusColor(integration.status)}>
                                            {integration.status}
                                        </Badge>
                                        <Badge className={getCategoryColor(integration.category)}>
                                            {integration.category}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-medium text-sm text-slate-700 mb-2">Features:</h4>
                                    <ul className="space-y-1">
                                        {integration.features.slice(0, 3).map((feature, index) => (
                                            <li key={index} className="text-xs text-slate-600 flex items-center gap-2">
                                                <CheckCircle className="w-3 h-3 text-green-500" />
                                                {feature}
                                            </li>
                                        ))}
                                        {integration.features.length > 3 && (
                                            <li className="text-xs text-slate-500">
                                                +{integration.features.length - 3} more features
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="flex items-center gap-2 pt-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleConfigure(integration)}
                                        className="flex-1"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Configure
                                    </Button>
                                    <Button
                                        variant={integration.status === 'active' ? 'outline' : 'default'}
                                        size="sm"
                                        onClick={() => handleToggleIntegration(integration.id)}
                                        className="flex-1"
                                    >
                                        {integration.status === 'active' ? (
                                            <>
                                                <Pause className="w-4 h-4 mr-2" />
                                                Disable
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-4 h-4 mr-2" />
                                                Enable
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Configuration Modal */}
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            Configure {selectedIntegration?.name}
                        </DialogTitle>
                        <DialogDescription>
                            Customize the AI integration settings and behavior
                        </DialogDescription>
                    </DialogHeader>

                    {selectedIntegration && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                {selectedIntegration.configOptions.map((option) => (
                                    <div key={option.key} className="space-y-2">
                                        <Label htmlFor={option.key}>{option.label}</Label>

                                        {option.type === 'text' && (
                                            <Input
                                                id={option.key}
                                                value={configValues[option.key] || ''}
                                                onChange={(e) => setConfigValues({
                                                    ...configValues,
                                                    [option.key]: e.target.value
                                                })}
                                            />
                                        )}

                                        {option.type === 'textarea' && (
                                            <Textarea
                                                id={option.key}
                                                value={configValues[option.key] || ''}
                                                onChange={(e) => setConfigValues({
                                                    ...configValues,
                                                    [option.key]: e.target.value
                                                })}
                                            />
                                        )}

                                        {option.type === 'select' && (
                                            <Select
                                                value={configValues[option.key] || option.value}
                                                onValueChange={(value) => setConfigValues({
                                                    ...configValues,
                                                    [option.key]: value
                                                })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {option.options?.map((opt) => (
                                                        <SelectItem key={opt} value={opt}>
                                                            {opt}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}

                                        {option.type === 'switch' && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-slate-600">
                                                    {configValues[option.key] ? 'Enabled' : 'Disabled'}
                                                </span>
                                                <Switch
                                                    id={option.key}
                                                    checked={configValues[option.key] || false}
                                                    onCheckedChange={(checked) => setConfigValues({
                                                        ...configValues,
                                                        [option.key]: checked
                                                    })}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveConfig}>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Save Configuration
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}; 