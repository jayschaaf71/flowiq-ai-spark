import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Stethoscope,
  Calendar,
  Users,
  FileText,
  Clock,
  MessageSquare,
  Bell,
  ChevronRight,
  Phone,
  Video,
  Mic,
  Plus,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Activity,
  Shield,
  Zap
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  lastVisit: string;
  condition: string;
  status: 'stable' | 'needs-attention' | 'critical';
  nextAppointment?: string;
}

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed';
  urgent?: boolean;
}

export const ProviderMobilePortal: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('overview');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const [todayAppointments] = useState<Appointment[]>([
    { id: '1', patientName: 'Sarah Johnson', time: '9:00 AM', type: 'Follow-up', status: 'confirmed' },
    { id: '2', patientName: 'Michael Chen', time: '10:30 AM', type: 'New Patient', status: 'pending', urgent: true },
    { id: '3', patientName: 'Emily Davis', time: '2:00 PM', type: 'Consultation', status: 'confirmed' },
    { id: '4', patientName: 'Robert Smith', time: '3:30 PM', type: 'Follow-up', status: 'completed' }
  ]);

  const [recentPatients] = useState<Patient[]>([
    { id: '1', name: 'Sarah Johnson', age: 34, lastVisit: '2 days ago', condition: 'Diabetes Management', status: 'stable' },
    { id: '2', name: 'Michael Chen', age: 28, lastVisit: '1 week ago', condition: 'Hypertension', status: 'needs-attention' },
    { id: '3', name: 'Emily Davis', age: 45, lastVisit: '3 days ago', condition: 'Routine Checkup', status: 'stable' },
    { id: '4', name: 'Robert Smith', age: 52, lastVisit: '1 day ago', condition: 'Post-Surgery', status: 'critical' }
  ]);

  const [alerts] = useState([
    { id: '1', type: 'urgent', message: 'Lab results ready for Michael Chen - requires immediate attention', time: '5 min ago' },
    { id: '2', type: 'info', message: 'Sarah Johnson missed her follow-up call', time: '1 hour ago' },
    { id: '3', type: 'warning', message: 'Prescription refill needed for Emily Davis', time: '2 hours ago' }
  ]);

  const handleVoiceCommand = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      toast({
        title: "Voice Assistant Activated",
        description: "Listening for your command...",
      });
    }
  };

  const getStatusColor = (status: Patient['status']) => {
    switch (status) {
      case 'stable': return 'text-success';
      case 'needs-attention': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: Patient['status']) => {
    switch (status) {
      case 'stable': return CheckCircle;
      case 'needs-attention': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return CheckCircle;
    }
  };

  if (!isMobile) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Provider Portal - Desktop Version</h1>
        <div className="text-center p-8 bg-muted rounded-lg">
          <p>This is the provider mobile portal. Please use a mobile device for the optimized experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Mobile Header */}
      <div className="bg-card/95 backdrop-blur-sm border-b border-border/50 px-4 py-3 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Dr. Sarah Wilson</h1>
              <p className="text-xs text-muted-foreground">Internal Medicine</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isVoiceActive ? "default" : "outline"}
              size="sm"
              onClick={handleVoiceCommand}
              className="relative"
            >
              <Mic className={`w-4 h-4 ${isVoiceActive ? 'animate-pulse' : ''}`} />
              {isVoiceActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
              {alerts.length > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                  {alerts.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-card border-b border-border/50 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'patients', label: 'Patients', icon: Users },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'notes', label: 'Notes', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-3 px-4 min-w-0 flex-1 transition-colors ${
                activeTab === tab.id
                  ? 'text-primary bg-primary/10 border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-4 pb-20 space-y-4">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Urgent Alerts */}
            {alerts.filter(a => a.type === 'urgent').map(alert => (
              <Alert key={alert.id} className="border-destructive/50 bg-destructive/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium text-destructive">Urgent</div>
                  <div className="text-sm">{alert.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                </AlertDescription>
              </Alert>
            ))}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{todayAppointments.length}</p>
                      <p className="text-sm text-muted-foreground">Today's Appointments</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{recentPatients.filter(p => p.status === 'needs-attention' || p.status === 'critical').length}</p>
                      <p className="text-sm text-muted-foreground">Need Attention</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Next Appointment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-primary" />
                  Next Appointment
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.filter(apt => apt.status !== 'completed')[0] && (
                  <div className="p-4 bg-gradient-subtle rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{todayAppointments.filter(apt => apt.status !== 'completed')[0].patientName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {todayAppointments.filter(apt => apt.status !== 'completed')[0].time} • {todayAppointments.filter(apt => apt.status !== 'completed')[0].type}
                        </p>
                        {todayAppointments.filter(apt => apt.status !== 'completed')[0].urgent && (
                          <Badge variant="destructive" className="text-xs mt-1">Urgent</Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Video className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="w-5 h-5 text-warning" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {alerts.slice(0, 3).map(alert => (
                  <div key={alert.id} className="p-3 border rounded-lg hover-lift cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        alert.type === 'urgent' ? 'bg-destructive' : 
                        alert.type === 'warning' ? 'bg-warning' : 'bg-primary'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Patients Tab */}
        {activeTab === 'patients' && (
          <>
            {/* Search */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Patient List */}
            <div className="space-y-3">
              {recentPatients.map(patient => {
                const StatusIcon = getStatusIcon(patient.status);
                return (
                  <Card key={patient.id} className="hover-lift cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{patient.name}</h3>
                            <Badge variant="outline" className="text-xs">{patient.age}y</Badge>
                            <StatusIcon className={`w-4 h-4 ${getStatusColor(patient.status)}`} />
                          </div>
                          <p className="text-sm text-muted-foreground">{patient.condition}</p>
                          <p className="text-xs text-muted-foreground">Last visit: {patient.lastVisit}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Patient
            </Button>
          </>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayAppointments.map(appointment => (
                  <div key={appointment.id} className="p-4 border rounded-lg bg-gradient-subtle">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{appointment.patientName}</h3>
                          <Badge 
                            variant={appointment.status === 'completed' ? 'default' : 
                                   appointment.status === 'confirmed' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {appointment.status}
                          </Badge>
                          {appointment.urgent && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {appointment.time} • {appointment.type}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Schedule New Appointment
            </Button>
          </>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-primary" />
                  Voice Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mb-4" 
                  onClick={handleVoiceCommand}
                  variant={isVoiceActive ? "destructive" : "default"}
                >
                  <Mic className="w-4 h-4 mr-2" />
                  {isVoiceActive ? 'Stop Recording' : 'Start Voice Note'}
                </Button>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Patient: Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Blood pressure stable, continue current medication...</p>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Patient: Michael Chen</p>
                    <p className="text-sm text-muted-foreground">Follow-up needed for lab results, schedule in 2 weeks...</p>
                    <span className="text-xs text-muted-foreground">4 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 p-2 mobile-safe-area">
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'home', icon: Activity, label: 'Home' },
            { id: 'emergency', icon: Shield, label: 'Emergency' },
            { id: 'ai', icon: Zap, label: 'AI Assistant' },
            { id: 'profile', icon: Stethoscope, label: 'Profile' }
          ].map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className="flex flex-col items-center py-2 px-1 rounded-lg transition-colors hover:bg-accent/50 text-muted-foreground hover:text-foreground"
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};