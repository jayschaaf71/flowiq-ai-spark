
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Stethoscope, 
  Mic, 
  FileText, 
  Clock, 
  CheckCircle,
  Users,
  TrendingUp,
  Settings,
  Play,
  Pause
} from "lucide-react";

const ScribeIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const stats = {
    sessionsToday: 34,
    transcriptionAccuracy: 98,
    timeSaved: 2.4,
    notesGenerated: 156,
    activeRecordings: 3,
    templatesUsed: 45
  };

  const recentSessions = [
    { patient: "Sarah Wilson", doctor: "Dr. Smith", duration: "24 min", words: 1250, status: "completed", time: "10 min ago" },
    { patient: "John Doe", doctor: "Dr. Johnson", duration: "18 min", words: 890, status: "transcribing", time: "ongoing" },
    { patient: "Mary Johnson", doctor: "Dr. Brown", duration: "32 min", words: 1680, status: "completed", time: "45 min ago" },
    { patient: "Robert Smith", doctor: "Dr. Wilson", duration: "15 min", words: 720, status: "reviewing", time: "1 hour ago" },
    { patient: "Lisa Brown", doctor: "Dr. Davis", duration: "28 min", words: 1420, status: "completed", time: "2 hours ago" }
  ];

  const appointmentTypes = [
    { type: "General Consultation", sessions: 18, accuracy: 98, avgTime: "22 min" },
    { type: "Follow-up Visit", sessions: 12, accuracy: 99, avgTime: "15 min" },
    { type: "Physical Exam", sessions: 8, accuracy: 97, avgTime: "35 min" },
    { type: "Specialist Referral", sessions: 6, accuracy: 96, avgTime: "18 min" }
  ];

  const transcriptionMetrics = [
    { metric: "Overall Accuracy", value: 98, target: 95, unit: "%" },
    { metric: "Processing Speed", value: 1.2, target: 2.0, unit: "x realtime" },
    { metric: "Time Saved", value: 2.4, target: 2.0, unit: "hours/day" },
    { metric: "Error Rate", value: 2, target: 5, unit: "%" }
  ];

  return (
    <Layout>
      <PageHeader 
        title="Scribe iQ"
        subtitle="AI-powered medical transcription and documentation"
        badge="AI Agent"
      />
      
      <div className="p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions Today</CardTitle>
              <Stethoscope className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sessionsToday}</div>
              <p className="text-xs text-muted-foreground">+6 from yesterday</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.transcriptionAccuracy}%</div>
              <Progress value={stats.transcriptionAccuracy} className="h-1 mt-1" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Clock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.timeSaved}h</div>
              <p className="text-xs text-muted-foreground">per day avg</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notes Generated</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.notesGenerated}</div>
              <p className="text-xs text-muted-foreground">this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Mic className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.activeRecordings}</div>
              <p className="text-xs text-muted-foreground">recordings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <Users className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.templatesUsed}</div>
              <p className="text-xs text-muted-foreground">used today</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Transcription Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentSessions.map((session, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">{session.patient}</div>
                          <div className="text-xs text-muted-foreground">
                            {session.doctor} • {session.duration} • {session.words} words • {session.time}
                          </div>
                        </div>
                        <Badge 
                          className={
                            session.status === "completed" ? "bg-green-100 text-green-800" :
                            session.status === "transcribing" ? "bg-blue-100 text-blue-800" :
                            "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {session.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Appointment Type Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {appointmentTypes.map((type, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{type.type}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{type.sessions}</Badge>
                            <span className="text-xs text-muted-foreground">{type.avgTime}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={type.accuracy} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground">{type.accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transcription Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transcription Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {transcriptionMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="text-sm font-medium mb-2">{metric.metric}</div>
                      <div className="text-2xl font-bold mb-1">
                        {metric.value}{metric.unit}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Progress 
                          value={metric.metric === "Error Rate" ? 100 - (metric.value / metric.target * 100) : (metric.value / metric.target * 100)} 
                          className="flex-1 h-2" 
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Target: {metric.target}{metric.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recordings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recording Management</CardTitle>
                <CardDescription>Manage and review transcription recordings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Mic className="w-12 h-12 mx-auto mb-4" />
                  <p>Recording management interface coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Note Templates</CardTitle>
                <CardDescription>Customize medical note templates and formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4" />
                  <p>Template editor coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transcription Analytics</CardTitle>
                <CardDescription>Accuracy metrics and efficiency insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <p>Analytics dashboard coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ScribeIQ;
