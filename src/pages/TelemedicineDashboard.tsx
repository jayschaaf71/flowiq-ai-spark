import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VirtualConsultation from '@/components/telemedicine/VirtualConsultation';
import RemoteMonitoring from '@/components/telemedicine/RemoteMonitoring';
import { 
  Video, 
  Monitor, 
  Calendar, 
  Users, 
  Activity, 
  Heart,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Phone,
  MessageSquare,
  FileText,
  Wifi,
  Shield
} from 'lucide-react';

const TelemedicineDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data
  const upcomingConsultations = [
    {
      id: '1',
      patientName: 'John Smith',
      appointmentTime: '2:00 PM Today',
      type: 'Follow-up',
      duration: '30 min',
      status: 'scheduled',
      avatar: 'JS'
    },
    {
      id: '2',
      patientName: 'Sarah Johnson',
      appointmentTime: '3:30 PM Today',
      type: 'Initial Consultation',
      duration: '45 min',
      status: 'confirmed',
      avatar: 'SJ'
    },
    {
      id: '3',
      patientName: 'Michael Chen',
      appointmentTime: '10:00 AM Tomorrow',
      type: 'Check-up',
      duration: '30 min',
      status: 'pending',
      avatar: 'MC'
    }
  ];

  const recentConsultations = [
    {
      id: '1',
      patientName: 'Emma Wilson',
      date: 'Today, 11:00 AM',
      duration: '28 min',
      type: 'Follow-up',
      status: 'completed',
      notes: 'Patient showing improvement with current medication'
    },
    {
      id: '2',
      patientName: 'David Brown',
      date: 'Yesterday, 3:00 PM',
      duration: '35 min',
      type: 'Consultation',
      status: 'completed',
      notes: 'Prescribed new treatment plan'
    },
    {
      id: '3',
      patientName: 'Lisa Garcia',
      date: 'Yesterday, 10:30 AM',
      duration: '42 min',
      type: 'Initial',
      status: 'completed',
      notes: 'Comprehensive health assessment completed'
    }
  ];

  const monitoringAlerts = [
    {
      id: '1',
      patientName: 'Robert Taylor',
      type: 'Blood Pressure',
      value: '145/92 mmHg',
      status: 'high',
      timestamp: '15 min ago',
      severity: 'warning'
    },
    {
      id: '2',
      patientName: 'Maria Rodriguez',
      type: 'Heart Rate',
      value: '105 bpm',
      status: 'elevated',
      timestamp: '1 hour ago',
      severity: 'warning'
    },
    {
      id: '3',
      patientName: 'James Wilson',
      type: 'Glucose',
      value: '180 mg/dL',
      status: 'high',
      timestamp: '2 hours ago',
      severity: 'critical'
    }
  ];

  const platformStats = {
    totalPatients: 1247,
    activeConsultations: 3,
    completedToday: 12,
    monitoringDevices: 856,
    averageSessionTime: '32 min',
    patientSatisfaction: 4.8
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Telemedicine Platform</h1>
          <p className="text-muted-foreground">Manage virtual consultations and remote patient monitoring</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="consultations">Virtual Consultations</TabsTrigger>
            <TabsTrigger value="monitoring">Remote Monitoring</TabsTrigger>
            <TabsTrigger value="settings">Platform Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Patients</p>
                      <p className="text-2xl font-bold text-foreground">{platformStats.totalPatients.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Consultations</p>
                      <p className="text-2xl font-bold text-foreground">{platformStats.activeConsultations}</p>
                    </div>
                    <Video className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Today</p>
                      <p className="text-2xl font-bold text-foreground">{platformStats.completedToday}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Monitoring Devices</p>
                      <p className="text-2xl font-bold text-foreground">{platformStats.monitoringDevices}</p>
                    </div>
                    <Monitor className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Upcoming Consultations */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Consultations
                  </CardTitle>
                  <CardDescription>Today's scheduled virtual appointments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingConsultations.map((consultation) => (
                    <div key={consultation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium">{consultation.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{consultation.patientName}</p>
                          <p className="text-sm text-muted-foreground">{consultation.appointmentTime}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{consultation.type}</Badge>
                            <span className="text-xs text-muted-foreground">{consultation.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        Join
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule New
                  </Button>
                </CardContent>
              </Card>

              {/* Monitoring Alerts */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Monitoring Alerts
                  </CardTitle>
                  <CardDescription>Recent patient monitoring notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {monitoringAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground">{alert.patientName}</p>
                          <p className="text-sm text-muted-foreground">{alert.type}: {alert.value}</p>
                          <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                        </div>
                        <Badge 
                          variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" className="mt-2 w-full">
                        Review
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Consultations
                  </CardTitle>
                  <CardDescription>Recently completed sessions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentConsultations.map((consultation) => (
                    <div key={consultation.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{consultation.patientName}</p>
                        <Badge variant="default" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {consultation.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {consultation.date}
                          </span>
                          <span>{consultation.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Sessions
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Platform Performance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold text-foreground">{platformStats.averageSessionTime}</p>
                  <p className="text-sm text-muted-foreground">Average Session Time</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <p className="text-2xl font-bold text-foreground">{platformStats.patientSatisfaction}/5</p>
                  <p className="text-sm text-muted-foreground">Patient Satisfaction</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Wifi className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold text-foreground">99.8%</p>
                  <p className="text-sm text-muted-foreground">Platform Uptime</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Virtual Consultations Tab */}
          <TabsContent value="consultations">
            <VirtualConsultation />
          </TabsContent>

          {/* Remote Monitoring Tab */}
          <TabsContent value="monitoring">
            <RemoteMonitoring />
          </TabsContent>

          {/* Platform Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">Platform Settings</h2>
            
            <div className="grid gap-6">
              {/* Video Quality Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video Consultation Settings
                  </CardTitle>
                  <CardDescription>Configure video quality and features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Default Video Quality</label>
                      <p className="text-sm text-muted-foreground">Auto-adjust based on connection</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Recording Options</label>
                      <p className="text-sm text-muted-foreground">Automatic session recording</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Compliance
                  </CardTitle>
                  <CardDescription>HIPAA compliance and security features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">End-to-end encryption</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">HIPAA compliance</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data retention policy</span>
                      <Badge variant="outline">7 years</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Integration Settings */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Third-party Integrations</CardTitle>
                  <CardDescription>Connect with external systems and devices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center text-muted-foreground">
                    Integration settings coming soon...
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TelemedicineDashboard;