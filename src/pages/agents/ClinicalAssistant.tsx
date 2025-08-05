import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Stethoscope,
  FileText,
  Users,
  Mic,
  Play,
  Pause,
  Square,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  TrendingUp,
  MessageSquare,
  Settings,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  User,
  Shield,
  Database,
  Zap,
  Link,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { MultiSystemVoiceToSOAPService } from '@/services/integrations/multiSystemVoiceToSOAP';
import { HIPAACredentialManagerService } from '@/services/integrations/security/hipaaCredentialManager';

interface SOAPNote {
  id: string;
  patientName: string;
  date: string;
  status: 'draft' | 'completed' | 'reviewed' | 'syncing' | 'synced' | 'error';
  type: string;
  duration: number;
  transcription: string;
  syncStatus?: {
    sleepImpressions: 'pending' | 'synced' | 'error';
    ds3: 'pending' | 'synced' | 'error';
    flowIQ: 'synced';
  };
}

interface IntegrationStatus {
  sleepImpressions: {
    connected: boolean;
    lastSync: string;
    status: 'connected' | 'disconnected' | 'error';
  };
  ds3: {
    connected: boolean;
    lastSync: string;
    status: 'connected' | 'disconnected' | 'error';
  };
}

interface PatientRecord {
  id: string;
  name: string;
  lastVisit: string;
  nextAppointment: string;
  diagnosis: string;
  treatment: string;
  status: 'active' | 'completed' | 'follow-up';
}

