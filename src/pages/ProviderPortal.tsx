
import React from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useMobileCapabilities } from '@/hooks/useMobileCapabilities';
import { MobileProviderDashboard } from '@/components/mobile/MobileProviderDashboard';
import { MobileDocumentCapture } from '@/components/mobile/MobileDocumentCapture';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  FileText, 
  Camera,
  BarChart3,
  Settings,
  Bell
} from 'lucide-react';

export const ProviderPortal: React.FC = () => {
  const { profile } = useAuth();
  const { isNative, platform } = useMobileCapabilities();

  if (!profile || profile.role === 'patient') {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This portal is only accessible to healthcare providers.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Provider Portal
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {profile.first_name || 'Provider'}
              {isNative && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Mobile App ({platform})
                </span>
              )}
            </p>
          </div>
        </div>

        {isNative ? (
          // Mobile-optimized interface
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-4">
              <MobileProviderDashboard />
            </TabsContent>
            
            <TabsContent value="schedule" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Today's Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Schedule view will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <MobileDocumentCapture />
            </TabsContent>
            
            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Patient Messages
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Secure messaging interface will be implemented here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          // Desktop interface
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  Schedule Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  View and manage your appointments, patient schedules, and availability.
                </p>
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-gray-500">appointments today</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  Patient Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Access patient records, medical history, and treatment plans.
                </p>
                <div className="text-2xl font-bold text-green-600">247</div>
                <div className="text-sm text-gray-500">active patients</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5 text-purple-600" />
                  Secure Messaging
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Communicate securely with patients and healthcare team members.
                </p>
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-sm text-gray-500">unread messages</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Documentation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  AI-powered documentation, notes, and clinical decision support.
                </p>
                <div className="text-2xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-gray-500">documentation complete</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  Analytics & Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Practice analytics, performance metrics, and business insights.
                </p>
                <div className="text-2xl font-bold text-red-600">↑15%</div>
                <div className="text-sm text-gray-500">efficiency this month</div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Settings className="w-5 h-5 text-gray-600" />
                  Settings & Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Configure your practice settings, integrations, and preferences.
                </p>
                <div className="text-sm text-green-600 font-medium">All systems operational</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};
