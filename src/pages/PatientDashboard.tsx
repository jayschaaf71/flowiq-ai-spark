
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
import { PatientBilling } from '@/components/patient-experience/PatientBilling';
import { PatientNotificationCenter } from '@/components/notifications/PatientNotificationCenter';
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
  CreditCard
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { currentTenant, loading: tenantLoading } = useCurrentTenant();
  const [activeSection, setActiveSection] = React.useState('dashboard');

  const handleSignOut = async () => {
    await signOut();
  };

  // Show loading state while authentication or tenant data is loading
  if (authLoading || tenantLoading) {
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
                  {currentTenant?.brand_name || 'FlowIQ'} Patient Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {profile?.first_name || user?.email || 'Patient'}
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
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-2">
              Welcome to your dashboard, {profile?.first_name || 'Patient'}!
            </h2>
            <p className="text-blue-100">
              Manage your appointments, view your health records, and stay connected with your care team.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveSection('book-appointment')}
          >
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Book Appointment</h3>
              <p className="text-sm text-gray-600">Schedule your next visit</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveSection('health-records')}
          >
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Health Records</h3>
              <p className="text-sm text-gray-600">View your medical history</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveSection('health-tracker')}
          >
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Health Tracker</h3>
              <p className="text-sm text-gray-600">Monitor your wellness</p>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveSection('billing')}
          >
            <CardContent className="p-6 text-center">
              <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Pay Bills</h3>
              <p className="text-sm text-gray-600">Manage payments & billing</p>
            </CardContent>
          </Card>
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
                        <option>Regular Checkup</option>
                        <option>Follow-up Visit</option>
                        <option>Specialist Consultation</option>
                        <option>Lab Work</option>
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
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Request Appointment
                  </Button>
                </CardContent>
              </Card>
            </div>
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
            
            {/* Health Records Content */}
            <div className="space-y-6">
              {/* Recent Visit Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    Recent Visits
                  </CardTitle>
                  <CardDescription>Your visit history and medical records</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Regular Checkup</h3>
                          <p className="text-sm text-gray-600">Dr. Sarah Smith • February 28, 2024</p>
                        </div>
                        <Badge variant="outline" className="text-green-700 border-green-700">Completed</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Annual physical examination. All vital signs normal. Continue current medications.
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        View Full Record
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold">Lab Results</h3>
                          <p className="text-sm text-gray-600">Dr. Michael Chen • February 15, 2024</p>
                        </div>
                        <Badge variant="outline" className="text-blue-700 border-blue-700">Available</Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        Blood panel results available. All values within normal range.
                      </p>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-1" />
                        View Results
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medications */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Medications</CardTitle>
                  <CardDescription>Your active prescriptions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Lisinopril 10mg</p>
                        <p className="text-sm text-gray-600">Once daily • Prescribed by Dr. Smith</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Metformin 500mg</p>
                        <p className="text-sm text-gray-600">Twice daily • Prescribed by Dr. Smith</p>
                      </div>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : activeSection === 'health-tracker' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Health Tracker</h2>
              <Button 
                variant="outline" 
                onClick={() => setActiveSection('dashboard')}
              >
                ← Back to Dashboard
              </Button>
            </div>
            
            {/* Health Tracker Content */}
            <div className="space-y-6">
              {/* Vital Signs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    Vital Signs Tracker
                  </CardTitle>
                  <CardDescription>Monitor your key health metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Heart className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Blood Pressure</p>
                      <p className="text-2xl font-bold text-gray-900">120/80</p>
                      <p className="text-xs text-gray-500">Last: March 1, 2024</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Heart Rate</p>
                      <p className="text-2xl font-bold text-gray-900">72 BPM</p>
                      <p className="text-xs text-gray-500">Last: March 1, 2024</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <User className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Weight</p>
                      <p className="text-2xl font-bold text-gray-900">165 lbs</p>
                      <p className="text-xs text-gray-500">Last: February 28, 2024</p>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Log New Reading
                  </Button>
                </CardContent>
              </Card>

              {/* Health Goals */}
              <Card>
                <CardHeader>
                  <CardTitle>Health Goals</CardTitle>
                  <CardDescription>Track your wellness objectives</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="font-medium">Exercise 3x per week</p>
                        <p className="text-sm text-gray-600">This week: 2/3 completed</p>
                      </div>
                      <Badge variant="outline" className="text-green-700 border-green-700">On Track</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">Take medications daily</p>
                        <p className="text-sm text-gray-600">This week: 6/7 days</p>
                      </div>
                      <Badge variant="outline" className="text-yellow-700 border-yellow-700">Almost There</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div>
                        <p className="font-medium">Stay hydrated (8 glasses/day)</p>
                        <p className="text-sm text-gray-600">Today: 6/8 glasses</p>
                      </div>
                      <Badge variant="outline" className="text-blue-700 border-blue-700">In Progress</Badge>
                    </div>
                  </div>
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
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
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
                  <Badge className="bg-blue-600">Confirmed</Badge>
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
    </div>
  );
};

export default PatientDashboard;
