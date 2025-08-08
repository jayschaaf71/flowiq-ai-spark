import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerDatabase } from '@/components/customers/CustomerDatabase';
import { ServiceHistory } from '@/components/customers/ServiceHistory';
import { CommunicationManager } from '@/components/communications/CommunicationManager';
import { VoiceCallManager } from '@/components/communications/VoiceCallManager';
import { InvoiceManager } from '@/components/billing/InvoiceManager';
import { PaymentProcessor } from '@/components/billing/PaymentProcessor';
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard';
import { BusinessConfiguration } from '@/components/settings/BusinessConfiguration';
import { ServiceTypeConfig } from '@/components/settings/ServiceTypeConfig';
import { PhoneNumberSetup } from '@/components/settings/PhoneNumberSetup';
import { AIIntegrationsHub } from '@/components/ai/AIIntegrationsHub';
import { CalendarView } from '@/components/schedule/CalendarView';
import { AvailableSlots } from '@/components/schedule/AvailableSlots';
import { getThemeColorClasses } from '@/utils/themeUtils';
import {
  Calendar,
  Users,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  Clock,
  UserCheck,
  Bell,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
// import { useConnectSageAI } from '@/hooks/useConnectSageAI';

export const CommunicationIQ = () => {
  const [selectedTab, setSelectedTab] = useState('schedule');
  // const connectSage = useConnectSageAI();
  const themeColors = getThemeColorClasses();
  const { toast } = useToast();

  // Mock data for upcoming services
  const upcomingServices = [
    {
      id: 1,
      time: '9:00 AM',
      type: 'HVAC',
      customer: 'Sarah Johnson',
      service: 'Maintenance',
      technician: 'Dr. Smith',
      estimatedDuration: '1 hour',
      status: 'confirmed',
      customerOnboarded: true
    },
    {
      id: 2,
      time: '2:30 PM',
      type: 'Plumbing',
      customer: 'Mike Wilson',
      service: 'Repair',
      technician: 'Dr. Jones',
      estimatedDuration: '2 hours',
      status: 'pending',
      customerOnboarded: false
    },
    {
      id: 3,
      time: '4:00 PM',
      type: 'Electrical',
      customer: 'Emma Davis',
      service: 'Installation',
      technician: 'Dr. Wilson',
      estimatedDuration: '3 hours',
      status: 'confirmed',
      customerOnboarded: true
    }
  ];

  // Mock stats
  const stats = {
    todayServices: 24,
    availableSlots: 12,
    voiceCalls: 15,
    satisfactionRate: 94
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return `bg-green-100 text-green-700`;
      case 'pending': return `bg-yellow-100 text-yellow-700`;
      case 'completed': return `${themeColors.lightBg} ${themeColors.primary}`;
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">

      {/* Enhanced Key Metrics - Scheduling Focus */}
      <div className="w-full px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className={`${themeColors.lightBg} ${themeColors.lightBorder} shadow-lg hover:shadow-xl transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeColors.primary}`}>Today's Services</p>
                  <p className={`text-3xl font-bold ${themeColors.primary}`}>{stats.todayServices}</p>
                  <p className={`text-xs ${themeColors.primary} mt-1`}>Scheduled appointments</p>
                </div>
                <Calendar className={`h-8 w-8 ${themeColors.primary}`} />
              </div>
            </CardContent>
          </Card>

          <Card className={`${themeColors.lightBg} ${themeColors.lightBorder} shadow-lg hover:shadow-xl transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${themeColors.secondary}`}>Available Slots</p>
                  <p className={`text-3xl font-bold ${themeColors.secondary}`}>{stats.availableSlots}</p>
                  <p className={`text-xs ${themeColors.secondary} mt-1`}>Open for booking</p>
                </div>
                <Clock className={`h-8 w-8 ${themeColors.secondary}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Voice Calls</p>
                  <p className="text-3xl font-bold text-purple-700">{stats.voiceCalls}</p>
                  <p className="text-xs text-purple-600 mt-1">Handled today</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Satisfaction</p>
                  <p className="text-3xl font-bold text-orange-700">{stats.satisfactionRate}%</p>
                  <p className="text-xs text-orange-600 mt-1">Customer rating</p>
                </div>
                <UserCheck className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs - Reorganized */}
        <div className="mt-8">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white shadow-lg border border-slate-200 rounded-xl p-1">
              <TabsTrigger value="schedule" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${themeColors.primaryGradient} data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200`}>
                📅 Schedule
              </TabsTrigger>
              <TabsTrigger value="customers" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${themeColors.primaryGradient} data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200`}>
                👥 Customers
              </TabsTrigger>
              <TabsTrigger value="communications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200">
                💬 Communications
              </TabsTrigger>
              <TabsTrigger value="billing" className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${themeColors.primaryGradient} data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200`}>
                💳 Billing
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200">
                📊 Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-gray-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg transition-all duration-200">
                ⚙️ Settings
              </TabsTrigger>
            </TabsList>

            {/* SCHEDULE TAB - Primary Focus */}
            <TabsContent value="schedule" className="space-y-6">
              {/* Main Calendar Section - Prominent and Central */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Large Calendar View - Primary Focus */}
                <div className="xl:col-span-2">
                  <Card className="shadow-lg border-0">
                    <CardHeader className={`${themeColors.lightBg} ${themeColors.lightBorder} border-b`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className={`text-2xl font-bold ${themeColors.primary}`}>📅 Calendar View</CardTitle>
                          <CardDescription className={`${themeColors.primary}`}>Manage appointments and availability</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${themeColors.lightBorder} ${themeColors.primary} ${themeColors.hoverBg}`}
                            onClick={() => {
                              toast({
                                title: "Today's View",
                                description: "Switching to today's calendar view",
                              });
                            }}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Today
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${themeColors.lightBorder} ${themeColors.primary} ${themeColors.hoverBg}`}
                            onClick={() => {
                              toast({
                                title: "Calendar Settings",
                                description: "Opening calendar configuration settings",
                              });
                              setSelectedTab('settings');
                            }}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <CalendarView />
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions Sidebar */}
                <div className="space-y-6">
                  {/* Today's Schedule - Compact */}
                  <Card className="shadow-md border-0">
                    <CardHeader className={`${themeColors.lightBg} ${themeColors.lightBorder} border-b`}>
                      <CardTitle className={`text-lg font-semibold ${themeColors.secondary}`}>📋 Today's Schedule</CardTitle>
                      <CardDescription className={`${themeColors.secondary}`}>Upcoming appointments</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {upcomingServices.slice(0, 3).map((service) => (
                          <div key={service.id} className={`flex items-center gap-3 p-3 ${themeColors.lightBg} rounded-lg ${themeColors.lightBorder}`}>
                            <div className="text-center min-w-[60px]">
                              <div className={`font-bold ${themeColors.secondary}`}>{service.time}</div>
                              <div className={`text-xs ${themeColors.secondary}`}>{service.type}</div>
                            </div>
                            <div className="flex-1">
                              <div className={`font-medium ${themeColors.secondary}`}>{service.customer}</div>
                              <div className={`text-sm ${themeColors.secondary}`}>{service.service}</div>
                              <div className={`text-xs ${themeColors.secondary}`}>Tech: {service.technician}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <Badge className={`${getStatusColor(service.status)} text-xs`}>
                                {service.status}
                              </Badge>
                              {service.customerOnboarded && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Ready
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full ${themeColors.lightBorder} ${themeColors.secondary} ${themeColors.hoverBg}`}
                          onClick={() => {
                            toast({
                              title: "View All Appointments",
                              description: "Opening full schedule view",
                            });
                            // Could navigate to a detailed schedule view
                          }}
                        >
                          View All ({upcomingServices.length})
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="shadow-md border-0">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                      <CardTitle className="text-lg font-semibold text-purple-800">⚡ Quick Actions</CardTitle>
                      <CardDescription className="text-purple-600">Common scheduling tasks</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="h-16 flex-col hover:bg-green-50 hover:border-green-200 transition-colors border-purple-200"
                          onClick={() => {
                            toast({
                              title: "Book Service",
                              description: "Opening service booking interface...",
                            });
                            // Could open a booking modal or navigate to booking page
                          }}
                        >
                          <Calendar className="h-5 w-5 mb-1 text-green-600" />
                          <span className="text-xs font-medium">Book Service</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-16 flex-col hover:bg-blue-50 hover:border-blue-200 transition-colors border-purple-200"
                          onClick={() => {
                            toast({
                              title: "View Calendar",
                              description: "Opening calendar interface...",
                            });
                            // Could open a full-screen calendar view
                          }}
                        >
                          <Clock className="h-5 w-5 mb-1 text-blue-600" />
                          <span className="text-xs font-medium">View Calendar</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-16 flex-col hover:bg-purple-50 hover:border-purple-200 transition-colors border-purple-200"
                          onClick={() => {
                            toast({
                              title: "Manage Slots",
                              description: "Opening slot management interface...",
                            });
                            // Could open slot management modal
                          }}
                        >
                          <Settings className="h-5 w-5 mb-1 text-purple-600" />
                          <span className="text-xs font-medium">Manage Slots</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-16 flex-col hover:bg-orange-50 hover:border-orange-200 transition-colors border-purple-200"
                          onClick={() => {
                            toast({
                              title: "Send Reminders",
                              description: "Opening reminder management...",
                            });
                            setSelectedTab('communications');
                          }}
                        >
                          <Bell className="h-5 w-5 mb-1 text-orange-600" />
                          <span className="text-xs font-medium">Send Reminders</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Available Slots Summary */}
                  <Card className="shadow-md border-0">
                    <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                      <CardTitle className="text-lg font-semibold text-orange-800">📊 Availability</CardTitle>
                      <CardDescription className="text-orange-600">Quick availability overview</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                          <div>
                            <div className="font-medium text-orange-800">Available Slots</div>
                            <div className="text-sm text-orange-600">Next 7 days</div>
                          </div>
                          <div className="text-2xl font-bold text-orange-700">{stats.availableSlots}</div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                          <div>
                            <div className="font-medium text-green-800">Today's Services</div>
                            <div className="text-sm text-green-600">Scheduled</div>
                          </div>
                          <div className="text-2xl font-bold text-green-700">{stats.todayServices}</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                          onClick={() => {
                            toast({
                              title: "Detailed Availability",
                              description: "Opening detailed availability view",
                            });
                            // Could expand the available slots section or open a modal
                          }}
                        >
                          View Detailed Availability
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Secondary Tools - Below Calendar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Available Slots Management */}
                <Card className="shadow-md border-0">
                  <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 border-b">
                    <CardTitle className="text-lg font-semibold text-sky-800">🕒 Available Slots</CardTitle>
                    <CardDescription className="text-sky-600">Manage appointment availability</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <AvailableSlots />
                  </CardContent>
                </Card>

                {/* Automated Reminders */}
                <Card className="shadow-md border-0">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                    <CardTitle className="text-lg font-semibold text-emerald-800">🔔 Automated Reminders</CardTitle>
                    <CardDescription className="text-emerald-600">Configure appointment reminders</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <div>
                          <div className="font-medium text-emerald-800">24 Hour Reminder</div>
                          <div className="text-sm text-emerald-600">SMS & Email</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <div>
                          <div className="font-medium text-emerald-800">2 Hour Reminder</div>
                          <div className="text-sm text-emerald-600">SMS only</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                        <div>
                          <div className="font-medium text-emerald-800">1 Week Reminder</div>
                          <div className="text-sm text-emerald-600">Email only</div>
                        </div>
                        <Badge className="bg-gray-100 text-gray-700">Disabled</Badge>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        onClick={() => {
                          toast({
                            title: "Reminder Settings",
                            description: "Opening reminder configuration",
                          });
                          setSelectedTab('settings');
                        }}
                      >
                        Configure Reminders
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Calendar Settings */}
                <Card className="shadow-md border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                    <CardTitle className="text-lg font-semibold text-purple-800">⚙️ Calendar Settings</CardTitle>
                    <CardDescription className="text-purple-600">Configure calendar preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium text-purple-800">Business Hours</div>
                          <div className="text-sm text-purple-600">8:00 AM - 6:00 PM</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-200 text-purple-700"
                          onClick={() => {
                            toast({
                              title: "Edit Business Hours",
                              description: "Opening business hours configuration",
                            });
                            setSelectedTab('settings');
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium text-purple-800">Appointment Duration</div>
                          <div className="text-sm text-purple-600">30 minutes default</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-200 text-purple-700"
                          onClick={() => {
                            toast({
                              title: "Edit Appointment Duration",
                              description: "Opening duration configuration",
                            });
                            setSelectedTab('settings');
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium text-purple-800">Buffer Time</div>
                          <div className="text-sm text-purple-600">15 minutes between</div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-purple-200 text-purple-700"
                          onClick={() => {
                            toast({
                              title: "Edit Buffer Time",
                              description: "Opening buffer time configuration",
                            });
                            setSelectedTab('settings');
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CUSTOMERS TAB */}
            <TabsContent value="customers" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                    <CardTitle className="text-lg font-semibold text-blue-800">👥 Customer Database</CardTitle>
                    <CardDescription className="text-blue-600">Manage customer information</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CustomerDatabase />
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-cyan-50 to-teal-50 border-b">
                    <CardTitle className="text-lg font-semibold text-cyan-800">📋 Service History</CardTitle>
                    <CardDescription className="text-cyan-600">View customer service history</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ServiceHistory />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* COMMUNICATIONS TAB */}
            <TabsContent value="communications" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 border-b">
                    <CardTitle className="text-lg font-semibold text-purple-800">💬 Communication Manager</CardTitle>
                    <CardDescription className="text-purple-600">Manage all customer communications</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CommunicationManager />
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                    <CardTitle className="text-lg font-semibold text-green-800">📞 Voice Call Manager</CardTitle>
                    <CardDescription className="text-green-600">Handle voice calls and recordings</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <VoiceCallManager />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* BILLING TAB */}
            <TabsContent value="billing" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b">
                    <CardTitle className="text-lg font-semibold text-emerald-800">💳 Invoice Manager</CardTitle>
                    <CardDescription className="text-emerald-600">Manage invoices and billing</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <InvoiceManager />
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
                    <CardTitle className="text-lg font-semibold text-amber-800">💳 Payment Processor</CardTitle>
                    <CardDescription className="text-amber-600">Process payments and transactions</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PaymentProcessor />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* ANALYTICS TAB */}
            <TabsContent value="analytics" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                  <CardTitle className="text-lg font-semibold text-orange-800">📊 Analytics Dashboard</CardTitle>
                  <CardDescription className="text-orange-600">View business analytics and insights</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <AnalyticsDashboard />
                </CardContent>
              </Card>
            </TabsContent>

            {/* SETTINGS TAB */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                    <CardTitle className="text-lg font-semibold text-slate-800">⚙️ Service Type Config</CardTitle>
                    <CardDescription className="text-slate-600">Configure service types and settings</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ServiceTypeConfig />
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                    <CardTitle className="text-lg font-semibold text-slate-800">📞 Phone Number Setup</CardTitle>
                    <CardDescription className="text-slate-600">Configure phone numbers and settings</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <PhoneNumberSetup />
                  </CardContent>
                </Card>
              </div>

              {/* Business Configuration - Full Width */}
              <div className="mt-8">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b">
                    <CardTitle className="text-lg font-semibold text-slate-800">🏢 Business Configuration</CardTitle>
                    <CardDescription className="text-slate-600">Configure business settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <BusinessConfiguration />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

    </div>
  );
};

export default CommunicationIQ;