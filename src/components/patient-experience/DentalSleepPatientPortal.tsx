import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Moon, 
  Calendar, 
  FileText, 
  Activity,
  Clock,
  TrendingUp,
  Gauge,
  CheckCircle,
  AlertCircle,
  Download,
  Heart,
  Stethoscope,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  User
} from 'lucide-react';

interface SleepMetrics {
  ahiScore: number;
  complianceHours: number;
  lastStudyDate: string;
  nextAppointment: string;
  deviceType: string;
  compliancePercentage: number;
}

export const DentalSleepPatientPortal: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { currentTenant } = useCurrentTenant();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [metrics] = useState<SleepMetrics>({
    ahiScore: 8.2,
    complianceHours: 6.8,
    lastStudyDate: '2024-11-15',
    nextAppointment: '2024-12-20',
    deviceType: 'Oral Appliance',
    compliancePercentage: 87
  });

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNotifications = () => {
    navigate('/patient/notifications');
  };

  const handleSettings = () => {
    navigate('/patient/settings');
  };

  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-12-20',
      time: '10:00 AM',
      type: 'Sleep Medicine Follow-up',
      provider: 'Dr. Sarah Wilson',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2024-01-15',
      time: '2:30 PM',
      type: 'Appliance Adjustment',
      provider: 'Dr. Sarah Wilson',
      status: 'scheduled'
    }
  ];

  const recentResults = [
    {
      id: '1',
      date: '2024-11-15',
      type: 'Sleep Study Follow-up',
      result: 'AHI improved to 8.2 (from 24.5)',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-10-01',
      type: 'Oral Appliance Fitting',
      result: 'Custom device delivered',
      status: 'completed'
    }
  ];

  return (
    <div className="dental-sleep-iq-theme min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <style>{`
        .dental-sleep-iq-theme {
          --primary: 258 92% 66%;
          --primary-foreground: 0 0% 98%;
          --secondary: 258 90% 76%;
          --secondary-foreground: 258 10% 10%;
          --accent: 258 100% 94%;
          --accent-foreground: 258 10% 10%;
          --muted: 258 30% 95%;
          --muted-foreground: 258 5% 45%;
          --border: 258 30% 82%;
          --card: 0 0% 100%;
          --card-foreground: 258 10% 10%;
        }
      `}</style>
      
      <div className="container mx-auto p-4 max-w-7xl">
      {/* Prominent Header Banner */}
      <div className="bg-white shadow-sm border-b mb-6">
        <div className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {currentTenant?.name || 'Dental Sleep IQ'} Patient Portal
              </h1>
              <p className="text-sm text-gray-600">
                Sleep Medicine Management System
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleNotifications}>
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" onClick={handleSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, {profile?.first_name || 'Patient'}!
              </h2>
              <p className="text-purple-100 mb-4">
                Your Sleep Health Journey - Managing your sleep apnea with expertise and care
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {metrics.deviceType}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Treatment Progress: Excellent</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{metrics.ahiScore}</div>
              <div className="text-purple-100 text-sm">Current AHI Score</div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>66% improvement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-purple-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-600" />
                Current AHI Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{metrics.ahiScore}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                Significant improvement
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Nightly Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{metrics.complianceHours}h</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3" />
                Above 4h target
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Compliance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{metrics.compliancePercentage}%</div>
              <Progress value={metrics.compliancePercentage} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Next Visit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-purple-700">Dec 20</div>
              <p className="text-xs text-purple-600">Follow-up appointment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="appointments" className="text-sm">Appointments</TabsTrigger>
            <TabsTrigger value="results" className="text-sm">Sleep Studies</TabsTrigger>
            <TabsTrigger value="education" className="text-sm">Education</TabsTrigger>
            <TabsTrigger value="messages" className="text-sm">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sleep Health Progress */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    Sleep Health Progress
                  </CardTitle>
                  <CardDescription>Your journey to better sleep</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">AHI Improvement</span>
                    <span className="text-sm text-green-600">66% reduction</span>
                  </div>
                  <Progress value={66} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Device Compliance</span>
                    <span className="text-sm text-green-600">{metrics.compliancePercentage}%</span>
                  </div>
                  <Progress value={metrics.compliancePercentage} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sleep Quality Score</span>
                    <span className="text-sm text-blue-600">8.5/10</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-purple-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Follow-up Visit
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50">
                    <Download className="w-4 h-4 mr-2" />
                    Download Sleep Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Care Team
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-purple-200 hover:bg-purple-50">
                    <Settings className="w-4 h-4 mr-2" />
                    Device Settings Help
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentResults.map((result) => (
                    <div key={result.id} className="flex items-center gap-4 p-4 border border-purple-100 rounded-lg">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{result.type}</div>
                        <div className="text-sm text-gray-600">{result.result}</div>
                        <div className="text-xs text-gray-500">{result.date}</div>
                      </div>
                      <Badge variant="outline" className="border-green-200 text-green-700">
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription>Your scheduled sleep medicine visits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 border border-purple-100 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{apt.type}</div>
                          <div className="text-sm text-gray-600">with {apt.provider}</div>
                          <div className="text-sm text-gray-500">{apt.date} at {apt.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={apt.status === 'confirmed' ? 'default' : 'secondary'}
                          className={apt.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {apt.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Sleep Study Results
                </CardTitle>
                <CardDescription>Your sleep health assessments and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">24.5 → 8.2</div>
                      <div className="text-sm text-purple-600">AHI Score Improvement</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">6.8 hrs</div>
                      <div className="text-sm text-green-600">Average Nightly Use</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">87%</div>
                      <div className="text-sm text-blue-600">30-Day Compliance</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Treatment Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Initial Sleep Study</div>
                          <div className="text-sm text-gray-600">Severe OSA diagnosed (AHI: 24.5) - Sept 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Oral Appliance Fitted</div>
                          <div className="text-sm text-gray-600">Custom mandibular advancement device - Oct 2024</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        <div className="flex-1">
                          <div className="font-medium">Follow-up Study</div>
                          <div className="text-sm text-gray-600">Significant improvement (AHI: 8.2) - Nov 2024</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  Sleep Health Education
                </CardTitle>
                <CardDescription>Resources to improve your sleep wellness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-purple-100 rounded-lg">
                    <h4 className="font-medium mb-2">Oral Appliance Care</h4>
                    <p className="text-sm text-gray-600 mb-3">Learn proper cleaning and maintenance techniques</p>
                    <Button size="sm" variant="outline">View Guide</Button>
                  </div>
                  <div className="p-4 border border-purple-100 rounded-lg">
                    <h4 className="font-medium mb-2">Sleep Hygiene Tips</h4>
                    <p className="text-sm text-gray-600 mb-3">Improve your sleep environment and habits</p>
                    <Button size="sm" variant="outline">Read More</Button>
                  </div>
                  <div className="p-4 border border-purple-100 rounded-lg">
                    <h4 className="font-medium mb-2">Understanding Your AHI</h4>
                    <p className="text-sm text-gray-600 mb-3">What your sleep study numbers mean</p>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                  <div className="p-4 border border-purple-100 rounded-lg">
                    <h4 className="font-medium mb-2">Exercise & Sleep</h4>
                    <p className="text-sm text-gray-600 mb-3">How physical activity affects sleep quality</p>
                    <Button size="sm" variant="outline">View Tips</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="space-y-6">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Care Team Messages
                </CardTitle>
                <CardDescription>Communicate with your sleep medicine team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        Dr
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">Dr. Sarah Wilson</div>
                        <div className="text-sm text-blue-700 mb-2">Great progress on your compliance! Your AHI has improved significantly.</div>
                        <div className="text-xs text-blue-600">2 days ago</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send New Message
                    </Button>
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