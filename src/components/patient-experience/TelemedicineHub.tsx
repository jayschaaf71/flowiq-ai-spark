
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Phone, 
  Calendar, 
  Clock,
  Users,
  Settings,
  Monitor,
  Mic,
  MicOff,
  VideoOff,
  PhoneCall,
  MessageSquare,
  FileText,
  Download
} from 'lucide-react';

interface VirtualAppointment {
  id: string;
  patientName: string;
  providerName: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'emergency';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingLink?: string;
}

export const TelemedicineHub: React.FC = () => {
  const [activeCall, setActiveCall] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const [upcomingAppointments] = useState<VirtualAppointment[]>([
    {
      id: '1',
      patientName: 'John Doe',
      providerName: 'Dr. Sarah Smith',
      date: '2024-01-20',
      time: '10:00 AM',
      duration: 30,
      type: 'consultation',
      status: 'scheduled',
      meetingLink: 'https://meet.example.com/abc123'
    },
    {
      id: '2',
      patientName: 'Jane Wilson',
      providerName: 'Dr. Michael Johnson',
      date: '2024-01-20',
      time: '2:00 PM',
      duration: 15,
      type: 'follow-up',
      status: 'scheduled',
      meetingLink: 'https://meet.example.com/def456'
    }
  ]);

  const [pastAppointments] = useState<VirtualAppointment[]>([
    {
      id: '3',
      patientName: 'Robert Brown',
      providerName: 'Dr. Emily Davis',
      date: '2024-01-18',
      time: '3:00 PM',
      duration: 45,
      type: 'consultation',
      status: 'completed'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Video;
      case 'follow-up': return Phone;
      case 'emergency': return PhoneCall;
      default: return Video;
    }
  };

  const startCall = () => {
    setActiveCall(true);
  };

  const endCall = () => {
    setActiveCall(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Video className="h-8 w-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold">Telemedicine Hub</h2>
          <p className="text-gray-600">Virtual consultations and remote healthcare</p>
        </div>
      </div>

      {/* Active Call Interface */}
      {activeCall && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Video className="h-5 w-5" />
              Call in Progress - Dr. Sarah Smith
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg aspect-video mb-4 flex items-center justify-center">
              <div className="text-white text-center">
                <Monitor className="h-16 w-16 mx-auto mb-2 opacity-50" />
                <p>Video call interface would appear here</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={micEnabled ? "default" : "destructive"}
                size="lg"
                onClick={() => setMicEnabled(!micEnabled)}
              >
                {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              
              <Button
                variant={videoEnabled ? "default" : "destructive"}
                size="lg"
                onClick={() => setVideoEnabled(!videoEnabled)}
              >
                {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Button variant="destructive" size="lg" onClick={endCall}>
                <PhoneCall className="h-5 w-5" />
                End Call
              </Button>
              
              <Button variant="outline" size="lg">
                <MessageSquare className="h-5 w-5" />
                Chat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600">Total Virtual Visits</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-gray-600">Scheduled Today</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">28 min</div>
              <div className="text-sm text-gray-600">Avg Duration</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600">Connection Quality</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Virtual Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Virtual Appointments
          </CardTitle>
          <CardDescription>
            Your scheduled telemedicine consultations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => {
              const TypeIcon = getTypeIcon(appointment.type);
              
              return (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <TypeIcon className="h-8 w-8 text-gray-600" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{appointment.providerName}</h3>
                          <Badge className={getStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {appointment.date} at {appointment.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {appointment.duration} minutes • {appointment.type}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Test Setup
                      </Button>
                      <Button size="sm" onClick={startCall}>
                        <Video className="h-4 w-4 mr-2" />
                        Join Call
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Past Appointments & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Virtual Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastAppointments.map((appointment) => {
                const TypeIcon = getTypeIcon(appointment.type);
                
                return (
                  <div key={appointment.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <TypeIcon className="h-6 w-6 text-gray-600" />
                        <div>
                          <div className="font-medium">{appointment.providerName}</div>
                          <div className="text-sm text-gray-600">
                            {appointment.date} • {appointment.duration} min
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Telemedicine Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Video className="h-6 w-6 text-blue-600" />
                <div>
                  <div className="font-medium">HD Video Calls</div>
                  <div className="text-sm text-gray-600">Crystal clear video consultations</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-600" />
                <div>
                  <div className="font-medium">Secure Messaging</div>
                  <div className="text-sm text-gray-600">HIPAA-compliant chat during calls</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <FileText className="h-6 w-6 text-purple-600" />
                <div>
                  <div className="font-medium">Document Sharing</div>
                  <div className="text-sm text-gray-600">Share files and prescriptions</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
                <div>
                  <div className="font-medium">Multi-party Calls</div>
                  <div className="text-sm text-gray-600">Include family or specialists</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
