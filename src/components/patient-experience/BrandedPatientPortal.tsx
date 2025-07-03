import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Heart,
  Pill,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PatientBilling } from './PatientBilling';

interface BrandingConfig {
  practiceName: string;
  logo?: string;
  primaryColor?: string;
  secondaryColor?: string;
  tagline?: string;
  website?: string;
  phone?: string;
}

interface BrandedPatientPortalProps {
  branding?: BrandingConfig;
  tenantId?: string;
  isEmbedded?: boolean;
}

export const BrandedPatientPortal: React.FC<BrandedPatientPortalProps> = ({ 
  branding,
  tenantId,
  isEmbedded = false 
}) => {
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
    }
  ]);

  // Apply branding styles dynamically
  useEffect(() => {
    if (branding?.primaryColor && !isEmbedded) {
      document.documentElement.style.setProperty('--primary', branding.primaryColor);
    }
    if (branding?.secondaryColor && !isEmbedded) {
      document.documentElement.style.setProperty('--secondary', branding.secondaryColor);
    }
  }, [branding, isEmbedded]);

  const defaultBranding: BrandingConfig = {
    practiceName: 'Healthcare Practice',
    primaryColor: '#3B82F6',
    secondaryColor: '#06B6D4',
    tagline: 'Your Health, Our Priority'
  };

  const config = { ...defaultBranding, ...branding };

  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-01-16',
      time: '2:00 PM',
      provider: 'Dr. Sarah Johnson',
      type: 'Follow-up Visit',
      status: 'confirmed'
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

  const containerClass = isEmbedded 
    ? 'w-full h-full bg-white' 
    : `min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`;

  return (
    <div className={containerClass}>
      {/* Branded Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-10" 
           style={{ 
             backgroundColor: isEmbedded ? 'white' : undefined,
             borderColor: config.primaryColor + '20' 
           }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {config.logo && (
              <img 
                src={config.logo} 
                alt={`${config.practiceName} Logo`}
                className="h-10 w-auto"
              />
            )}
            <div>
              <h1 className="text-xl font-bold" style={{ color: config.primaryColor }}>
                {config.practiceName}
              </h1>
              {config.tagline && (
                <p className="text-sm text-gray-600">{config.tagline}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {config.phone && (
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{config.phone}</span>
              </div>
            )}
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={`${isEmbedded ? 'p-4' : isMobile ? 'p-4' : 'container mx-auto p-6'} space-y-6`}>
        {/* Welcome Message */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-gray-900">Welcome to Your Patient Portal</h2>
          <p className="text-gray-600 mt-2">Manage your health journey with {config.practiceName}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-opacity-50"
                style={{ borderColor: config.primaryColor + '30' }}>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2" style={{ color: config.primaryColor }} />
              <p className="text-sm font-medium">Book Appointment</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-opacity-50"
                style={{ borderColor: config.secondaryColor + '30' }}>
            <CardContent className="p-4 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: config.secondaryColor }} />
              <p className="text-sm font-medium">Message Provider</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-opacity-50"
                style={{ borderColor: config.primaryColor + '30' }}>
            <CardContent className="p-4 text-center">
              <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: config.primaryColor }} />
              <p className="text-sm font-medium">View Records</p>
            </CardContent>
          </Card>
          
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-opacity-50"
            style={{ borderColor: config.secondaryColor + '30' }}
            onClick={() => setActiveTab('billing')}
          >
            <CardContent className="p-4 text-center">
              <CreditCard className="w-8 h-8 mx-auto mb-2" style={{ color: config.secondaryColor }} />
              <p className="text-sm font-medium">Pay Bill</p>
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        {notifications.filter(n => !n.read).length > 0 && (
          <Alert style={{ borderColor: config.primaryColor, backgroundColor: config.primaryColor + '10' }}>
            <Bell className="h-4 w-4" style={{ color: config.primaryColor }} />
            <AlertDescription>
              You have {notifications.filter(n => !n.read).length} unread notifications
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className={`grid w-full ${isMobile ? 'grid-cols-4' : 'grid-cols-5'}`}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="health">Health</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            {!isMobile && <TabsTrigger value="records">Records</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Health Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: config.primaryColor }} />
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
                    <Activity className="w-6 h-6 mx-auto mb-1" style={{ color: config.primaryColor }} />
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="font-semibold">{healthMetrics.vitals.heartRate}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-6 h-6 mx-auto mb-1 rounded-full"
                      style={{ backgroundColor: config.secondaryColor }}
                    ></div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-semibold">{healthMetrics.vitals.temperature}</p>
                  </div>
                  <div className="text-center">
                    <div 
                      className="w-6 h-6 mx-auto mb-1 rounded-full"
                      style={{ backgroundColor: config.primaryColor }}
                    ></div>
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
                  <Calendar className="w-5 h-5" style={{ color: config.primaryColor }} />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: config.primaryColor + '20' }}
                        >
                          <User className="w-5 h-5" style={{ color: config.primaryColor }} />
                        </div>
                        <div>
                          <p className="font-medium">{appointment.provider}</p>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                          <p className="text-xs text-gray-500">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={appointment.status === 'confirmed' ? 'default' : 'secondary'}
                        style={{ 
                          backgroundColor: appointment.status === 'confirmed' ? config.primaryColor : undefined 
                        }}
                      >
                        {appointment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  style={{ borderColor: config.primaryColor, color: config.primaryColor }}
                  onClick={() => setActiveTab('appointments')}
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
                          <Calendar className="w-5 h-5" style={{ color: config.primaryColor }} />
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
                        <Button 
                          size="sm"
                          style={{ backgroundColor: config.primaryColor }}
                        >
                          Join Video Call
                        </Button>
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
                  <Heart className="w-5 h-5" style={{ color: config.primaryColor }} />
                  Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Current Medications</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Pill className="w-5 h-5" style={{ color: config.primaryColor }} />
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

          <TabsContent value="billing" className="space-y-4">
            <PatientBilling />
          </TabsContent>

          {!isMobile && (
            <TabsContent value="records" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" style={{ color: config.primaryColor }} />
                    Medical Records
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Access Your Records</h3>
                    <p className="text-gray-500 mb-4">
                      View and download your complete medical history
                    </p>
                    <Button style={{ backgroundColor: config.primaryColor }}>
                      View Medical Records
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>

      {/* Footer with Practice Info */}
      {!isEmbedded && (
        <footer className="bg-white border-t mt-8 py-6">
          <div className="container mx-auto px-6 text-center">
            <p className="text-gray-600">
              © 2024 {config.practiceName}. All rights reserved.
            </p>
            {config.website && (
              <p className="text-sm text-gray-500 mt-2">
                Visit us at <a href={config.website} className="underline">{config.website}</a>
              </p>
            )}
          </div>
        </footer>
      )}
    </div>
  );
};