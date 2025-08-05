
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Database,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Zap,
  Link,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  Shield,
  Play,
  Pause,
  Square,
  Mic
} from 'lucide-react';
import { SystemDiscoveryService } from '@/services/integrations/systemDiscovery';
import { HIPAACredentialManagerService } from '@/services/integrations/security/hipaaCredentialManager';
import { MultiSystemVoiceToSOAPService } from '@/services/integrations/multiSystemVoiceToSOAP';

interface SystemStatus {
  name: string;
  connected: boolean;
  lastSync: string;
  status: 'connected' | 'disconnected' | 'error' | 'testing';
  endpoints: number;
  workflows: number;
  dataStructures: number;
}

export const IntegrationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStatuses, setSystemStatuses] = useState<SystemStatus[]>([
    {
      name: 'Sleep Impressions',
      connected: false,
      lastSync: '',
      status: 'disconnected',
      endpoints: 0,
      workflows: 0,
      dataStructures: 0
    },
    {
      name: 'DS3',
      connected: false,
      lastSync: '',
      status: 'disconnected',
      endpoints: 0,
      workflows: 0,
      dataStructures: 0
    }
  ]);
  const [discoveryResults, setDiscoveryResults] = useState<any>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);

  const discoveryService = new SystemDiscoveryService();
  const credentialManager = new HIPAACredentialManagerService();
  const voiceToSOAPService = new MultiSystemVoiceToSOAPService();

  useEffect(() => {
    // Initialize system statuses
    initializeSystemStatuses();
  }, []);

  const initializeSystemStatuses = async () => {
    try {
      // Test connections and update statuses
      const sleepImpressionsResult = await credentialManager.testSleepImpressionsConnection();
      const ds3Result = await credentialManager.testDS3Connection();

      setSystemStatuses(prev => prev.map(system => {
        if (system.name === 'Sleep Impressions') {
          return {
            ...system,
            connected: sleepImpressionsResult.success,
            status: sleepImpressionsResult.success ? 'connected' : 'disconnected'
          };
        } else if (system.name === 'DS3') {
          return {
            ...system,
            connected: ds3Result.success,
            status: ds3Result.success ? 'connected' : 'disconnected'
          };
        }
        return system;
      }));
    } catch (error) {
      console.error('❌ Error initializing system statuses:', error);
    }
  };

  const runSystemDiscovery = async () => {
    setIsDiscovering(true);
    try {
      console.log('🔍 Starting comprehensive system discovery...');

      // Discover both systems
      const sleepImpressionsDiscovery = await discoveryService.discoverSleepImpressions();
      const ds3Discovery = await discoveryService.discoverDS3();

      // Update system statuses with discovery results
      setSystemStatuses(prev => prev.map(system => {
        if (system.name === 'Sleep Impressions') {
          return {
            ...system,
            connected: sleepImpressionsDiscovery.connected,
            status: 'connected',
            endpoints: sleepImpressionsDiscovery.endpoints.length,
            workflows: sleepImpressionsDiscovery.workflows.length,
            dataStructures: sleepImpressionsDiscovery.dataStructures.length
          };
        } else if (system.name === 'DS3') {
          return {
            ...system,
            connected: ds3Discovery.connected,
            status: 'connected',
            endpoints: ds3Discovery.endpoints.length,
            workflows: ds3Discovery.workflows.length,
            dataStructures: ds3Discovery.dataStructures.length
          };
        }
        return system;
      }));

      setDiscoveryResults({
        sleepImpressions: sleepImpressionsDiscovery,
        ds3: ds3Discovery
      });

      console.log('✅ System discovery completed');
    } catch (error) {
      console.error('❌ Error during system discovery:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const startVoiceRecording = async () => {
    setVoiceRecording(true);
    console.log('🎤 Starting voice recording for multi-system SOAP note...');

    try {
      const recording = await voiceToSOAPService.recordVoiceSession();
      console.log('🎤 Voice recording started');
    } catch (error) {
      console.error('❌ Error starting voice recording:', error);
      setVoiceRecording(false);
    }
  };

  const stopVoiceRecording = async () => {
    setVoiceRecording(false);
    console.log('🎤 Stopping voice recording and generating SOAP note...');

    try {
      const recording = await voiceToSOAPService.recordVoiceSession();
      const transcription = await voiceToSOAPService.transcribeVoiceToText(recording);
      const soapNote = await voiceToSOAPService.generateSOAPNote(transcription);
      const syncResult = await voiceToSOAPService.syncToAllSystems(soapNote);

      if (syncResult.success) {
        console.log('✅ SOAP note generated and synced to all systems');
      } else {
        console.error('❌ Error syncing SOAP note:', syncResult.message);
      }
    } catch (error) {
      console.error('❌ Error generating SOAP note:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800';
      case 'disconnected':
        return 'bg-red-100 text-red-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'testing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'testing':
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Integration Dashboard</h1>
          <p className="text-gray-600">Multi-system voice-to-SOAP integration management</p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={runSystemDiscovery}
            disabled={isDiscovering}
            className="flex items-center gap-2"
          >
            {isDiscovering ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            {isDiscovering ? 'Discovering...' : 'Run Discovery'}
          </Button>

          <Button
            onClick={voiceRecording ? stopVoiceRecording : startVoiceRecording}
            variant={voiceRecording ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {voiceRecording ? (
              <>
                <Square className="w-4 h-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Start Voice Recording
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="discovery">System Discovery</TabsTrigger>
          <TabsTrigger value="integration">Integration Hub</TabsTrigger>
          <TabsTrigger value="voice">Voice-to-SOAP</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemStatuses.map((system) => (
              <Card key={system.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      {system.name}
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(system.status)}
                      <Badge className={getStatusColor(system.status)}>
                        {system.status}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">{system.endpoints}</div>
                        <div className="text-sm text-gray-600">Endpoints</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">{system.workflows}</div>
                        <div className="text-sm text-gray-600">Workflows</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">{system.dataStructures}</div>
                        <div className="text-sm text-gray-600">Data Structures</div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      Last Sync: {system.lastSync || 'Never'}
                    </div>

                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => runSystemDiscovery()}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Integration Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Integration Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">2</div>
                  <div className="text-sm text-gray-600">Connected Systems</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">15</div>
                  <div className="text-sm text-gray-600">API Endpoints</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">8</div>
                  <div className="text-sm text-gray-600">Workflows</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Data Structures</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-6">
          {/* System Discovery Results */}
          {discoveryResults && (
            <div className="space-y-6">
              {Object.entries(discoveryResults).map(([systemName, discovery]: [string, any]) => (
                <Card key={systemName}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      {discovery.systemName} Discovery Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Endpoints */}
                      <div>
                        <h4 className="font-semibold mb-2">API Endpoints ({discovery.endpoints.length})</h4>
                        <div className="space-y-2">
                          {discovery.endpoints.map((endpoint: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                              <Badge variant="outline">{endpoint.method}</Badge>
                              <code className="text-sm">{endpoint.path}</code>
                              <span className="text-sm text-gray-600">{endpoint.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Data Structures */}
                      <div>
                        <h4 className="font-semibold mb-2">Data Structures ({discovery.dataStructures.length})</h4>
                        <div className="space-y-2">
                          {discovery.dataStructures.map((structure: any, index: number) => (
                            <div key={index} className="p-3 border rounded">
                              <div className="font-medium">{structure.name}</div>
                              <div className="text-sm text-gray-600">{structure.description}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {structure.fields.length} fields
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Workflows */}
                      <div>
                        <h4 className="font-semibold mb-2">Workflows ({discovery.workflows.length})</h4>
                        <div className="space-y-2">
                          {discovery.workflows.map((workflow: any, index: number) => (
                            <div key={index} className="p-3 border rounded">
                              <div className="font-medium">{workflow.name}</div>
                              <div className="text-sm text-gray-600">{workflow.description}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {workflow.steps.length} steps
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div>
                        <h4 className="font-semibold mb-2">Recommendations</h4>
                        <div className="space-y-2">
                          {discovery.recommendations.map((rec: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded">
                              <Zap className="w-4 h-4 text-blue-600" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!discoveryResults && (
            <Card>
              <CardHeader>
                <CardTitle>System Discovery</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No discovery results available</p>
                  <Button onClick={runSystemDiscovery}>
                    <Search className="w-4 h-4 mr-2" />
                    Run System Discovery
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          {/* Integration Hub */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                Integration Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Data Synchronization</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Patient Records</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">SOAP Notes</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Appointments</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Workflow Automation</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Voice-to-SOAP</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Claims Processing</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Insurance Verification</span>
                      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          {/* Voice-to-SOAP Interface */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice-to-SOAP Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Mic className={`h-12 w-12 mx-auto mb-4 ${voiceRecording ? 'text-red-500' : 'text-gray-400'}`} />
                    <p className="text-gray-600 mb-4">
                      {voiceRecording ? 'Recording in progress...' : 'Click to start voice recording'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={voiceRecording ? stopVoiceRecording : startVoiceRecording}
                        variant={voiceRecording ? "destructive" : "default"}
                        className="flex items-center gap-2"
                      >
                        {voiceRecording ? (
                          <>
                            <Square className="w-4 h-4" />
                            Stop Recording
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            Start Recording
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <div className="font-semibold">SOAP Generation</div>
                    <div className="text-sm text-gray-600">AI-powered SOAP note creation</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Link className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <div className="font-semibold">Multi-System Sync</div>
                    <div className="text-sm text-gray-600">Sync to all connected systems</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <div className="font-semibold">HIPAA Compliant</div>
                    <div className="text-sm text-gray-600">Secure and compliant processing</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
