
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { usePatientPortalConfig } from '@/hooks/usePatientPortalConfig';
import { PatientBilling } from '@/components/patient-experience/PatientBilling';
import { PatientNotificationCenter } from '@/components/notifications/PatientNotificationCenter';
import { ChiropracticSymptomChecker } from '@/components/patient-experience/ChiropracticSymptomChecker';
import { CommunicationCenter } from '@/components/patient-experience/CommunicationCenter';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useCommunicationPreferences } from '@/hooks/useCommunicationPreferences';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useRealAppointments } from '@/hooks/useRealAppointments';
import { useBillingInvoices } from '@/hooks/useBillingInvoices';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { usePatientInsurance } from '@/hooks/usePatientInsurance';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Heart, 
  User, 
  Bell,
  Settings,
  LogOut,
  Phone,
  Mail,
  Loader2,
  CreditCard,
  ChevronRight,
  X,
  MapPin,
  Activity
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { currentTenant, loading: tenantLoading } = useCurrentTenant();
  const { config, isLoading: configLoading, specialty } = usePatientPortalConfig();
  const { preferences, loading: prefsLoading, saving, updatePreference } = useCommunicationPreferences();
  const [activeSection, setActiveSection] = React.useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>(null);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleUpdatePreferences = () => {
    toast({
      title: "Communication Preferences Updated",
      description: "Your notification preferences have been saved successfully.",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Change",
      description: "Password change feature will be available soon. Please contact support if you need to change your password.",
    });
  };

  const handleEnable2FA = () => {
    toast({
      title: "Two-Factor Authentication",
      description: "2FA setup will be available soon. This will add an extra layer of security to your account.",
    });
  };

  // Auto-scroll to content when section changes
  React.useEffect(() => {
    if (activeSection !== 'dashboard') {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const contentElement = document.getElementById('main-content');
        if (contentElement) {
          contentElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 100);
    }
  }, [activeSection]);

  // Show loading state while authentication or tenant data is loading
  if (authLoading || tenantLoading || configLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  // If user is not authenticated, don't render (should be handled by route protection)
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {currentTenant?.name || 'FlowIQ'} Patient Portal
                </h1>
                <p className="text-sm text-gray-600">
                  {currentTenant?.tagline || 'Your healthcare management system'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveSection('notifications')}
              >
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setActiveSection('settings')}
              >
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white" style={{
            background: `linear-gradient(135deg, ${config.customization.primaryColor}, ${config.customization.secondaryColor})`
          }}>
            <h2 className="text-2xl font-bold mb-2">
              {config.customization.welcomeMessage}, {profile?.first_name || 'Patient'}!
            </h2>
            <p className="text-blue-100">
              {config.customization.footerText}
            </p>
          </div>
        </div>

        {/* Contact Your Care Team - Moved Higher for Better Visibility */}
        <Card className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Your Care Team
            </CardTitle>
            <CardDescription>Get in touch with your healthcare providers - Available 24/7</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                className="flex items-center gap-4 p-4 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => {
                  window.location.href = 'tel:+15551234567';
                  toast({
                    title: "Calling Office",
                    description: "Connecting you to our office at (555) 123-4567",
                  });
                }}
              >
                <Phone className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Call Office</p>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>
              <div 
                className="flex items-center gap-4 p-4 bg-green-100 rounded-lg cursor-pointer hover:bg-green-200 transition-colors"
                onClick={() => setActiveSection('messaging')}
              >
                <Mail className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Secure Message</p>
                  <p className="text-sm text-gray-600">Send a message to your provider</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {config.features.map((feature) => (
            <Card 
              key={feature.id}
              className="cursor-pointer hover:shadow-md transition-shadow min-h-[140px]"
              onClick={() => setActiveSection(feature.id)}
            >
              <CardContent className="p-4 text-center h-full flex flex-col justify-between">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-10 h-10 flex items-center justify-center" style={{ color: config.customization.primaryColor }}>
                    {feature.icon === 'Calendar' && <Calendar className="w-8 h-8" />}
                    {feature.icon === 'Activity' && <Activity className="w-8 h-8" />}
                    {feature.icon === 'FileText' && <FileText className="w-8 h-8" />}
                    {feature.icon === 'Heart' && <Heart className="w-8 h-8" />}
                    {feature.icon === 'CreditCard' && <CreditCard className="w-8 h-8" />}
                    {feature.icon === 'Moon' && <Clock className="w-8 h-8" />}
                    {feature.icon === 'Shield' && <User className="w-8 h-8" />}
                    {feature.icon === 'Camera' && <FileText className="w-8 h-8" />}
                    {feature.icon === 'Package' && <CreditCard className="w-8 h-8" />}
                    {feature.icon === 'Gift' && <Heart className="w-8 h-8" />}
                    {feature.icon === 'MessageSquare' && <Mail className="w-8 h-8" />}
                    {feature.icon === 'TestTube' && <FileText className="w-8 h-8" />}
                    {feature.icon === 'Crown' && <User className="w-8 h-8" />}
                    {feature.icon === 'TrendingUp' && <Heart className="w-8 h-8" />}
                    {feature.icon === 'Pill' && <CreditCard className="w-8 h-8" />}
                    {feature.icon === 'BookOpen' && <FileText className="w-8 h-8" />}
                    {feature.icon === 'Activity' && <Heart className="w-8 h-8" />}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">{feature.name}</h3>
                    <p className="text-xs text-gray-600 leading-tight">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Conditional Content Based on Active Section */}
        <div id="main-content">
        {activeSection === 'billing' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Billing & Payments</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <PatientBilling />
          </div>
        ) : activeSection === 'symptom-checker' ? (
          <div>
            <ChiropracticSymptomChecker 
              onComplete={(data) => {
                console.log('Symptom assessment completed:', data);
                setActiveSection('dashboard');
              }}
              onBack={() => setActiveSection('dashboard')}
            />
          </div>
        ) : activeSection === 'notifications' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <PatientNotificationCenter />
          </div>
        ) : activeSection === 'health-records' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Health Records</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Treatment History</h3>
                <p className="text-gray-600 mb-4">Your complete chiropractic treatment records and progress notes.</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>View Records</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Treatment History & Records
                      </DialogTitle>
                      <DialogDescription>
                        Your complete medical history and treatment records
                      </DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="visits" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="visits">Recent Visits</TabsTrigger>
                        <TabsTrigger value="treatments">Treatments</TabsTrigger>
                        <TabsTrigger value="progress">Progress Notes</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="visits" className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Follow-up Consultation</h4>
                            <Badge variant="outline">February 28, 2024</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="font-medium text-gray-700">Provider:</p>
                              <p className="text-gray-600">Dr. Sarah Smith</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Duration:</p>
                              <p className="text-gray-600">45 minutes</p>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">Visit Summary:</p>
                            <p className="text-gray-600">Patient showed significant improvement in lower back pain. Recommended continued physical therapy and follow-up in 4 weeks.</p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Initial Assessment</h4>
                            <Badge variant="outline">January 15, 2024</Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <p className="font-medium text-gray-700">Provider:</p>
                              <p className="text-gray-600">Dr. Sarah Smith</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Duration:</p>
                              <p className="text-gray-600">60 minutes</p>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">Visit Summary:</p>
                            <p className="text-gray-600">Comprehensive spinal assessment. Diagnosed with lumbar strain. Started treatment plan including spinal adjustments and exercise therapy.</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="treatments" className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Spinal Adjustment - Lumbar</h4>
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <p className="font-medium text-gray-700">Date:</p>
                              <p className="text-gray-600">February 28, 2024</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Technique:</p>
                              <p className="text-gray-600">Diversified</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Region:</p>
                              <p className="text-gray-600">L3-L5</p>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">Outcome:</p>
                            <p className="text-gray-600">Improved range of motion, reduced pain level from 7/10 to 4/10</p>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Therapeutic Exercise</h4>
                            <Badge className="bg-green-100 text-green-800">Completed</Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <p className="font-medium text-gray-700">Date:</p>
                              <p className="text-gray-600">February 21, 2024</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Type:</p>
                              <p className="text-gray-600">Core Strengthening</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Duration:</p>
                              <p className="text-gray-600">30 minutes</p>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">Progress:</p>
                            <p className="text-gray-600">Patient completed all exercises with proper form. Increased resistance by 20%</p>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="progress" className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Progress Assessment</h4>
                            <Badge variant="outline">February 28, 2024</Badge>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">Pain Level:</p>
                              <p className="text-gray-600">Decreased from 7/10 to 4/10 over 6 weeks</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Mobility:</p>
                              <p className="text-gray-600">Range of motion improved by 40% in lumbar flexion</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Functional Status:</p>
                              <p className="text-gray-600">Able to return to normal daily activities without restrictions</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Next Steps:</p>
                              <p className="text-gray-600">Continue home exercises, follow-up in 4 weeks, consider discharge if continued improvement</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Initial Assessment Notes</h4>
                            <Badge variant="outline">January 15, 2024</Badge>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">Chief Complaint:</p>
                              <p className="text-gray-600">Lower back pain for 3 weeks following lifting injury</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Physical Findings:</p>
                              <p className="text-gray-600">Muscle spasm in lumbar paraspinals, reduced flexion ROM</p>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">Treatment Plan:</p>
                              <p className="text-gray-600">3x/week spinal adjustments, therapeutic exercises, patient education</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="documents" className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">X-Ray Results - Lumbar Spine</h4>
                            <Badge variant="outline">January 20, 2024</Badge>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">Report Summary:</p>
                            <p className="text-gray-600 mb-3">Normal vertebral alignment. No acute fractures or dislocations. Mild disc space narrowing at L4-L5.</p>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Download Report
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Treatment Plan Document</h4>
                            <Badge variant="outline">January 15, 2024</Badge>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">Plan Overview:</p>
                            <p className="text-gray-600 mb-3">Comprehensive 8-week treatment protocol for lumbar strain recovery.</p>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Download Plan
                            </Button>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold">Exercise Instructions</h4>
                            <Badge variant="outline">January 22, 2024</Badge>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium text-gray-700">Home Exercise Program:</p>
                            <p className="text-gray-600 mb-3">Detailed instructions for core strengthening and flexibility exercises.</p>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              Download Instructions
                            </Button>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </div>
        ) : activeSection === 'health-tracker' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Pain Tracker</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Heart className="w-16 h-16 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-semibold mb-2">Track Your Progress</h3>
                <p className="text-gray-600 mb-4">Monitor your pain levels, mobility, and treatment progress over time.</p>
                <Button>Start Tracking</Button>
              </CardContent>
            </Card>
          </div>
        ) : activeSection === 'exercise-plan' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Exercise Plans</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h3 className="text-lg font-semibold mb-2">Prescribed Exercises</h3>
                <p className="text-gray-600 mb-4">View and follow your personalized exercise routines and rehabilitation plans.</p>
                <Button>View Exercises</Button>
              </CardContent>
            </Card>
          </div>
        ) : activeSection === 'education' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Spinal Health Education</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-semibold mb-2">Educational Resources</h3>
                <p className="text-gray-600 mb-4">Learn about spinal health, posture, ergonomics, and prevention techniques.</p>
                <Button>Explore Resources</Button>
              </CardContent>
            </Card>
          </div>
        ) : activeSection === 'appointments' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-blue-400" />
                <h3 className="text-lg font-semibold mb-2">Manage Your Appointments</h3>
                <p className="text-gray-600 mb-4">View upcoming appointments, reschedule, or book new visits.</p>
                <Button onClick={() => setActiveSection('book-appointment')}>Schedule Appointment</Button>
              </CardContent>
            </Card>
          </div>
        ) : activeSection === 'messaging' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Secure Messaging</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            <CommunicationCenter />
          </div>
        ) : activeSection === 'settings' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            
            {/* Settings Content */}
            <div className="space-y-6">
              {/* Profile Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">First Name</label>
                      <p className="mt-1 text-gray-900">{profile?.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Last Name</label>
                      <p className="mt-1 text-gray-900">{profile?.last_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="mt-1 text-gray-900">Not provided</p>
                    </div>
                  </div>
                  <Button variant="outline">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Communication Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-green-600" />
                    Communication Preferences
                  </CardTitle>
                  <CardDescription>Choose how you'd like to receive updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {preferences && !prefsLoading ? (
                    <div className="space-y-4">
                      {/* Appointment Reminders */}
                      <div className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Appointment Reminders</p>
                            <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                          </div>
                          <Switch
                            checked={preferences.appointment_reminders_enabled}
                            onCheckedChange={(checked) => updatePreference('appointment_reminders_enabled', checked)}
                            disabled={saving}
                          />
                        </div>
                        {preferences.appointment_reminders_enabled && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor="appointment-method" className="text-sm">Method:</Label>
                            <Select
                              value={preferences.appointment_reminders_method}
                              onValueChange={(value) => updatePreference('appointment_reminders_method', value)}
                              disabled={saving}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Test Results */}
                      <div className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Test Results</p>
                            <p className="text-sm text-gray-600">Receive lab results and test outcomes</p>
                          </div>
                          <Switch
                            checked={preferences.test_results_enabled}
                            onCheckedChange={(checked) => updatePreference('test_results_enabled', checked)}
                            disabled={saving}
                          />
                        </div>
                        {preferences.test_results_enabled && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor="test-method" className="text-sm">Method:</Label>
                            <Select
                              value={preferences.test_results_method}
                              onValueChange={(value) => updatePreference('test_results_method', value)}
                              disabled={saving}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Billing Notifications */}
                      <div className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Billing Notifications</p>
                            <p className="text-sm text-gray-600">Receive bill and payment confirmations</p>
                          </div>
                          <Switch
                            checked={preferences.billing_notifications_enabled}
                            onCheckedChange={(checked) => updatePreference('billing_notifications_enabled', checked)}
                            disabled={saving}
                          />
                        </div>
                        {preferences.billing_notifications_enabled && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor="billing-method" className="text-sm">Method:</Label>
                            <Select
                              value={preferences.billing_notifications_method}
                              onValueChange={(value) => updatePreference('billing_notifications_method', value)}
                              disabled={saving}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Educational Content */}
                      <div className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Educational Content</p>
                            <p className="text-sm text-gray-600">Health tips and educational materials</p>
                          </div>
                          <Switch
                            checked={preferences.educational_content_enabled}
                            onCheckedChange={(checked) => updatePreference('educational_content_enabled', checked)}
                            disabled={saving}
                          />
                        </div>
                        {preferences.educational_content_enabled && (
                          <div className="flex items-center gap-2">
                            <Label htmlFor="educational-method" className="text-sm">Method:</Label>
                            <Select
                              value={preferences.educational_content_method}
                              onValueChange={(value) => updatePreference('educational_content_method', value)}
                              disabled={saving}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="sms">SMS</SelectItem>
                                <SelectItem value="both">Both</SelectItem>
                                <SelectItem value="none">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* General Notifications */}
                      <div className="space-y-3 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">General Notifications</p>
                            <p className="text-sm text-gray-600">System updates and announcements</p>
                          </div>
                          <Switch
                            checked={preferences.general_notifications_enabled}
                            onCheckedChange={(checked) => updatePreference('general_notifications_enabled', checked)}
                            disabled={saving}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <p className="text-gray-500">Loading preferences...</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Security */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-red-600" />
                    Security
                  </CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-sm text-gray-600">Last updated 30 days ago</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleChangePassword}>
                        Change Password
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add extra security to your account</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleEnable2FA}>
                        Enable 2FA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : activeSection === 'book-appointment' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book Appointment</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            
            {/* Book Appointment Content */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    Schedule New Appointment
                  </CardTitle>
                  <CardDescription>Choose your preferred date, time, and provider</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Appointment Type</label>
                      <select className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                        {config.appointmentTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name} ({type.duration} min)
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Preferred Provider</label>
                      <select className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                        <option>Dr. Sarah Smith</option>
                        <option>Dr. Michael Chen</option>
                        <option>Dr. Emily Williams</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Preferred Date</label>
                      <input type="date" className="mt-1 w-full p-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Preferred Time</label>
                      <select className="mt-1 w-full p-2 border border-gray-300 rounded-md">
                        <option>Morning (8AM - 12PM)</option>
                        <option>Afternoon (12PM - 5PM)</option>
                        <option>Evening (5PM - 8PM)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Reason for Visit</label>
                    <textarea 
                      className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      placeholder="Please describe the reason for your visit..."
                    ></textarea>
                  </div>
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      // For now, show a success message
                      alert('Appointment request submitted! We will contact you within 24 hours to confirm your appointment.');
                      setActiveSection('dashboard');
                    }}
                  >
                    Request Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <>
            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Your scheduled visits and checkups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                  onClick={() => setSelectedAppointment({
                    id: '1',
                    type: 'Regular Checkup',
                    provider: 'Dr. Smith',
                    specialty: 'General Medicine',
                    date: 'March 15, 2024',
                    time: '2:00 PM',
                    status: 'Confirmed',
                    location: 'Main Office - Room 205',
                    notes: 'Annual physical examination'
                  })}
                >
                  <div>
                    <p className="font-medium text-gray-900">Regular Checkup</p>
                    <p className="text-sm text-gray-600">Dr. Smith • General Medicine</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        March 15, 2024
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        2:00 PM
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600">Confirmed</Badge>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No other appointments scheduled</p>
                  <Button className="mt-3" size="sm" onClick={() => setActiveSection('book-appointment')}>Schedule Appointment</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Health Summary
              </CardTitle>
              <CardDescription>Overview of your recent health metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Last Visit</p>
                    <p className="text-sm text-gray-600">February 28, 2024</p>
                  </div>
                  <Badge variant="outline" className="text-green-700 border-green-700">
                    Excellent
                  </Badge>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">Active Medications</p>
                        <p className="text-sm text-gray-600">2 prescriptions</p>
                      </div>
                      <Badge variant="outline" className="cursor-pointer">
                        View Details
                      </Badge>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-600" />
                        Active Medications
                      </DialogTitle>
                      <DialogDescription>
                        Your current prescriptions and medication history
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">Lisinopril 10mg</h4>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Prescribed by:</p>
                            <p className="text-gray-600">Dr. Sarah Smith</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Date prescribed:</p>
                            <p className="text-gray-600">February 15, 2024</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Dosage:</p>
                            <p className="text-gray-600">Once daily</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Refills remaining:</p>
                            <p className="text-gray-600">3 refills</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="font-medium text-gray-700">Instructions:</p>
                          <p className="text-gray-600">Take with food in the morning. Monitor blood pressure weekly.</p>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-lg">Metformin 500mg</h4>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium text-gray-700">Prescribed by:</p>
                            <p className="text-gray-600">Dr. Michael Chen</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Date prescribed:</p>
                            <p className="text-gray-600">January 20, 2024</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Dosage:</p>
                            <p className="text-gray-600">Twice daily with meals</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Refills remaining:</p>
                            <p className="text-gray-600">2 refills</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="font-medium text-gray-700">Instructions:</p>
                          <p className="text-gray-600">Take with breakfast and dinner. Monitor blood sugar levels.</p>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Important Reminders</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                          <li>• Always take medications as prescribed</li>
                          <li>• Contact your provider before stopping any medication</li>
                          <li>• Report any side effects immediately</li>
                          <li>• Keep track of refill dates to avoid running out</li>
                        </ul>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Preventive Care</p>
                    <p className="text-sm text-gray-600">Chiropractic check-up due</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-700">
                    Due Soon
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
          </>
        )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Appointment Details
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAppointment(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedAppointment.type}</h3>
                <p className="text-gray-600">{selectedAppointment.provider} • {selectedAppointment.specialty}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{selectedAppointment.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{selectedAppointment.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{selectedAppointment.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex items-center justify-center">
                    <div className={`w-2 h-2 rounded-full ${
                      selectedAppointment.status === 'Confirmed' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                  </div>
                  <span>Status: {selectedAppointment.status}</span>
                </div>
              </div>
              
              {selectedAppointment.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Notes:</p>
                  <p className="text-sm text-gray-600">{selectedAppointment.notes}</p>
                </div>
              )}
              
              <div className="space-y-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedAppointment(null);
                    setActiveSection('book-appointment');
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Reschedule
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => {
                    // Add cancel logic here
                    setSelectedAppointment(null);
                  }}
                >
                  Cancel Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