export const ClinicalAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentTranscription, setCurrentTranscription] = useState('');
  const [selectedTab, setSelectedTab] = useState('integration-hub');
  const [integrationStatus, setIntegrationStatus] = useState<IntegrationStatus>({
    sleepImpressions: { connected: false, lastSync: '', status: 'disconnected' },
    ds3: { connected: false, lastSync: '', status: 'disconnected' }
  });
  const [syncInProgress, setSyncInProgress] = useState(false);

  // Initialize services
  const voiceToSOAPService = new MultiSystemVoiceToSOAPService();
  const credentialManager = new HIPAACredentialManagerService();

  // Mock data with enhanced sync status
  const soapNotes: SOAPNote[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      date: '2024-01-15',
      status: 'synced',
      type: 'Sleep Study Review',
      duration: 45,
      transcription: 'Patient reports improved sleep quality with CPAP therapy. AHI reduced from 25 to 3. Compliance rate at 85%.',
      syncStatus: {
        sleepImpressions: 'synced',
        ds3: 'synced',
        flowIQ: 'synced'
      }
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      date: '2024-01-14',
      status: 'syncing',
      type: 'CPAP Fitting',
      duration: 30,
      transcription: 'Initial CPAP fitting completed. Patient tolerated well. Mask fitting optimal. Instructions provided.',
      syncStatus: {
        sleepImpressions: 'pending',
        ds3: 'synced',
        flowIQ: 'synced'
      }
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      date: '2024-01-13',
      status: 'error',
      type: 'Follow-up',
      duration: 20,
      transcription: 'Follow-up visit. Patient reports mild discomfort with mask. Adjusted settings and provided new cushion.',
      syncStatus: {
        sleepImpressions: 'error',
        ds3: 'synced',
        flowIQ: 'synced'
      }
    }
  ];

  const patientRecords: PatientRecord[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      lastVisit: '2024-01-15',
      nextAppointment: '2024-02-15',
      diagnosis: 'Obstructive Sleep Apnea',
      treatment: 'CPAP Therapy',
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Chen',
      lastVisit: '2024-01-14',
      nextAppointment: '2024-01-28',
      diagnosis: 'Sleep Apnea',
      treatment: 'CPAP Therapy',
      status: 'active'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      lastVisit: '2024-01-13',
      nextAppointment: '2024-01-27',
      diagnosis: 'Sleep Disordered Breathing',
      treatment: 'Oral Appliance',
      status: 'follow-up'
    }
  ];

  // Voice recording handlers with multi-system integration
  const handleStartRecording = async () => {
    setIsRecording(true);
    console.log('🎤 Starting voice recording for multi-system SOAP note generation...');

    try {
      // Initialize voice recording with AI transcription
      const recording = await voiceToSOAPService.recordVoiceSession();
      console.log('🎤 Voice recording started');
    } catch (error) {
      console.error('❌ Error starting voice recording:', error);
    }
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    setSyncInProgress(true);
    console.log('🎤 Stopping voice recording and generating SOAP note...');

    try {
      // 1. Stop recording and get transcription
      const recording = await voiceToSOAPService.recordVoiceSession();
      const transcription = await voiceToSOAPService.transcribeVoiceToText(recording);
      setCurrentTranscription(transcription);

      // 2. Generate SOAP note with AI
      const soapNote = await voiceToSOAPService.generateSOAPNote(transcription);

      // 3. Multi-system sync
      const syncResult = await voiceToSOAPService.syncToAllSystems(soapNote);

      if (syncResult.success) {
        console.log('✅ SOAP note generated and synced to all systems');
        // Update integration status
        setIntegrationStatus(prev => ({
          ...prev,
          sleepImpressions: { ...prev.sleepImpressions, lastSync: new Date().toISOString() },
          ds3: { ...prev.ds3, lastSync: new Date().toISOString() }
        }));
      } else {
        console.error('❌ Error syncing SOAP note:', syncResult.message);
      }
    } catch (error) {
      console.error('❌ Error generating SOAP note:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  // Test connections
  const testSleepImpressionsConnection = async () => {
    try {
      const result = await credentialManager.testSleepImpressionsConnection();
      if (result.success) {
        setIntegrationStatus(prev => ({
          ...prev,
          sleepImpressions: { ...prev.sleepImpressions, connected: true, status: 'connected' }
        }));
      }
    } catch (error) {
      console.error('❌ Error testing Sleep Impressions connection:', error);
    }
  };

  const testDS3Connection = async () => {
    try {
      const result = await credentialManager.testDS3Connection();
      if (result.success) {
        setIntegrationStatus(prev => ({
          ...prev,
          ds3: { ...prev.ds3, connected: true, status: 'connected' }
        }));
      }
    } catch (error) {
      console.error('❌ Error testing DS3 connection:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'synced':
        return 'bg-green-100 text-green-800';
      case 'draft':
      case 'pending':
      case 'syncing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSyncStatusIcon = (status: 'pending' | 'synced' | 'error') => {
    switch (status) {
      case 'synced':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Integration Status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Assistant</h1>
          <p className="text-gray-600">AI-powered clinical documentation with multi-system integration</p>
        </div>

        {/* Integration Status */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${integrationStatus.sleepImpressions.connected ? 'bg-green-500' : 'bg-red-500'
              }`} />
            <span className="text-sm text-gray-600">Sleep Impressions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${integrationStatus.ds3.connected ? 'bg-green-500' : 'bg-red-500'
              }`} />
            <span className="text-sm text-gray-600">DS3</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="soap-notes">SOAP Notes</TabsTrigger>
          <TabsTrigger value="voice-recording">Voice Recording</TabsTrigger>
          <TabsTrigger value="integration">Integration Hub</TabsTrigger>
          <TabsTrigger value="patients">Patient Records</TabsTrigger>
        </TabsList>

        <TabsContent value="soap-notes" className="space-y-6">
          {/* Voice Recording Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-blue-600" />
                Voice-to-SOAP Recording
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Button
                  onClick={isRecording ? handleStopRecording : handleStartRecording}
                  variant={isRecording ? "destructive" : "default"}
                  className="flex items-center gap-2"
                  disabled={syncInProgress}
                >
                  {isRecording ? (
                    <>
                      <Square className="w-4 h-4" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Start Recording
                    </>
                  )}
                </Button>

                {isRecording && (
                  <div className="flex items-center gap-2 text-red-600">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                    Recording...
                  </div>
                )}

                {syncInProgress && (
                  <div className="flex items-center gap-2 text-blue-600">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Syncing to all systems...
                  </div>
                )}
              </div>

              {currentTranscription && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Current Transcription:</h4>
                  <p className="text-gray-700">{currentTranscription}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SOAP Notes with Sync Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                SOAP Notes with Multi-System Sync
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {soapNotes.map((note) => (
                  <div key={note.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{note.patientName}</h4>
                        <p className="text-sm text-gray-600">{note.date} - {note.type}</p>
                      </div>
                      <Badge className={getStatusColor(note.status)}>
                        {note.status}
                      </Badge>
                    </div>

                    <p className="text-gray-700 mb-3">{note.transcription}</p>

                    {/* Sync Status */}
                    {note.syncStatus && (
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">Sync Status:</span>
                        <div className="flex items-center gap-2">
                          {getSyncStatusIcon(note.syncStatus.flowIQ)}
                          <span>FlowIQ</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSyncStatusIcon(note.syncStatus.sleepImpressions)}
                          <span>Sleep Impressions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getSyncStatusIcon(note.syncStatus.ds3)}
                          <span>DS3</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-6">
          {/* Integration Hub Dashboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="w-5 h-5 text-purple-600" />
                Integration Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sleep Impressions Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      Sleep Impressions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Connection Status:</span>
                        <Badge className={integrationStatus.sleepImpressions.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {integrationStatus.sleepImpressions.connected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Sync:</span>
                        <span className="text-sm text-gray-600">
                          {integrationStatus.sleepImpressions.lastSync || 'Never'}
                        </span>
                      </div>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={testSleepImpressionsConnection}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* DS3 Integration */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-600" />
                      DS3 (DeepSpeed 3)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Connection Status:</span>
                        <Badge className={integrationStatus.ds3.connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {integrationStatus.ds3.connected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Last Sync:</span>
                        <span className="text-sm text-gray-600">
                          {integrationStatus.ds3.lastSync || 'Never'}
                        </span>
                      </div>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={testDS3Connection}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Test Connection
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice-recording" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Recording Interface</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Advanced voice recording interface with AI transcription...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Patient Records</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Patient records with multi-system sync...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 