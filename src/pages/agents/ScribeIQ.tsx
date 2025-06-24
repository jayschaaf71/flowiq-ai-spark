
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Stethoscope, 
  Play, 
  Square, 
  Upload, 
  FileText, 
  Mic, 
  Battery, 
  Wifi, 
  WifiOff,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit,
  Send,
  Settings,
  Activity,
  TrendingUp,
  Shield,
  Database,
  Headphones
} from "lucide-react";

const ScribeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isRecording, setIsRecording] = useState(false);
  const [deviceConnected, setDeviceConnected] = useState(true);
  const { toast } = useToast();

  // Mock data for demonstrations
  const deviceStatus = {
    batteryLevel: 78,
    storageUsed: 32,
    storageTotal: 64,
    connectionStatus: deviceConnected ? "connected" : "disconnected",
    lastSync: "2 minutes ago"
  };

  const recentRecordings = [
    {
      id: "REC-001",
      patientName: "Sarah Johnson",
      date: "2024-01-15",
      duration: "12:34",
      status: "transcribing",
      confidence: 94
    },
    {
      id: "REC-002", 
      patientName: "Mike Wilson",
      date: "2024-01-15",
      duration: "08:22",
      status: "ready_for_review",
      confidence: 97
    },
    {
      id: "REC-003",
      patientName: "Emma Davis", 
      date: "2024-01-14",
      duration: "15:18",
      status: "finalized",
      confidence: 92
    }
  ];

  const transcriptionStats = [
    { label: "Today's Recordings", value: "8", icon: Mic, trend: "+2 from yesterday" },
    { label: "Avg Transcription Time", value: "3.2 min", icon: Clock, trend: "15% faster" },
    { label: "Accuracy Rate", value: "96.8%", icon: TrendingUp, trend: "+2.1% this week" },
    { label: "Notes Finalized", value: "23", icon: CheckCircle, trend: "18 pending review" }
  ];

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording Started",
      description: "PLAUD Note is now recording patient encounter",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    toast({
      title: "Recording Stopped", 
      description: "Audio saved and queued for transcription",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      transcribing: { variant: "secondary" as const, color: "bg-blue-100 text-blue-700" },
      ready_for_review: { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-700" },
      finalized: { variant: "default" as const, color: "bg-green-100 text-green-700" },
      error: { variant: "destructive" as const, color: "bg-red-100 text-red-700" }
    };
    
    return (
      <Badge variant={variants[status as keyof typeof variants]?.variant || "secondary"} 
             className={variants[status as keyof typeof variants]?.color}>
        {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Scribe iQ"
        subtitle="AI-powered ambient documentation with PLAUD Note integration"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="device">Device Status</TabsTrigger>
            <TabsTrigger value="transcriptions">Transcriptions</TabsTrigger>
            <TabsTrigger value="notes">Clinical Notes</TabsTrigger>
            <TabsTrigger value="integration">EHR Integration</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {transcriptionStats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                    <stat.icon className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recording Control */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-purple-600" />
                  PLAUD Note Recording Control
                </CardTitle>
                <CardDescription>Start and manage audio recordings for patient encounters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                    <span className="font-medium">
                      {isRecording ? 'Recording in Progress' : 'Ready to Record'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {!isRecording ? (
                      <Button onClick={handleStartRecording} className="bg-red-600 hover:bg-red-700">
                        <Play className="w-4 h-4 mr-2" />
                        Start Recording
                      </Button>
                    ) : (
                      <Button onClick={handleStopRecording} variant="outline">
                        <Square className="w-4 h-4 mr-2" />
                        Stop Recording
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Recordings</CardTitle>
                <CardDescription>Latest patient encounters processed by Scribe iQ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRecordings.map((recording) => (
                    <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{recording.patientName}</p>
                          <p className="text-sm text-muted-foreground">
                            {recording.date} • {recording.duration}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Confidence: {recording.confidence}%</span>
                          <Progress value={recording.confidence} className="w-16" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(recording.status)}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="device" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-purple-600" />
                  PLAUD Note Device Status
                </CardTitle>
                <CardDescription>Monitor your wearable AI voice recorder</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Connection Status */}
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {deviceConnected ? <Wifi className="w-5 h-5 text-green-600" /> : <WifiOff className="w-5 h-5 text-red-600" />}
                      <div>
                        <p className="font-medium">Connection Status</p>
                        <p className="text-sm text-muted-foreground">Last sync: {deviceStatus.lastSync}</p>
                      </div>
                    </div>
                    <Badge variant={deviceConnected ? "default" : "destructive"}>
                      {deviceStatus.connectionStatus}
                    </Badge>
                  </div>

                  {/* Battery Level */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4" />
                        <span className="font-medium">Battery Level</span>
                      </div>
                      <span className="text-sm">{deviceStatus.batteryLevel}%</span>
                    </div>
                    <Progress value={deviceStatus.batteryLevel} className="w-full" />
                  </div>

                  {/* Storage Usage */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span className="font-medium">Storage Usage</span>
                      </div>
                      <span className="text-sm">
                        {deviceStatus.storageUsed}GB / {deviceStatus.storageTotal}GB
                      </span>
                    </div>
                    <Progress value={(deviceStatus.storageUsed / deviceStatus.storageTotal) * 100} className="w-full" />
                  </div>

                  {/* Device Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Sync Device
                    </Button>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Device Settings
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transcriptions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Transcription Management
                </CardTitle>
                <CardDescription>Review and manage AI-generated transcriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Transcription Queue */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Processing</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <p className="text-xs text-blue-600">Deepgram Nova-3 Medical</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-yellow-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium">Ready for Review</span>
                      </div>
                      <div className="text-2xl font-bold text-yellow-600">5</div>
                      <p className="text-xs text-yellow-600">Awaiting provider review</p>
                    </div>
                    <div className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium">Completed</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">28</div>
                      <p className="text-xs text-green-600">This week</p>
                    </div>
                  </div>

                  {/* Sample Transcription Review */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">Patient: Sarah Johnson - Routine Checkup</h3>
                        <p className="text-sm text-muted-foreground">January 15, 2024 • 12:34 duration</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-green-100 text-green-700">96% Confidence</Badge>
                        <Button size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Review
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <p className="mb-2"><strong>Provider:</strong> Good morning, Sarah. How are you feeling today?</p>
                      <p className="mb-2"><strong>Patient:</strong> I'm doing well, thank you. I've been having some mild headaches lately.</p>
                      <p className="mb-2"><strong>Provider:</strong> I see. Can you tell me more about these headaches? When did they start?</p>
                      <p className="text-muted-foreground">... transcript continues ...</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Clinical Notes Management</CardTitle>
                <CardDescription>Structured SOAP notes generated from transcriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Note Generation Pipeline */}
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      2 clinical notes are pending your review and finalization before EHR integration.
                    </AlertDescription>
                  </Alert>

                  {/* Sample Clinical Note */}
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-medium">SOAP Note - Sarah Johnson</h3>
                        <p className="text-sm text-muted-foreground">Generated from transcription REC-001</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Draft</Badge>
                        <Button size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Review & Edit
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium mb-2">Subjective:</h4>
                        <p className="text-muted-foreground mb-4">Patient reports mild headaches over the past week...</p>
                        
                        <h4 className="font-medium mb-2">Objective:</h4>
                        <p className="text-muted-foreground">Vital signs stable, BP 120/80...</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Assessment:</h4>
                        <p className="text-muted-foreground mb-4">Tension headaches, likely stress-related...</p>
                        
                        <h4 className="font-medium mb-2">Plan:</h4>
                        <p className="text-muted-foreground">Recommend stress management techniques...</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  EHR Integration Status
                </CardTitle>
                <CardDescription>HIPAA-compliant integration with electronic health records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Integration Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="font-medium">FlowIQ EHR Module</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">FHIR R4 Integration</p>
                      <Badge variant="default">Connected</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="font-medium">Legacy EHR Systems</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">HL7v2 Integration</p>
                      <Badge variant="secondary">Setup Required</Badge>
                    </div>
                  </div>

                  {/* Recent Integrations */}
                  <div>
                    <h3 className="font-medium mb-3">Recent EHR Transmissions</h3>
                    <div className="space-y-2">
                      {[
                        { patient: "Sarah Johnson", status: "success", timestamp: "2 hours ago", ehrId: "FHIR-001" },
                        { patient: "Mike Wilson", status: "success", timestamp: "4 hours ago", ehrId: "FHIR-002" },
                        { patient: "Emma Davis", status: "pending", timestamp: "6 hours ago", ehrId: "FHIR-003" }
                      ].map((transmission, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">{transmission.patient}</p>
                            <p className="text-sm text-muted-foreground">
                              {transmission.timestamp} • {transmission.ehrId}
                            </p>
                          </div>
                          <Badge variant={transmission.status === 'success' ? 'default' : 'secondary'}>
                            {transmission.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button>
                      <Send className="w-4 h-4 mr-2" />
                      Configure EHR
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Logs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Scribe iQ Configuration
                </CardTitle>
                <CardDescription>Configure AI models, HIPAA compliance, and workflow preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* AI Model Settings */}
                  <div>
                    <h3 className="font-medium mb-3">AI Model Configuration</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Transcription Model</p>
                          <p className="text-sm text-muted-foreground">Deepgram Nova-3 Medical</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Speaker Diarization</p>
                          <p className="text-sm text-muted-foreground">Automatic speaker identification</p>
                        </div>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Medical Terminology Accuracy</p>
                          <p className="text-sm text-muted-foreground">3.44% WER, 6.79% KER</p>
                        </div>
                        <Badge variant="default">Optimized</Badge>
                      </div>
                    </div>
                  </div>

                  {/* HIPAA Compliance */}
                  <div>
                    <h3 className="font-medium mb-3">HIPAA Compliance Status</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Data Encryption</p>
                          <p className="text-sm text-muted-foreground">AES-256 at rest, TLS 1.2+ in transit</p>
                        </div>
                        <Badge variant="default">Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Business Associate Agreements</p>
                          <p className="text-sm text-muted-foreground">PLAUD.AI, Deepgram, AWS</p>
                        </div>
                        <Badge variant="default">Signed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Audit Logging</p>
                          <p className="text-sm text-muted-foreground">Comprehensive PHI access tracking</p>
                        </div>
                        <Badge variant="default">Active</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScribeIQ;
