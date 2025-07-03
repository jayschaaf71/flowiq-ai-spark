
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  CreditCard, 
  Bell,
  Phone,
  MessageSquare,
  Download,
  CheckCircle,
  AlertCircle,
  Heart,
  Pill,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PatientPortal: React.FC = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'appointment',
      title: 'Upcoming Appointment',
      message: 'You have an appointment tomorrow at 2:00 PM',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      type: 'results',
      title: 'Lab Results Available',
      message: 'Your recent lab results are ready for review',
      time: '1 day ago',
      read: false
    }
  ]);

  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-01-16',
      time: '2:00 PM',
      provider: 'Dr. Sarah Johnson',
      type: 'Follow-up Visit',
      status: 'confirmed'
    },
    {
      id: '2',
      date: '2024-01-23',
      time: '10:30 AM',
      provider: 'Dr. Mike Chen',
      type: 'Annual Physical',
      status: 'pending'
    }
  ];

  const healthMetrics = {
    vitals: {
      bloodPressure: '120/80',
      heartRate: '72 bpm',
      temperature: '98.6°F',
      weight: '165 lbs'
    },
    lastUpdated: '2024-01-15'
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white border-b px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">My Health</h1>
              <p className="text-sm text-gray-600">Welcome back, John</p>
            </div>
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`${isMobile ? 'p-4' : 'container mx-auto p-6'} space-y-6`}>
        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">Book Appointment</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">Message Provider</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">View Records</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">Pay Bill</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.filter(n => !n.read).length > 0 && (
          <Alert>
            <Bell className="h-4 w-4" />
            <AlertDescription>
              You have {notifications.filter(n => !n.read).length} unread notifications
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-3' : 'grid-cols-5'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            {!isMobile && <TabsTrigger value="records">Records</TabsTrigger>}
            {!isMobile && <TabsTrigger value="billing">Billing</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Health Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Health Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Heart className="w-6 h-6 mx-auto mb-1 text-red-500" />
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="font-semibold">{healthMetrics.vitals.bloodPressure}</p>
                  </div>
                  <div className="text-center">
                    <Activity className="w-6 h-6 mx-auto mb-1 text-blue-500" />
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="font-semibold">{healthMetrics.vitals.heartRate}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 mx-auto mb-1 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-semibold">{healthMetrics.vitals.temperature}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-6 h-6 mx-auto mb-1 bg-purple-500 rounded-full"></div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-semibold">{healthMetrics.vitals.weight}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Last updated: {healthMetrics.lastUpdated}
                </p>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 2).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.provider}</p>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-xs text-gray-500">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <Badge variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={() => {
                    setActiveTab('appointments');
                    toast({
                      title: "Appointments",
                      description: "Switching to appointments view"
                    });
                  }}
                >
                  View All Appointments
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Appointments</CardTitle>
                <CardDescription>Manage your upcoming and past appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium">{appointment.date}</p>
                            <p className="text-sm text-gray-600">{appointment.time}</p>
                          </div>
                        </div>
                        <Badge>{appointment.status}</Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">{appointment.provider}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">Reschedule</Button>
                        <Button size="sm" variant="outline">Cancel</Button>
                        <Button size="sm">Join Video Call</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Current Medications</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Pill className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-medium">Lisinopril 10mg</p>
                          <p className="text-sm text-gray-600">Once daily</p>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recent Lab Results</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Complete Blood Count</p>
                          <p className="text-sm text-gray-600">January 10, 2024</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-2">
          <div className="flex justify-around">
            <button className="flex flex-col items-center py-2 text-blue-600">
              <User className="w-5 h-5" />
              <span className="text-xs mt-1">Overview</span>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-600">
              <Calendar className="w-5 h-5" />
              <span className="text-xs mt-1">Appointments</span>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-600">
              <FileText className="w-5 h-5" />
              <span className="text-xs mt-1">Records</span>
            </button>
            <button className="flex flex-col items-center py-2 text-gray-600">
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs mt-1">Messages</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
