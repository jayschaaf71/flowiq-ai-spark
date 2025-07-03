import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Users,
  Calendar,
  Clock,
  FileText,
  Phone,
  MessageSquare,
  Bell,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  ClipboardList,
  Mic,
  Search,
  Filter,
  Plus,
  QrCode,
  CreditCard,
  Activity
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  patient: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  dueTime: string;
  type: 'check-in' | 'insurance' | 'payment' | 'follow-up' | 'scheduling';
}

interface CheckInPatient {
  id: string;
  name: string;
  appointmentTime: string;
  provider: string;
  status: 'waiting' | 'checked-in' | 'in-room' | 'completed';
  insurance: boolean;
  urgent?: boolean;
}

export const StaffMobilePortal: React.FC = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('tasks');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const [tasks] = useState<Task[]>([
    { id: '1', title: 'Verify insurance for Sarah Johnson', patient: 'Sarah Johnson', priority: 'high', status: 'pending', dueTime: '9:00 AM', type: 'insurance' },
    { id: '2', title: 'Complete patient check-in', patient: 'Michael Chen', priority: 'high', status: 'in-progress', dueTime: '10:30 AM', type: 'check-in' },
    { id: '3', title: 'Process payment for Emily Davis', patient: 'Emily Davis', priority: 'medium', status: 'pending', dueTime: '2:00 PM', type: 'payment' },
    { id: '4', title: 'Schedule follow-up for Robert Smith', patient: 'Robert Smith', priority: 'low', status: 'pending', dueTime: '3:30 PM', type: 'follow-up' }
  ]);

  const [checkInQueue] = useState<CheckInPatient[]>([
    { id: '1', name: 'Sarah Johnson', appointmentTime: '9:00 AM', provider: 'Dr. Wilson', status: 'waiting', insurance: true },
    { id: '2', name: 'Michael Chen', appointmentTime: '10:30 AM', provider: 'Dr. Smith', status: 'checked-in', insurance: false, urgent: true },
    { id: '3', name: 'Emily Davis', appointmentTime: '2:00 PM', provider: 'Dr. Wilson', status: 'in-room', insurance: true },
    { id: '4', name: 'Robert Smith', appointmentTime: '3:30 PM', provider: 'Dr. Johnson', status: 'waiting', insurance: true }
  ]);

  const handleVoiceNote = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      toast({
        title: "Voice Note Started",
        description: "Recording patient note...",
      });
    } else {
      toast({
        title: "Voice Note Saved",
        description: "Note added to patient record",
      });
    }
  };

  const handleCheckIn = (patientId: string) => {
    toast({
      title: "Patient Checked In",
      description: "Patient has been successfully checked in",
    });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: CheckInPatient['status']) => {
    switch (status) {
      case 'waiting': return 'text-warning';
      case 'checked-in': return 'text-primary';
      case 'in-room': return 'text-success';
      case 'completed': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getTaskIcon = (type: Task['type']) => {
    switch (type) {
      case 'check-in': return UserCheck;
      case 'insurance': return ClipboardList;
      case 'payment': return CreditCard;
      case 'follow-up': return Calendar;
      case 'scheduling': return Clock;
      default: return FileText;
    }
  };

  if (!isMobile) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Staff Portal - Desktop Version</h1>
        <div className="text-center p-8 bg-muted rounded-lg">
          <p>This is the staff mobile portal. Please use a mobile device for the optimized experience.</p>
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
              <Users className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold">Staff Portal</h1>
              <p className="text-xs text-muted-foreground">Front Desk</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={isVoiceActive ? "default" : "outline"}
              size="sm"
              onClick={handleVoiceNote}
              className="relative"
            >
              <Mic className={`w-4 h-4 ${isVoiceActive ? 'animate-pulse' : ''}`} />
              {isVoiceActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4" />
              <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                {tasks.filter(t => t.priority === 'high').length}
              </Badge>
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-card border-b border-border/50 overflow-x-auto">
        {[
          { id: 'tasks', label: 'Tasks', icon: ClipboardList },
          { id: 'checkin', label: 'Check-In', icon: UserCheck },
          { id: 'schedule', label: 'Schedule', icon: Calendar },
          { id: 'messages', label: 'Messages', icon: MessageSquare }
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
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <>
            {/* Urgent Tasks Alert */}
            {tasks.filter(t => t.priority === 'high' && t.status === 'pending').length > 0 && (
              <Alert className="border-destructive/50 bg-destructive/5">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium text-destructive">
                    {tasks.filter(t => t.priority === 'high' && t.status === 'pending').length} urgent tasks need attention
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-destructive">
                    {tasks.filter(t => t.status === 'pending').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-warning">
                    {tasks.filter(t => t.status === 'in-progress').length}
                  </p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 text-center">
                  <p className="text-lg font-bold text-success">
                    {tasks.filter(t => t.status === 'completed').length}
                  </p>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {tasks.map(task => {
                const TaskIcon = getTaskIcon(task.type);
                return (
                  <Card key={task.id} className="hover-lift cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                          <TaskIcon className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{task.title}</h3>
                            <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{task.patient}</p>
                          <p className="text-xs text-muted-foreground">Due: {task.dueTime}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {task.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-success" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Check-In Tab */}
        {activeTab === 'checkin' && (
          <>
            {/* Search and Scan */}
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
                <QrCode className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Check-In Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{checkInQueue.filter(p => p.status === 'waiting').length}</p>
                      <p className="text-xs text-muted-foreground">Waiting</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                      <UserCheck className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <p className="text-lg font-bold">{checkInQueue.filter(p => p.status === 'checked-in').length}</p>
                      <p className="text-xs text-muted-foreground">Checked In</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient Queue */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <UserCheck className="w-5 h-5 text-primary" />
                  Check-In Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checkInQueue.map(patient => (
                  <div key={patient.id} className="p-4 border rounded-lg bg-gradient-subtle">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{patient.name}</h3>
                          <Badge 
                            variant={patient.status === 'completed' ? 'default' : 
                                   patient.status === 'in-room' ? 'secondary' : 'outline'}
                            className={`text-xs ${getStatusColor(patient.status)}`}
                          >
                            {patient.status.replace('-', ' ')}
                          </Badge>
                          {patient.urgent && (
                            <Badge variant="destructive" className="text-xs">Urgent</Badge>
                          )}
                          {!patient.insurance && (
                            <Badge variant="outline" className="text-xs text-warning">No Insurance</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {patient.appointmentTime} with {patient.provider}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {patient.status === 'waiting' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleCheckIn(patient.id)}
                          >
                            Check In
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Schedule Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-gradient-subtle rounded-lg">
                    <p className="text-2xl font-bold text-primary">24</p>
                    <p className="text-sm text-muted-foreground">Total Appointments</p>
                  </div>
                  <div className="text-center p-3 bg-gradient-subtle rounded-lg">
                    <p className="text-2xl font-bold text-warning">3</p>
                    <p className="text-sm text-muted-foreground">Cancellations</p>
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule New Appointment
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Next 3 Appointments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checkInQueue.slice(0, 3).map(patient => (
                  <div key={patient.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{patient.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {patient.appointmentTime} • {patient.provider}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Patient Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Sarah Johnson</p>
                        <p className="text-sm text-muted-foreground">Question about prescription refill</p>
                        <span className="text-xs text-muted-foreground">5 min ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-warning mt-2" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Michael Chen</p>
                        <p className="text-sm text-muted-foreground">Need to reschedule appointment</p>
                        <span className="text-xs text-muted-foreground">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              New Message
            </Button>
          </>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 p-2 mobile-safe-area">
        <div className="grid grid-cols-4 gap-1">
          {[
            { id: 'home', icon: Activity, label: 'Home' },
            { id: 'patients', icon: Users, label: 'Patients' },
            { id: 'reports', icon: FileText, label: 'Reports' },
            { id: 'settings', icon: ClipboardList, label: 'Settings' }
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