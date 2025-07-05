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
import { ChiropracticSymptomChecker } from '@/components/patient-experience/ChiropracticSymptomChecker';
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
  Stethoscope,
  Heart,
  User,
  Phone,
  ArrowRight,
  Zap
} from 'lucide-react';

interface ChiroMetrics {
  totalVisits: number;
  lastVisitDate: string;
  nextAppointment: string;
  treatmentProgress: number;
  painReduction: number;
  mobilityImprovement: number;
}

export const ChiropracticPatientPortal: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSymptomChecker, setShowSymptomChecker] = useState(false);
  
  const [metrics] = useState<ChiroMetrics>({
    totalVisits: 8,
    lastVisitDate: '2024-11-20',
    nextAppointment: '2024-12-15',
    treatmentProgress: 75,
    painReduction: 60,
    mobilityImprovement: 80
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

  const handleSymptomChecker = () => {
    setShowSymptomChecker(true);
  };

  const handleDownloadReport = () => {
    const reportData = {
      patientName: profile?.first_name + ' ' + profile?.last_name,
      reportDate: new Date().toLocaleDateString(),
      totalVisits: metrics.totalVisits,
      treatmentProgress: metrics.treatmentProgress,
      painReduction: metrics.painReduction,
      mobilityImprovement: metrics.mobilityImprovement
    };
    
    const reportContent = `Chiropractic Treatment Report
Generated: ${reportData.reportDate}
Patient: ${reportData.patientName}

Treatment Summary:
Total Visits: ${reportData.totalVisits}
Treatment Progress: ${reportData.treatmentProgress}%
Pain Reduction: ${reportData.painReduction}%
Mobility Improvement: ${reportData.mobilityImprovement}%

Progress Notes: Patient showing excellent response to chiropractic care with significant improvement in pain management and spinal mobility.
`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chiropractic-report.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Your chiropractic treatment report has been downloaded successfully",
    });
  };

  const handleMessageCareTeam = () => {
    navigate('/patient/messages');
  };

  if (showSymptomChecker) {
    return (
      <ChiropracticSymptomChecker 
        onComplete={(data) => {
          console.log('Symptom assessment completed:', data);
          setShowSymptomChecker(false);
          toast({
            title: "Assessment Complete",
            description: "Your symptom assessment has been saved for your next appointment.",
          });
        }}
        onBack={() => setShowSymptomChecker(false)}
      />
    );
  }

  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-12-15',
      time: '2:00 PM',
      type: 'Chiropractic Adjustment',
      provider: 'Dr. Michael Johnson',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2024-12-29',
      time: '10:30 AM',
      type: 'Follow-up Assessment',
      provider: 'Dr. Michael Johnson',
      status: 'scheduled'
    }
  ];

  const recentTreatments = [
    {
      id: '1',
      date: '2024-11-20',
      type: 'Spinal Adjustment',
      result: 'Improved mobility in lumbar region',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-11-06',
      type: 'Therapeutic Massage',
      result: 'Reduced muscle tension',
      status: 'completed'
    }
  ];

  return (
    <div className="chiropractic-iq-theme min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <style>{`
        .chiropractic-iq-theme {
          --primary: 142 76% 36%;
          --primary-foreground: 0 0% 98%;
          --secondary: 142 69% 58%;
          --secondary-foreground: 142 10% 10%;
          --accent: 142 100% 93%;
          --accent-foreground: 142 10% 10%;
          --muted: 142 30% 95%;
          --muted-foreground: 142 5% 45%;
          --border: 142 30% 82%;
          --card: 0 0% 100%;
          --card-foreground: 142 10% 10%;
        }
      `}</style>
      
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header Banner */}
        <div className="bg-white shadow-sm border-b mb-6">
          <div className="flex items-center justify-between py-4 px-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  ChiroIQ Patient Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Chiropractic Care Management
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
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome back, {profile?.first_name || 'Patient'}!
                </h2>
                <p className="text-green-100 mb-4">
                  Your Spinal Health Journey - Optimizing your spine and nervous system health
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {metrics.totalVisits} Visits
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Treatment Progress: Excellent</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{metrics.painReduction}%</div>
                <div className="text-green-100 text-sm">Pain Reduction</div>
                <div className="flex items-center gap-1 text-sm mt-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>Significant improvement</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card 
            className="border-green-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Treatment Progress Details",
              description: `You've completed ${metrics.totalVisits} sessions with ${metrics.treatmentProgress}% overall progress. Your spine is responding well to chiropractic care.`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600" />
                Treatment Progress
                <ArrowRight className="w-3 h-3 ml-auto text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{metrics.treatmentProgress}%</div>
              <Progress value={metrics.treatmentProgress} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card 
            className="border-green-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Pain Reduction Details",
              description: `Your pain levels have decreased by ${metrics.painReduction}% since starting treatment. This indicates excellent response to chiropractic care.`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-600" />
                Pain Reduction
                <ArrowRight className="w-3 h-3 ml-auto text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{metrics.painReduction}%</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                Major improvement
              </p>
            </CardContent>
          </Card>

          <Card 
            className="border-green-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => toast({
              title: "Mobility Improvement Details",
              description: `Your spinal mobility has improved by ${metrics.mobilityImprovement}% through targeted adjustments and exercises. Keep up the great work!`,
              duration: 8000
            })}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Zap className="w-4 h-4 text-green-600" />
                Mobility Improvement
                <ArrowRight className="w-3 h-3 ml-auto text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{metrics.mobilityImprovement}%</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3" />
                Excellent progress
              </p>
            </CardContent>
          </Card>

          <Card 
            className="border-green-200 bg-white/90 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
            onClick={handleScheduleAppointment}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-green-600" />
                Next Visit
                <ArrowRight className="w-3 h-3 ml-auto text-green-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold text-green-700">Dec 15</div>
              <p className="text-xs text-green-600">Spinal adjustment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
            <TabsTrigger value="appointments" className="text-sm">Appointments</TabsTrigger>
            <TabsTrigger value="treatments" className="text-sm">Treatments</TabsTrigger>
            <TabsTrigger value="exercises" className="text-sm">Exercises</TabsTrigger>
            <TabsTrigger value="messages" className="text-sm">Messages</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Spinal Health Progress */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-green-600" />
                    Spinal Health Progress
                  </CardTitle>
                  <CardDescription>Your journey to optimal spinal health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pain Reduction</span>
                    <span className="text-sm text-green-600">{metrics.painReduction}%</span>
                  </div>
                  <Progress value={metrics.painReduction} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Mobility</span>
                    <span className="text-sm text-green-600">{metrics.mobilityImprovement}%</span>
                  </div>
                  <Progress value={metrics.mobilityImprovement} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-blue-600">{metrics.treatmentProgress}%</span>
                  </div>
                  <Progress value={metrics.treatmentProgress} className="h-2" />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Common tasks and requests</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                    onClick={handleScheduleAppointment}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Appointment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-green-200 hover:bg-green-50"
                    onClick={handleSymptomChecker}
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Symptom Assessment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-green-200 hover:bg-green-50"
                    onClick={handleDownloadReport}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Progress Report
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-green-200 hover:bg-green-50"
                    onClick={handleMessageCareTeam}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Care Team
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

          <TabsContent value="exercises">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Prescribed Exercises</CardTitle>
                <CardDescription>Follow these exercises to support your treatment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Exercise recommendations will be available after your next appointment.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Communicate with your care team</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">No messages at this time. Click the message button to start a conversation.</p>
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