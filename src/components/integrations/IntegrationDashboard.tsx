import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    RefreshCw,
    Database,
    MessageSquare,
    CreditCard,
    Calendar,
    Shield,
    Activity,
    Settings,
    TestTube,
    Zap,
    Globe,
    Phone,
    Mail,
    FileText,
    Users,
    TrendingUp,
    Stethoscope,
    Microscope,
    Brain,
    Search,
    Plus,
    Trash2,
    X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Import services
import { ehrIntegrationService } from '@/services/ehrIntegrationService';
import { EnhancedCommunicationService } from '@/services/enhancedCommunicationService';
import { useCalendarIntegrations } from '@/hooks/useCalendarIntegrations';

interface IntegrationStatus {
    id: string;
    name: string;
    type: 'clinical' | 'ehr' | 'communication' | 'payment' | 'calendar' | 'security';
    status: 'connected' | 'disconnected' | 'error' | 'testing';
    lastSync?: string;
    health: number;
    description: string;
    icon: React.ComponentType<any>;
    category: string;
}

interface AvailableIntegration {
    id: string;
    name: string;
    description: string;
    category: string;
    icon: React.ComponentType<any>;
    provider: string;
    setupUrl?: string;
}

export const IntegrationDashboard = () => {
    console.log('IntegrationDashboard component is rendering - TEST VERSION');
    const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showSettingsDialog, setShowSettingsDialog] = useState(false);
    const [selectedIntegration, setSelectedIntegration] = useState<IntegrationStatus | null>(null);
    const { toast } = useToast();
    const { integrations: calendarIntegrations } = useCalendarIntegrations();

    useEffect(() => {
        console.log('IntegrationDashboard useEffect triggered - TEST VERSION');
        loadIntegrationStatus();
    }, []);

    const loadIntegrationStatus = async () => {
        console.log('loadIntegrationStatus called - TEST VERSION');
        setLoading(true);
        try {
            // Mock integration status - in production would fetch from services
            const mockIntegrations: IntegrationStatus[] = [
                // Clinical System Integrations
                {
                    id: 'clinical-sleep-impressions',
                    name: 'Sleep Impressions',
                    type: 'clinical',
                    status: 'disconnected',
                    lastSync: '',
                    health: 0,
                    description: 'Sleep study and CPAP management system',
                    icon: Microscope,
                    category: 'Clinical Systems'
                },
                {
                    id: 'clinical-flowiq',
                    name: 'FlowIQ Clinical',
                    type: 'clinical',
                    status: 'connected',
                    lastSync: new Date().toISOString(),
                    health: 99,
                    description: 'Primary FlowIQ platform integration',
                    icon: Stethoscope,
                    category: 'Clinical Systems'
                },

                // EHR Integrations
                {
                    id: 'ehr-epic',
                    name: 'Epic EHR',
                    type: 'ehr',
                    status: 'connected',
                    lastSync: new Date().toISOString(),
                    health: 95,
                    description: 'Electronic Health Records integration',
                    icon: Database,
                    category: 'EHR Systems'
                },
                {
                    id: 'ehr-cerner',
                    name: 'Cerner EHR',
                    type: 'ehr',
                    status: 'disconnected',
                    lastSync: '',
                    health: 0,
                    description: 'Cerner Electronic Health Records',
                    icon: Database,
                    category: 'EHR Systems'
                },

                // Communication Integrations
                {
                    id: 'communication-email',
                    name: 'Email Service',
                    type: 'communication',
                    status: 'connected',
                    lastSync: new Date().toISOString(),
                    health: 98,
                    description: 'SendGrid email integration',
                    icon: Mail,
                    category: 'Communication'
                },
                {
                    id: 'communication-sms',
                    name: 'SMS Service',
                    type: 'communication',
                    status: 'connected',
                    lastSync: new Date().toISOString(),
                    health: 92,
                    description: 'Twilio SMS integration',
                    icon: Phone,
                    category: 'Communication'
                },
                {
                    id: 'ai-voice',
                    name: 'AI Voice Assistant',
                    type: 'communication',
                    status: 'testing',
                    lastSync: new Date().toISOString(),
                    health: 85,
                    description: 'Vapi AI voice integration',
                    icon: Activity,
                    category: 'Communication'
                },

                // Payment Integrations
                {
                    id: 'payment-stripe',
                    name: 'Payment Processing',
                    type: 'payment',
                    status: 'connected',
                    lastSync: new Date().toISOString(),
                    health: 96,
                    description: 'Stripe payment processing',
                    icon: CreditCard,
                    category: 'Payment'
                },

                // Calendar Integrations
                {
                    id: 'calendar-google',
                    name: 'Google Calendar',
                    type: 'calendar',
                    status: calendarIntegrations.some(i => i.provider === 'google') ? 'connected' : 'disconnected',
                    health: calendarIntegrations.some(i => i.provider === 'google') ? 94 : 0,
                    description: 'Google Calendar integration',
                    icon: Calendar,
                    category: 'Calendar'
                },
                {
                    id: 'calendar-microsoft',
                    name: 'Microsoft Outlook',
                    type: 'calendar',
                    status: calendarIntegrations.some(i => i.provider === 'microsoft') ? 'connected' : 'disconnected',
                    health: calendarIntegrations.some(i => i.provider === 'microsoft') ? 93 : 0,
                    description: 'Microsoft Outlook integration',
                    icon: Calendar,
                    category: 'Calendar'
                },
                {
                    id: 'calendar-apple',
                    name: 'Apple Calendar',
                    type: 'calendar',
                    status: calendarIntegrations.some(i => i.provider === 'apple') ? 'connected' : 'disconnected',
                    health: calendarIntegrations.some(i => i.provider === 'apple') ? 91 : 0,
                    description: 'Apple Calendar integration',
                    icon: Calendar,
                    category: 'Calendar'
                },

                // Security Integrations
                {
                    id: 'security-hipaa',
                    name: 'HIPAA Compliance',
                    type: 'security',
                    status: 'connected',
                    lastSync: new Date().toISOString(),
                    health: 99,
                    description: 'HIPAA compliance monitoring',
                    icon: Shield,
                    category: 'Security'
                }
            ];

            console.log('Setting integrations:', mockIntegrations);
            setIntegrations(mockIntegrations);
        } catch (error) {
            console.error('Failed to load integration status:', error);
            toast({
                title: "Error",
                description: "Failed to load integration status",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected': return 'bg-green-100 text-green-700';
            case 'disconnected': return 'bg-gray-100 text-gray-700';
            case 'error': return 'bg-red-100 text-red-700';
            case 'testing': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected': return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'disconnected': return <XCircle className="h-4 w-4 text-gray-400" />;
            case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
            case 'testing': return <TestTube className="h-4 w-4 text-yellow-600" />;
            default: return <Clock className="h-4 w-4 text-gray-400" />;
        }
    };

    const testIntegration = async (integrationId: string) => {
        try {
            setLoading(true);
            // Mock test - in production would call actual integration test
            await new Promise(resolve => setTimeout(resolve, 2000));

            toast({
                title: "Test Complete",
                description: "Integration test completed successfully",
            });
        } catch (error) {
            toast({
                title: "Test Failed",
                description: "Integration test failed",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const syncIntegration = async (integrationId: string) => {
        try {
            setLoading(true);
            // Mock sync - in production would call actual sync
            await new Promise(resolve => setTimeout(resolve, 3000));

            toast({
                title: "Sync Complete",
                description: "Integration sync completed successfully",
            });
        } catch (error) {
            toast({
                title: "Sync Failed",
                description: "Integration sync failed",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', 'Clinical Systems', 'EHR Systems', 'Communication', 'Payment', 'Calendar', 'Security'];

    const filteredIntegrations = integrations.filter(integration =>
        selectedCategory === 'all' || integration.category === selectedCategory
    );

    const getCategoryStats = () => {
        const stats: { [key: string]: { total: number; connected: number } } = {};
        integrations.forEach(integration => {
            if (!stats[integration.category]) {
                stats[integration.category] = { total: 0, connected: 0 };
            }
            stats[integration.category].total++;
            if (integration.status === 'connected') {
                stats[integration.category].connected++;
            }
        });
        return stats;
    };

    const categoryStats = getCategoryStats();

    console.log('IntegrationDashboard rendering with integrations:', integrations);
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Integration Dashboard</h2>
                    <p className="text-gray-600">Manage all system integrations and connections</p>
                </div>
                <Button onClick={() => loadIntegrationStatus()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Overall Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-blue-700">
                                    {integrations.filter(i => i.status === 'connected').length}
                                </div>
                                <div className="text-sm font-medium text-blue-600">Active Integrations</div>
                                <div className="text-xs text-blue-500">out of {integrations.length} total</div>
                            </div>
                            <CheckCircle className="h-8 w-8 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-green-700">
                                    {Math.round(integrations.reduce((acc, i) => acc + i.health, 0) / integrations.length)}%
                                </div>
                                <div className="text-sm font-medium text-green-600">Average Health</div>
                                <div className="text-xs text-green-500">system performance</div>
                            </div>
                            <Activity className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-orange-700">
                                    {integrations.filter(i => i.status === 'disconnected').length}
                                </div>
                                <div className="text-sm font-medium text-orange-600">Needs Attention</div>
                                <div className="text-xs text-orange-500">disconnected systems</div>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold text-purple-700">
                                    {categories.length - 1}
                                </div>
                                <div className="text-sm font-medium text-purple-600">Categories</div>
                                <div className="text-xs text-purple-500">integration types</div>
                            </div>
                            <Zap className="h-8 w-8 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Input
                        placeholder="Search integrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Category Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(categoryStats).map(([category, stats]) => (
                    <Card key={category} className="text-center">
                        <CardContent className="p-4">
                            <div className="text-2xl font-bold text-blue-600">{stats.connected}</div>
                            <div className="text-sm text-gray-600">{category}</div>
                            <div className="text-xs text-gray-500">{stats.connected}/{stats.total} connected</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Integrations List */}
            <div className="space-y-4">
                {filteredIntegrations.map(integration => {
                    const IconComponent = integration.icon;
                    return (
                        <Card key={integration.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <IconComponent className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                                            <p className="text-sm text-gray-600">{integration.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Badge className={getStatusColor(integration.status)}>
                                            {getStatusIcon(integration.status)}
                                            {integration.status}
                                        </Badge>
                                        {integration.lastSync && (
                                            <span className="text-xs text-gray-500">
                                                Last sync: {new Date(integration.lastSync).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {/* Health Score */}
                                    <div>
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="font-medium">System Health</span>
                                            <span className={`font-bold ${integration.health >= 90 ? 'text-green-600' :
                                                integration.health >= 70 ? 'text-yellow-600' : 'text-red-600'
                                                }`}>
                                                {integration.health}%
                                            </span>
                                        </div>
                                        <Progress
                                            value={integration.health}
                                            className={`h-2 ${integration.health >= 90 ? 'bg-green-100' :
                                                integration.health >= 70 ? 'bg-yellow-100' : 'bg-red-100'
                                                }`}
                                        />
                                    </div>

                                    {/* Status Summary */}
                                    <div className="text-sm text-gray-600">
                                        {integration.status === 'connected' && (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle className="h-4 w-4" />
                                                <span>Fully operational</span>
                                            </div>
                                        )}
                                        {integration.status === 'disconnected' && (
                                            <div className="flex items-center gap-1 text-red-600">
                                                <XCircle className="h-4 w-4" />
                                                <span>Connection required</span>
                                            </div>
                                        )}
                                        {integration.status === 'testing' && (
                                            <div className="flex items-center gap-1 text-yellow-600">
                                                <TestTube className="h-4 w-4" />
                                                <span>Under testing</span>
                                            </div>
                                        )}
                                        {integration.status === 'error' && (
                                            <div className="flex items-center gap-1 text-red-600">
                                                <AlertTriangle className="h-4 w-4" />
                                                <span>Error detected</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 pt-2 border-t">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => testIntegration(integration.id)}
                                            disabled={loading}
                                            className="flex-1"
                                        >
                                            <TestTube className="h-4 w-4 mr-1" />
                                            Test
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => syncIntegration(integration.id)}
                                            disabled={loading}
                                            className="flex-1"
                                        >
                                            <RefreshCw className="h-4 w-4 mr-1" />
                                            Sync
                                        </Button>
                                        <Button variant="outline" size="sm">
                                            <Settings className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredIntegrations.length === 0 && (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No integrations found</h3>
                        <p className="text-gray-600">No integrations match the selected category.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}; 