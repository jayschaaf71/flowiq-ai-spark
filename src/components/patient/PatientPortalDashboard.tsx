import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  Heart, 
  Pill, 
  Activity,
  Bell,
  Download,
  Video,
  BookOpen,
  Shield,
  Clock
} from 'lucide-react';

const PatientPortalDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - would come from API
  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-01-25',
      time: '10:00 AM',
      provider: 'Dr. Smith',
      type: 'Annual Checkup',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2024-02-10',
      time: '2:30 PM',
      provider: 'Dr. Johnson',
      type: 'Follow-up',
      status: 'pending'
    }
  ];

  const healthMetrics = {
    bloodPressure: { value: '120/80', status: 'normal', lastUpdated: '2024-01-20' },
    weight: { value: '165 lbs', status: 'normal', lastUpdated: '2024-01-20' },
    heartRate: { value: '72 bpm', status: 'normal', lastUpdated: '2024-01-20' },
    glucoseLevel: { value: '95 mg/dL', status: 'normal', lastUpdated: '2024-01-18' }
  };

  const medications = [
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      nextRefill: '2024-02-15',
      pillsRemaining: 15
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      nextRefill: '2024-02-20',
      pillsRemaining: 28
    }
  ];

  const educationModules = [
    {
      title: 'Managing Diabetes',
      progress: 75,
      category: 'Chronic Care',
      duration: '15 min',
      completed: false
    },
    {
      title: 'Heart Healthy Living',
      progress: 100,
      category: 'Prevention',
      duration: '20 min',
      completed: true
    },
    {
      title: 'Medication Adherence',
      progress: 30,
      category: 'Treatment',
      duration: '10 min',
      completed: false
    }
  ];

  const messages = [
    {
      id: '1',
      from: 'Dr. Smith',
      subject: 'Lab Results Available',
      preview: 'Your recent blood work results are now available...',
      time: '2 hours ago',
      unread: true
    },
    {
      id: '2',
      from: 'Nurse Jennifer',
      subject: 'Appointment Reminder',
      preview: 'This is a reminder about your upcoming appointment...',
      time: '1 day ago',
      unread: false
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, John</h1>
          <p className="text-muted-foreground">Manage your health and stay connected with your care team</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="health">Health Tracking</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Quick Stats */}
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">Jan 25</div>
                  <p className="text-xs text-muted-foreground">Dr. Smith - 10:00 AM</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">3</div>
                  <p className="text-xs text-muted-foreground">From care team</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">85%</div>
                  <p className="text-xs text-muted-foreground">Good overall health</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Medications</CardTitle>
                  <Pill className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">2</div>
                  <p className="text-xs text-muted-foreground">All up to date</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-foreground">{apt.type}</p>
                        <p className="text-sm text-muted-foreground">{apt.provider}</p>
                        <p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p>
                      </div>
                      <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Schedule New Appointment
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Health Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(healthMetrics).map(([key, metric]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        <p className="text-sm text-muted-foreground">Last: {metric.lastUpdated}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-foreground">{metric.value}</p>
                        <Badge variant={metric.status === 'normal' ? 'default' : 'destructive'}>
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Log New Reading
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">My Appointments</h2>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule New
              </Button>
            </div>

            <div className="grid gap-4">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{apt.type}</h3>
                        <p className="text-muted-foreground">{apt.provider}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {apt.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {apt.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={apt.status === 'confirmed' ? 'default' : 'secondary'}>
                          {apt.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Video className="mr-2 h-4 w-4" />
                          Join Virtual
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Health Tracking Tab */}
          <TabsContent value="health" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Health Tracking</h2>
              <Button>
                <Activity className="mr-2 h-4 w-4" />
                Log New Reading
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(healthMetrics).map(([key, metric]) => (
                <Card key={key} className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</CardTitle>
                    <CardDescription>Last updated: {metric.lastUpdated}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
                    <Badge variant={metric.status === 'normal' ? 'default' : 'destructive'}>
                      {metric.status}
                    </Badge>
                    <div className="mt-4">
                      <Button variant="outline" size="sm">View History</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">My Medications</h2>
              <Button>
                <Pill className="mr-2 h-4 w-4" />
                Request Refill
              </Button>
            </div>

            <div className="grid gap-4">
              {medications.map((med, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-foreground">{med.name}</h3>
                        <p className="text-muted-foreground">{med.dosage} - {med.frequency}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Next refill: {med.nextRefill}</span>
                          <span>{med.pillsRemaining} pills remaining</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Request Refill
                        </Button>
                        <Button variant="outline" size="sm">
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Health Education</h2>
              <Button>
                <BookOpen className="mr-2 h-4 w-4" />
                Browse Library
              </Button>
            </div>

            <div className="grid gap-4">
              {educationModules.map((module, index) => (
                <Card key={index} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">{module.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="outline">{module.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {module.duration}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {module.completed && <Badge variant="default">Completed</Badge>}
                        <Button variant="outline" size="sm">
                          {module.completed ? 'Review' : 'Continue'}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Messages</h2>
              <Button>
                <MessageSquare className="mr-2 h-4 w-4" />
                New Message
              </Button>
            </div>

            <div className="grid gap-4">
              {messages.map((message) => (
                <Card key={message.id} className={`bg-card border-border ${message.unread ? 'border-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">{message.subject}</h3>
                          {message.unread && <Badge variant="default" className="px-2 py-1 text-xs">New</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">From: {message.from}</p>
                        <p className="text-muted-foreground">{message.preview}</p>
                        <p className="text-xs text-muted-foreground">{message.time}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Read
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PatientPortalDashboard;