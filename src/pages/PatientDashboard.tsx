
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCurrentTenant } from '@/utils/enhancedTenantConfig';
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
  Loader2
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const { currentTenant, loading: tenantLoading } = useCurrentTenant();

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
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
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
              Welcome to your health dashboard, {profile?.first_name || 'Patient'}!
            </h2>
            <p className="text-blue-100">
              Manage your appointments, view your health records, and stay connected with your care team.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Book Appointment</h3>
              <p className="text-sm text-gray-600">Schedule your next visit</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Health Records</h3>
              <p className="text-sm text-gray-600">View your medical history</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Health Tracker</h3>
              <p className="text-sm text-gray-600">Monitor your wellness</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-1">Messages</h3>
              <p className="text-sm text-gray-600">Communicate with providers</p>
            </CardContent>
          </Card>
        </div>

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
                  <Button className="mt-3" size="sm">Schedule Appointment</Button>
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
      </div>
    </div>
  );
};

export default PatientDashboard;
