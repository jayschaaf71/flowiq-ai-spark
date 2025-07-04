
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
  const [activeSection, setActiveSection] = React.useState('dashboard');
  const [selectedAppointment, setSelectedAppointment] = React.useState<any>(null);

  const handleSignOut = async () => {
    await signOut();
  };

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
                  Welcome to {currentTenant?.name || 'FlowIQ'} Patient Portal{profile?.first_name ? `, ${profile.first_name}` : ''}!
                </h1>
                <p className="text-sm text-gray-600">
                  {currentTenant?.tagline || 'Your healthcare journey continues'}
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
                <Button>View Records</Button>
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Appointment Reminders</p>
                        <p className="text-sm text-gray-600">Get notified about upcoming appointments</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Email & SMS</span>
                        <Badge variant="outline" className="text-green-700 border-green-700">Enabled</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Billing Notifications</p>
                        <p className="text-sm text-gray-600">Receive bill and payment confirmations</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Email</span>
                        <Badge variant="outline" className="text-green-700 border-green-700">Enabled</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Health Updates</p>
                        <p className="text-sm text-gray-600">Educational content and health tips</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Email</span>
                        <Badge variant="outline">Disabled</Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">
                    Update Preferences
                  </Button>
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
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add extra security to your account</p>
                      </div>
                      <Button variant="outline" size="sm">
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

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Active Medications</p>
                    <p className="text-sm text-gray-600">2 prescriptions</p>
                  </div>
                  <Badge variant="outline">
                    View Details
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Preventive Care</p>
                    <p className="text-sm text-gray-600">Annual physical due</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-700 border-yellow-700">
                    Due Soon
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Your Care Team
            </CardTitle>
            <CardDescription>Get in touch with your healthcare providers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <Phone className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Call Office</p>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <Mail className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-gray-900">Secure Message</p>
                  <p className="text-sm text-gray-600">Send a message to your provider</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </>
        )}
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
