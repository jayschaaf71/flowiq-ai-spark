import React, { useState } from 'react';
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
  Activity,
  Smile,
  Heart,
  User,
  Phone,
  ArrowRight,
  Shield
} from 'lucide-react';

interface DentalMetrics {
  totalVisits: number;
  lastVisitDate: string;
  nextAppointment: string;
  oralHealthScore: number;
  cleaningsCompleted: number;
  treatmentsCompleted: number;
}

export const DentalPatientPortal: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  
  const [metrics] = useState<DentalMetrics>({
    totalVisits: 12,
    lastVisitDate: '2024-11-10',
    nextAppointment: '2024-12-18',
    oralHealthScore: 92,
    cleaningsCompleted: 4,
    treatmentsCompleted: 3
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
    const reportData = {
      patientName: profile?.first_name + ' ' + profile?.last_name,
      reportDate: new Date().toLocaleDateString(),
      totalVisits: metrics.totalVisits,
      oralHealthScore: metrics.oralHealthScore,
      cleaningsCompleted: metrics.cleaningsCompleted,
      treatmentsCompleted: metrics.treatmentsCompleted
    };
    
    const reportContent = `Dental Health Report
Generated: ${reportData.reportDate}
Patient: ${reportData.patientName}

Oral Health Summary:
Total Visits: ${reportData.totalVisits}
Oral Health Score: ${reportData.oralHealthScore}/100
Cleanings Completed: ${reportData.cleaningsCompleted}
Treatments Completed: ${reportData.treatmentsCompleted}

Oral Health Status: Excellent oral hygiene with consistent preventive care maintenance.
Recommendations: Continue regular cleanings and maintain daily oral care routine.
`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dental-health-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Your dental health report has been downloaded successfully",
    });
  };

  const handleMessageCareTeam = () => {
    navigate('/patient/messages');
  };

  const handleRequestRefill = () => {
    toast({
      title: "Prescription Refill",
      description: "Prescription refill requests will be available soon. Please call our office for immediate needs.",
      duration: 8000
    });
  };

  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-12-18',
      time: '11:00 AM',
      type: 'Routine Cleaning',
      provider: 'Dr. Sarah Martinez',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2025-01-22',
      time: '3:30 PM',
      type: 'Crown Placement',
      provider: 'Dr. Sarah Martinez',
      status: 'scheduled'
    }
  ];

  const recentTreatments = [
    {
      id: '1',
      date: '2024-11-10',
      type: 'Professional Cleaning',
      result: 'Excellent oral hygiene maintained',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-09-15',
      type: 'Cavity Filling',
      result: 'Composite restoration completed',
      status: 'completed'
    }
  ];

  const oralHealthTips = [
    {
      title: "Daily Brushing",
      description: "Brush twice daily with fluoride toothpaste for 2-3 minutes",
      icon: "🦷"
    },
    {
      title: "Floss Regularly",
      description: "Daily flossing removes plaque between teeth and gums",
      icon: "🧵"
    },
    {
      title: "Limit Sugary Foods",
      description: "Reduce candy, soda, and sticky foods that feed bacteria",
      icon: "🍭"
    },
    {
      title: "Regular Checkups",
      description: "Schedule cleanings every 6 months for preventive care",
      icon: "📅"
    }
  ];

  return (
    <div className="dental-iq-theme min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <style>{`
        .dental-iq-theme {
          --primary: 198 89% 48%;
          --primary-foreground: 0 0% 98%;
          --secondary: 198 93% 60%;
          --secondary-foreground: 198 10% 10%;
          --accent: 198 100% 91%;
          --accent-foreground: 198 10% 10%;
          --muted: 198 30% 95%;
          --muted-foreground: 198 5% 45%;
          --border: 198 30% 82%;
          --card: 0 0% 100%;
          --card-foreground: 198 10% 10%;
        }
      `}</style>
      
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header Banner */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  DentalIQ Patient Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Comprehensive Dental Care Management
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
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {profile?.first_name || 'Patient'}!
                </h2>
                <p className="text-blue-100 mb-4">
                  Your Dental Health Journey - Maintaining your brightest, healthiest smile
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {metrics.totalVisits} Visits
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Oral Health: Excellent</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{metrics.oralHealthScore}</div>
                <div className="text-blue-100 text-sm">Oral Health Score</div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Outstanding care</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card 
            className="border-blue-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Oral Health Score Details",
              description: `Your oral health score of ${metrics.oralHealthScore}/100 indicates excellent dental health. This score is based on regular cleanings, cavity prevention, and overall oral hygiene.`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-blue-600" />
                Oral Health Score
                <ArrowRight className="w-3 h-3 ml-auto text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{metrics.oralHealthScore}/100</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3" />
                Excellent health
              </p>
            </CardContent>
          </Card>

          <Card 
            className="border-blue-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Preventive Care Details",
              description: `You've completed ${metrics.cleaningsCompleted} professional cleanings this year. Regular cleanings every 6 months help prevent cavities and gum disease.`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Preventive Care
                <ArrowRight className="w-3 h-3 ml-auto text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{metrics.cleaningsCompleted}</div>
              <p className="text-xs text-blue-600">Cleanings this year</p>
            </CardContent>
          </Card>

          <Card 
            className="border-blue-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Treatment Summary",
              description: `You've completed ${metrics.treatmentsCompleted} dental treatments. All treatments have been successful with excellent healing and outcomes.`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Treatments
                <ArrowRight className="w-3 h-3 ml-auto text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">{metrics.treatmentsCompleted}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3" />
                All successful
              </p>
            </CardContent>
          </Card>

          <Card 
            className="border-blue-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleScheduleAppointment}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Next Visit
                <ArrowRight className="w-3 h-3 ml-auto text-blue-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-blue-700">Dec 18</div>
              <p className="text-xs text-blue-600">Routine cleaning</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="appointments" className="text-sm">Appointments</TabsTrigger>
            <TabsTrigger value="treatments" className="text-sm">Treatments</TabsTrigger>
            <TabsTrigger value="education" className="text-sm">Oral Health</TabsTrigger>
            <TabsTrigger value="messages" className="text-sm">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dental Health Progress */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smile className="w-5 h-5 text-blue-600" />
                    Dental Health Progress
                  </CardTitle>
                  <CardDescription>Your path to optimal oral health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Oral Health Score</span>
                    <span className="text-sm text-green-600">{metrics.oralHealthScore}/100</span>
                  </div>
                  <Progress value={metrics.oralHealthScore} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Preventive Care</span>
                    <span className="text-sm text-blue-600">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Treatment Success</span>
                    <span className="text-sm text-green-600">100%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                    onClick={handleScheduleAppointment}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-blue-200 hover:bg-blue-50"
                    onClick={handleRequestRefill}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Request Prescription
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-blue-200 hover:bg-blue-50"
                    onClick={handleDownloadReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Health Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-blue-200 hover:bg-blue-50"
                    onClick={handleMessageCareTeam}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Dental Team
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
              {upcomingAppointments.map((appointment) => (
                <Card key={appointment.id} className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{appointment.type}</h4>
                        <p className="text-sm text-gray-600">with {appointment.provider}</p>
                        <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                      </div>
                      <Badge variant="outline">{appointment.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="treatments">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Recent Treatments</h3>
              {recentTreatments.map((treatment) => (
                <Card key={treatment.id} className="bg-white/90 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{treatment.type}</h4>
                        <p className="text-sm text-gray-600">{treatment.result}</p>
                        <p className="text-sm text-gray-500">Date: {treatment.date}</p>
                      </div>
                      <Badge variant="secondary">{treatment.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Oral Health Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {oralHealthTips.map((tip, index) => (
                  <Card key={index} className="bg-white/90 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{tip.icon}</span>
                        <div>
                          <h4 className="font-semibold mb-1">{tip.title}</h4>
                          <p className="text-sm text-gray-600">{tip.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communicate with your dental team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No messages at this time. Click the message button to start a conversation with your dental team.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <PatientAppointmentBooking 
          open={showBookingModal}
          onOpenChange={setShowBookingModal}
        />
        
        {showFileUpload && (
          <PatientFileUpload 
            onClose={() => setShowFileUpload(false)}
          />
        )}
      </div>
    </div>
  );
};