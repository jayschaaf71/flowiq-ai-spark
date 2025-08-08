import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Database,
    Link,
    RefreshCw,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Settings,
    Zap,
    Shield,
    Key,
    Eye,
    EyeOff,
    TestTube,
    Activity,
    Clock,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

interface SystemStatus {
    name: string;
    connected: boolean;
    lastSync: string;
    status: 'connected' | 'disconnected' | 'error' | 'testing';
    endpoints: number;
    workflows: number;
    dataStructures: number;
    credentials: {
        username: string;
        endpoint: string;
        encrypted: boolean;
    };
}

interface SyncLog {
    id: string;
    system: string;
    timestamp: string;
    recordsSynced: number;
    status: 'success' | 'error' | 'partial';
    details: string;
}

export const IntegrationHub = () => {
    const [selectedTab, setSelectedTab] = useState('overview');
    const [showCredentials, setShowCredentials] = useState(false);
    const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([
        {
            name: 'Sleep Impressions',
            connected: false,
            lastSync: '',
            status: 'disconnected',
            endpoints: 0,
            workflows: 0,
            dataStructures: 0,
            credentials: {
                username: 'admin@sleepimpressions.com',
                endpoint: 'https://api.sleepimpressions.com/v1',
                encrypted: true
            }
        },
        {
            name: 'DS3 (DeepSpeed 3)',
            connected: false,
            lastSync: '',
            status: 'disconnected',
            endpoints: 0,
            workflows: 0,
            dataStructures: 0,
            credentials: {
                username: 'admin@ds3.com',
                endpoint: 'https://api.ds3.com/v2',
                encrypted: true
            }
        },
        {
            name: 'FlowIQ',
            connected: true,
            lastSync: '2024-01-15T10:30:00Z',
            status: 'connected',
            endpoints: 15,
            workflows: 8,
            dataStructures: 12,
            credentials: {
                username: 'admin@flowiq.com',
                endpoint: 'https://api.flowiq.com/v1',
                encrypted: true
            }
        }
    ]);

    const [syncLogs, setSyncLogs] = useState<SyncLog[]>([
        {
            id: '1',
            system: 'Sleep Impressions',
            timestamp: '2024-01-15T10:30:00Z',
            recordsSynced: 15,
            status: 'success',
            details: 'SOAP notes and patient data synced successfully'
        },
        {
            id: '2',
            system: 'DS3',
            timestamp: '2024-01-15T09:15:00Z',
            recordsSynced: 8,
            status: 'partial',
            details: '8 records synced, 2 failed due to validation errors'
        },
        {
            id: '3',
            system: 'FlowIQ',
            timestamp: '2024-01-15T08:45:00Z',
            recordsSynced: 23,
            status: 'success',
            details: 'All records synced successfully'
        }
    ]);

    const testConnection = async (systemName: string) => {
        setSystemStatuses(prev => prev.map(system => {
            if (system.name === systemName) {
                return { ...system, status: 'testing' as const };
            }
            return system;
        }));

        // Simulate connection test
        setTimeout(() => {
            setSystemStatuses(prev => prev.map(system => {
                if (system.name === systemName) {
                    const success = Math.random() > 0.3; // 70% success rate for demo
                    return {
                        ...system,
                        connected: success,
                        status: success ? 'connected' : 'error',
                        lastSync: success ? new Date().toISOString() : system.lastSync
                    };
                }
                return system;
            }));
        }, 2000);
    };

    const syncSystem = async (systemName: string) => {
        // Simulate sync process
        const newLog: SyncLog = {
            id: Date.now().toString(),
            system: systemName,
            timestamp: new Date().toISOString(),
            recordsSynced: Math.floor(Math.random() * 20) + 1,
            status: Math.random() > 0.2 ? 'success' : 'error',
            details: 'Manual sync initiated'
        };

        setSyncLogs(prev => [newLog, ...prev]);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'connected':
                return 'bg-green-100 text-green-800';
            case 'testing':
                return 'bg-blue-100 text-blue-800';
            case 'error':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'connected':
                return <CheckCircle2 className="w-4 h-4 text-green-600" />;
            case 'testing':
                return <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />;
            case 'error':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-600" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Integration Hub</h1>
                    <p className="text-gray-600">Manage clinical system connections and data synchronization</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync All
                    </Button>
                    <Button>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </div>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">System Overview</TabsTrigger>
                    <TabsTrigger value="credentials">Credentials</TabsTrigger>
                    <TabsTrigger value="sync-logs">Sync Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* System Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {systemStatuses.map((system) => (
                            <Card key={system.name}>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Database className="w-5 h-5 text-blue-600" />
                                            {system.name}
                                        </div>
                                        {getStatusIcon(system.status)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span>Connection Status:</span>
                                            <Badge className={getStatusColor(system.status)}>
                                                {system.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span>Last Sync:</span>
                                            <span className="text-sm text-gray-600">
                                                {system.lastSync ? new Date(system.lastSync).toLocaleString() : 'Never'}
                                            </span>
                                        </div>

                                        {system.connected && (
                                            <>
                                                <div className="flex items-center justify-between">
                                                    <span>Endpoints:</span>
                                                    <span className="text-sm font-medium">{system.endpoints}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Workflows:</span>
                                                    <span className="text-sm font-medium">{system.workflows}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span>Data Structures:</span>
                                                    <span className="text-sm font-medium">{system.dataStructures}</span>
                                                </div>
                                            </>
                                        )}

                                        <div className="flex gap-2 pt-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => testConnection(system.name)}
                                                disabled={system.status === 'testing'}
                                            >
                                                <TestTube className="w-4 h-4 mr-1" />
                                                Test
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => syncSystem(system.name)}
                                                disabled={!system.connected}
                                            >
                                                <RefreshCw className="w-4 h-4 mr-1" />
                                                Sync
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Connection Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-green-600" />
                                Connection Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {systemStatuses.filter(s => s.connected).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Connected Systems</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-red-600">
                                        {systemStatuses.filter(s => !s.connected).length}
                                    </div>
                                    <div className="text-sm text-gray-600">Disconnected Systems</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {systemStatuses.reduce((sum, s) => sum + s.endpoints, 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Endpoints</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-600">
                                        {systemStatuses.reduce((sum, s) => sum + s.workflows, 0)}
                                    </div>
                                    <div className="text-sm text-gray-600">Active Workflows</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="credentials" className="space-y-6">
                    {/* Credential Management */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5 text-blue-600" />
                                System Credentials
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {systemStatuses.map((system) => (
                                    <Card key={system.name} className="border">
                                        <CardHeader>
                                            <CardTitle className="flex items-center justify-between">
                                                <span>{system.name}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setShowCredentials(!showCredentials)}
                                                >
                                                    {showCredentials ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </Button>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <Label>Username</Label>
                                                    <Input
                                                        value={system.credentials.username}
                                                        type="text"
                                                        disabled
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Endpoint</Label>
                                                    <Input
                                                        value={system.credentials.endpoint}
                                                        type="text"
                                                        disabled
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Password</Label>
                                                    <Input
                                                        value={showCredentials ? "••••••••" : "••••••••"}
                                                        type="password"
                                                        disabled
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label>Encryption</Label>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge className={system.credentials.encrypted ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                                            {system.credentials.encrypted ? 'Encrypted' : 'Not Encrypted'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-4">
                                                <Button variant="outline" size="sm">
                                                    <Key className="w-4 h-4 mr-1" />
                                                    Update Credentials
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <TestTube className="w-4 h-4 mr-1" />
                                                    Test Connection
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sync-logs" className="space-y-6">
                    {/* Sync Logs */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Synchronization Logs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {syncLogs.map((log) => (
                                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${log.status === 'success' ? 'bg-green-500' :
                                                log.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`} />
                                            <div>
                                                <h4 className="font-medium">{log.system}</h4>
                                                <p className="text-sm text-gray-600">{log.details}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm font-medium">{log.recordsSynced} records</div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </div>
                                            <Badge className={
                                                log.status === 'success' ? 'bg-green-100 text-green-800' :
                                                    log.status === 'error' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }>
                                                {log.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}; 