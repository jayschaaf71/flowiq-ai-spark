import React, { useState } from 'react';
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
  Database
} from 'lucide-react';

interface SOAPNote {
  id: string;
  patientName: string;
  date: string;
  status: 'draft' | 'completed' | 'reviewed';
  type: string;
  duration: number;
  transcription: string;
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
  const [selectedTab, setSelectedTab] = useState('soap-notes');

  // Mock data
  const soapNotes: SOAPNote[] = [
    {
      id: '1',
      patientName: 'Sarah Johnson',
      date: '2024-01-15',
      status: 'completed',
      type: 'Sleep Study Review',
      duration: 45,
      transcription: 'Patient reports improved sleep quality with CPAP therapy. AHI reduced from 25 to 3. Compliance rate at 85%.'
    },
    {
      id: '2',
      patientName: 'Michael Chen',
      date: '2024-01-14',
      status: 'draft',
      type: 'CPAP Fitting',
      duration: 30,
      transcription: 'Initial CPAP fitting completed. Patient tolerated well. Mask fitting optimal. Instructions provided.'
    },
    {
      id: '3',
      patientName: 'Lisa Rodriguez',
      date: '2024-01-13',
      status: 'reviewed',
      type: 'Follow-up',
      duration: 20,
      transcription: 'Follow-up visit. Patient reports mild discomfort with mask. Adjusted settings and provided new cushion.'
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

  const handleStartRecording = () => {
    setIsRecording(true);
    setCurrentTranscription('Starting voice transcription...');
    // Simulate transcription
    setTimeout(() => {
      setCurrentTranscription('Patient reports improved sleep quality with CPAP therapy. AHI reduced from 25 to 3. Compliance rate at 85%.');
    }, 2000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setCurrentTranscription('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'reviewed':
        return 'bg-blue-500 text-white';
      case 'draft':
        return 'bg-yellow-500 text-white';
      case 'active':
        return 'bg-green-500 text-white';
      case 'follow-up':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Clinical Assistant</h1>
          <p className="text-gray-600">AI-powered clinical documentation and patient management</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            AI Assistant
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="soap-notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            SOAP Notes
          </TabsTrigger>
          <TabsTrigger value="patient-records" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patient Records
          </TabsTrigger>
          <TabsTrigger value="voice-transcription" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice Transcription
          </TabsTrigger>
        </TabsList>

        {/* SOAP Notes Tab */}
        <TabsContent value="soap-notes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent SOAP Notes */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Recent SOAP Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {soapNotes.map((note) => (
                    <div key={note.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(note.status)}`}>
                          <FileText className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{note.patientName}</div>
                          <div className="text-sm text-gray-600">{note.type} • {note.date}</div>
                          <div className="text-xs text-gray-500 mt-1">{note.duration} minutes</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(note.status)}>
                          {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  Create New SOAP Note
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Records
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Notes
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Search className="mr-2 h-4 w-4" />
                  Search Records
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Patient Records Tab */}
        <TabsContent value="patient-records" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientRecords.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full ${getStatusColor(patient.status)}`}>
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-600">{patient.diagnosis}</div>
                          <div className="text-xs text-gray-500 mt-1">Last visit: {patient.lastVisit}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Patient Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Patient Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-green-900">Active Patients</div>
                    <div className="text-sm text-green-700">24 patients</div>
                  </div>
                  <div className="text-2xl font-bold text-green-900">24</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium text-blue-900">This Month</div>
                    <div className="text-sm text-blue-700">12 new patients</div>
                  </div>
                  <div className="text-2xl font-bold text-blue-900">12</div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="font-medium text-purple-900">Follow-ups</div>
                    <div className="text-sm text-purple-700">8 scheduled</div>
                  </div>
                  <div className="text-2xl font-bold text-purple-900">8</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Voice Transcription Tab */}
        <TabsContent value="voice-transcription" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Recorder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Transcription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="text-center">
                    <Mic className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Click to start voice transcription</p>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={handleStartRecording}
                        disabled={isRecording}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Recording
                      </Button>
                      <Button 
                        onClick={handleStopRecording}
                        disabled={!isRecording}
                        variant="outline"
                      >
                        <Square className="mr-2 h-4 w-4" />
                        Stop
                      </Button>
                    </div>
                  </div>
                </div>
                
                {currentTranscription && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Live Transcription:</h4>
                    <p className="text-sm text-gray-700">{currentTranscription}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Clinical Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Treatment Recommendations</h4>
                  <p className="text-sm text-blue-700">Based on patient history, consider CPAP pressure adjustment.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Follow-up Scheduling</h4>
                  <p className="text-sm text-green-700">Schedule 3-month follow-up for compliance review.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Insurance Alert</h4>
                  <p className="text-sm text-orange-700">Verify insurance coverage for DME equipment.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 