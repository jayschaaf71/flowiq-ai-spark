
import { useState } from "react";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { EnhancedBookingFlow } from "@/components/booking/EnhancedBookingFlow";
import { EHRDashboard } from "@/components/ehr/EHRDashboard";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationAutomation } from "@/hooks/useNotificationAutomation";
import { 
  Calendar, 
  Users, 
  BarChart3, 
  FileText, 
  Bell,
  Settings,
  Plus,
  Activity,
  TrendingUp,
  Clock
} from "lucide-react";

export const ComprehensiveDashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const { profile } = useAuth();
  const { processAutomatedNotifications } = useNotificationAutomation();

  const handleAppointmentBooked = async (appointmentId: string) => {
    await processAutomatedNotifications(appointmentId, 'appointment_booked');
  };

  const quickStats = [
    { 
      title: "Today's Appointments", 
      value: "12", 
      icon: Calendar, 
      trend: "+8%",
      color: "text-blue-600"
    },
    { 
      title: "Active Patients", 
      value: "284", 
      icon: Users, 
      trend: "+12%",
      color: "text-green-600"
    },
    { 
      title: "Pending Tasks", 
      value: "7", 
      icon: Clock, 
      trend: "-3%",
      color: "text-orange-600"
    },
    { 
      title: "Monthly Revenue", 
      value: "$24,580", 
      icon: TrendingUp, 
      trend: "+15%",
      color: "text-purple-600"
    }
  ];

  const recentActivities = [
    { 
      time: "10 min ago", 
      action: "New patient registration completed", 
      type: "patient",
      icon: Users
    },
    { 
      time: "25 min ago", 
      action: "Appointment confirmed for Sarah Johnson", 
      type: "appointment",
      icon: Calendar
    },
    { 
      time: "1 hour ago", 
      action: "Lab results received for John Smith", 
      type: "medical",
      icon: FileText
    },
    { 
      time: "2 hours ago", 
      action: "Payment processed - $150", 
      type: "payment",
      icon: TrendingUp
    }
  ];

  const QuickActionCard = ({ title, description, icon: Icon, onClick, disabled = false }: any) => (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${disabled ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
          </div>
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={onClick}
          disabled={disabled}
          className="w-full"
          size="sm"
        >
          {disabled ? 'Coming Soon' : 'Open'}
        </Button>
      </CardContent>
    </Card>
  );

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, {profile.first_name || 'User'}!
          </h1>
          <p className="text-gray-600">
            Here's what's happening in your practice today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Activity className="w-3 h-3 mr-1" />
            All Systems Online
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.trend.startsWith('+') ? "text-green-600" : "text-red-600"}>
                  {stat.trend}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="booking">Book Appointment</TabsTrigger>
          <TabsTrigger value="ehr">Patient Records</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <QuickActionCard
                    title="Book Appointment"
                    description="Schedule a new patient visit"
                    icon={Plus}
                    onClick={() => setActiveView("booking")}
                  />
                  <RoleGuard allowedRoles={['staff', 'admin']}>
                    <QuickActionCard
                      title="Patient Records"
                      description="Access EHR system"
                      icon={FileText}
                      onClick={() => setActiveView("ehr")}
                    />
                  </RoleGuard>
                  <RoleGuard allowedRoles={['admin']}>
                    <QuickActionCard
                      title="View Analytics"
                      description="Practice performance metrics"
                      icon={BarChart3}
                      onClick={() => setActiveView("analytics")}
                    />
                  </RoleGuard>
                  <QuickActionCard
                    title="Notifications"
                    description="Manage alerts and reminders"
                    icon={Bell}
                    onClick={() => setActiveView("settings")}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <activity.icon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="booking">
          <EnhancedBookingFlow onAppointmentBooked={handleAppointmentBooked} />
        </TabsContent>

        <TabsContent value="ehr">
          <RoleGuard allowedRoles={['staff', 'admin']}>
            <EHRDashboard />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="analytics">
          <RoleGuard allowedRoles={['admin']}>
            <AnalyticsDashboard />
          </RoleGuard>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings & Configuration
              </CardTitle>
              <CardDescription>
                Manage your account and system preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900">Coming Soon</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Advanced settings, notification preferences, and system configuration options will be available in the next update.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h5 className="font-medium">Profile Settings</h5>
                    <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h5 className="font-medium">Notification Preferences</h5>
                    <p className="text-sm text-gray-600 mt-1">Configure alerts and reminders</p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h5 className="font-medium">Practice Settings</h5>
                    <p className="text-sm text-gray-600 mt-1">Manage practice-wide configurations</p>
                  </div>
                  <div className="border border-gray-200 p-4 rounded-lg">
                    <h5 className="font-medium">Integration Settings</h5>
                    <p className="text-sm text-gray-600 mt-1">Connect with external systems</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
