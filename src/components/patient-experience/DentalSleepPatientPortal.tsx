import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PatientAppointmentBooking } from '@/components/booking/PatientAppointmentBooking';
import { PatientFileUpload } from '@/components/patient-experience/PatientFileUpload';
import { 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  FileText, 
  MessageSquare,
  Download,
  Settings,
  Bell,
  LogOut,
  Moon,
  Gauge,
  Activity,
  Stethoscope,
  Heart,
  User,
  Phone,
  ArrowRight
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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  
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

  const handleScheduleAppointment = () => {
    setShowBookingModal(true);
  };

  const handleDownloadReport = () => {
    // In a real implementation, this would generate and download the actual report
    const reportData = {
      patientName: profile?.first_name + ' ' + profile?.last_name,
      reportDate: new Date().toLocaleDateString(),
      ahiScore: metrics.ahiScore,
      complianceHours: metrics.complianceHours,
      compliancePercentage: metrics.compliancePercentage,
      deviceType: metrics.deviceType
    };
    
    // Create a downloadable text file with sleep report summary
    const reportContent = `Sleep Medicine Report
Generated: ${reportData.reportDate}
Patient: ${reportData.patientName}

Current AHI Score: ${reportData.ahiScore}
Nightly Usage: ${reportData.complianceHours} hours
Compliance Rate: ${reportData.compliancePercentage}%
Device Type: ${reportData.deviceType}

Treatment Progress: Excellent improvement from initial AHI of 24.5 to current ${reportData.ahiScore}
Compliance Target: Met (above 4 hours nightly usage)
`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sleep-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Your sleep report has been downloaded successfully",
    });
  };

  const handleMessageCareTeam = () => {
    navigate('/patient/messages');
  };

  const handleDeviceHelp = () => {
    // In a real implementation, this could open a help modal or guide
    toast({
      title: "Device Help Guide",
      description: "Oral Appliance Care: Clean daily with mild soap and water. Use cleaning tablets 2-3 times per week. Store in provided case when not in use.",
      duration: 10000, // Show longer for important info
    });
  };

  const handleReschedule = (appointmentId: string) => {
    toast({
      title: "Reschedule Appointment",
      description: "Appointment rescheduling will be available soon",
    });
  };

  const handleEducationLink = (topic: string) => {
    toast({
      title: topic,
      description: "Educational content will be available soon",
    });
  };

  const handleSendMessage = () => {
    toast({
      title: "New Message",
      description: "Messaging feature will be available soon",
    });
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
                Dental Sleep IQ Patient Portal
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
          <Card 
            className="border-purple-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Current AHI Score Details",
              description: `Your AHI has improved from 24.5 to ${metrics.ahiScore} - a 66% reduction! This shows excellent treatment progress. AHI measures breathing disruptions per hour during sleep.`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gauge className="w-4 h-4 text-purple-600" />
                Current AHI Score
                <ArrowRight className="w-3 h-3 ml-auto text-purple-400" />
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

          <Card 
            className="border-purple-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Nightly Usage Details",
              description: `You're averaging ${metrics.complianceHours} hours per night with your oral appliance. This exceeds the 4-hour minimum for effective treatment. Keep up the excellent work!`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                Nightly Usage
                <ArrowRight className="w-3 h-3 ml-auto text-purple-400" />
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

          <Card 
            className="border-purple-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Compliance Rate Details",
              description: `Your ${metrics.compliancePercentage}% compliance rate is excellent! This means you're using your device consistently. Consistent use is key to successful sleep apnea treatment.`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Compliance Rate
                <ArrowRight className="w-3 h-3 ml-auto text-purple-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">{metrics.compliancePercentage}%</div>
              <Progress value={metrics.compliancePercentage} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card 
            className="border-purple-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleScheduleAppointment}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                Next Visit
                <ArrowRight className="w-3 h-3 ml-auto text-purple-400" />
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
                  <Button 
                    className="w-full justify-start bg-purple-600 hover:bg-purple-700"
                    onClick={handleScheduleAppointment}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Follow-up Visit
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-purple-200 hover:bg-purple-50"
                    onClick={handleDownloadReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Sleep Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-purple-200 hover:bg-purple-50"
                    onClick={handleMessageCareTeam}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Care Team
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-purple-200 hover:bg-purple-50"
                    onClick={handleDeviceHelp}
                  >
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
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleReschedule(apt.id)}
                        >
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
              {showFileUpload ? (
                <div className="space-y-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowFileUpload(false)}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    ← Back to Education
                  </Button>
                  <PatientFileUpload onFileUploaded={() => {
                    toast({
                      title: "File Uploaded",
                      description: "Your document has been uploaded successfully.",
                    });
                  }} />
                </div>
              ) : (
                <>
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
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEducationLink("Oral Appliance Care Guide")}
                          >
                            View Guide
                          </Button>
                        </div>
                        <div className="p-4 border border-purple-100 rounded-lg">
                          <h4 className="font-medium mb-2">Sleep Hygiene Tips</h4>
                          <p className="text-sm text-gray-600 mb-3">Improve your sleep environment and habits</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEducationLink("Sleep Hygiene Tips")}
                          >
                            Read More
                          </Button>
                        </div>
                        <div className="p-4 border border-purple-100 rounded-lg">
                          <h4 className="font-medium mb-2">Understanding Your AHI</h4>
                          <p className="text-sm text-gray-600 mb-3">What your sleep study numbers mean</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEducationLink("Understanding Your AHI")}
                          >
                            Learn More
                          </Button>
                        </div>
                        <div className="p-4 border border-purple-100 rounded-lg">
                          <h4 className="font-medium mb-2">Upload Your Documents</h4>
                          <p className="text-sm text-gray-600 mb-3">Share medical records and insurance documents</p>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setShowFileUpload(true)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Upload Files
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
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
                    <Button 
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={handleSendMessage}
                    >
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

      {/* Appointment Booking Modal */}
      <PatientAppointmentBooking 
        open={showBookingModal} 
        onOpenChange={setShowBookingModal} 
      />
    </div>
  );
};