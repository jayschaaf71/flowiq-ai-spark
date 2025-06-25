import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScheduleStats } from "@/components/schedule/ScheduleStats";
import { ScheduleAgentDashboard } from "@/components/schedule/ScheduleAgentDashboard";
import { AppointmentManager } from "@/components/schedule/AppointmentManager";
import { ProductionBookingInterface } from "@/components/schedule/ProductionBookingInterface";
import { EnhancedCalendarView } from "@/components/schedule/EnhancedCalendarView";
import { AIScheduleChat } from "@/components/schedule/AIScheduleChat";
import { ScheduleAnalytics } from "@/components/schedule/ScheduleAnalytics";
import { AutomatedReminders } from "@/components/schedule/AutomatedReminders";
import { ScheduleSettings } from "@/components/schedule/ScheduleSettings";
import { SetupWizard } from "@/components/schedule/SetupWizard";
import { SchedulingEngine } from "@/components/schedule/SchedulingEngine";
import { DailyProviderSummary } from "@/components/schedule/DailyProviderSummary";
import { PreAppointmentSummaryPreview } from "@/components/schedule/PreAppointmentSummaryPreview";
import { PreAppointmentAutomation } from "@/components/schedule/PreAppointmentAutomation";
import { PatientRiskDashboard } from "@/components/schedule/PatientRiskDashboard";
import { ScheduleOptimizer } from "@/components/schedule/ScheduleOptimizer";
import { SmartSchedulingSuggestions } from "@/components/schedule/SmartSchedulingSuggestions";
import { IntegrationDashboard } from "@/components/schedule/IntegrationDashboard";
import { AdvancedComplianceDashboard } from "@/components/compliance/AdvancedComplianceDashboard";
import { ProductionDashboard } from "@/components/production/ProductionDashboard";
import { RealTimeCalendar } from "@/components/schedule/RealTimeCalendar";
import { ScheduleIQDashboard } from "@/components/schedule/ScheduleIQDashboard";
import { ScheduleIQControls } from "@/components/schedule/ScheduleIQControls";
import { RealTimeNotifications } from "@/components/schedule/RealTimeNotifications";
import { useToast } from "@/hooks/use-toast";
import { Settings, Zap, Brain, BarChart3, MessageCircle, Calendar, Users, Bell, Mail, User, Cog, TrendingUp, Database, Shield, Server, Activity } from "lucide-react";
import { IntegrationSetup } from "@/components/schedule/IntegrationSetup";

const ScheduleIQ = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshKey, setRefreshKey] = useState(0);
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const practiceId = "default-practice"; // This would come from user context

  const stats = {
    appointmentsToday: 24,
    bookedThisWeek: 156,
    utilizationRate: 87,
    noShowRate: 5,
    avgBookingTime: "2.3 minutes",
    automatedBookings: 89
  };

  const recentActivity = [
    { time: "2 min ago", action: "AI auto-booked appointment for Sarah Wilson", type: "booking" },
    { time: "5 min ago", action: "Optimized Dr. Smith's calendar for better flow", type: "optimization" },
    { time: "8 min ago", action: "Processed 3 waitlist patients automatically", type: "waitlist" },
    { time: "12 min ago", action: "Resolved scheduling conflict with AI", type: "conflict" },
    { time: "15 min ago", action: "Sent smart reminders to 8 patients", type: "reminder" }
  ];

  const upcomingTasks = [
    { task: "AI processing 5 rescheduling requests", priority: "high" as const, eta: "2 min" },
    { task: "Optimize tomorrow's schedule", priority: "medium" as const, eta: "15 min" },
    { task: "Process waitlist (12 patients)", priority: "medium" as const, eta: "5 min" },
    { task: "Send weekly availability report", priority: "low" as const, eta: "1 hour" }
  ];

  const handleAppointmentBooked = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab("appointments");
  };

  const handleConfigureClick = () => {
    setActiveTab("controls");
  };

  const handleAiOptimize = async () => {
    setAiOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setAiOptimizing(false);
    setRefreshKey(prev => prev + 1);
  };

  const handleSuggestionApplied = (suggestion: any) => {
    console.log('Applied suggestion:', suggestion);
    setRefreshKey(prev => prev + 1);
  };

  const handleTimeSlotClick = (date: Date, time: string) => {
    console.log('Time slot clicked:', date, time);
    setActiveTab("book");
  };

  const handleAppointmentClick = (appointment: any) => {
    console.log('Appointment clicked:', appointment);
    setActiveTab("appointments");
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Schedule iQ"
        subtitle="Advanced AI-powered appointment scheduling and calendar optimization agent"
      >
        <div className="flex items-center gap-2">
          <RealTimeNotifications />
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Brain className="w-3 h-3 mr-1" />
            AI Active
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Activity className="w-3 h-3 mr-1" />
            Real-time
          </Badge>
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            HIPAA Compliant
          </Badge>
          <Button variant="outline" size="sm" onClick={handleConfigureClick}>
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={handleAiOptimize}
            disabled={aiOptimizing}
          >
            {aiOptimizing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Optimize Now
              </>
            )}
          </Button>
        </div>
      </PageHeader>
      
      <div className="p-6 space-y-6">
        <ScheduleStats stats={stats} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 h-auto p-1">
              <TabsTrigger value="dashboard" className="flex items-center gap-1 text-xs px-2 py-2">
                <Brain className="w-3 h-3" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="iq-dashboard" className="flex items-center gap-1 text-xs px-2 py-2">
                <Activity className="w-3 h-3" />
                <span className="hidden sm:inline">iQ Center</span>
              </TabsTrigger>
              <TabsTrigger value="controls" className="flex items-center gap-1 text-xs px-2 py-2">
                <Settings className="w-3 h-3" />
                <span className="hidden sm:inline">Controls</span>
              </TabsTrigger>
              <TabsTrigger value="real-time" className="flex items-center gap-1 text-xs px-2 py-2">
                <Calendar className="w-3 h-3" />
                <span className="hidden sm:inline">Live Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="optimizer" className="flex items-center gap-1 text-xs px-2 py-2">
                <Zap className="w-3 h-3" />
                <span className="hidden sm:inline">Optimizer</span>
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-1 text-xs px-2 py-2">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">Suggestions</span>
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-1 text-xs px-2 py-2">
                <MessageCircle className="w-3 h-3" />
                <span className="hidden sm:inline">AI Chat</span>
              </TabsTrigger>
              <TabsTrigger value="risk-analysis" className="flex items-center gap-1 text-xs px-2 py-2">
                <TrendingUp className="w-3 h-3" />
                <span className="hidden sm:inline">Risk</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Second row of tabs */}
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 h-auto p-1 mt-2">
              <TabsTrigger value="book" className="flex items-center gap-1 text-xs px-2 py-2">
                <Calendar className="w-3 h-3" />
                <span className="hidden sm:inline">Book</span>
              </TabsTrigger>
              <TabsTrigger value="appointments" className="flex items-center gap-1 text-xs px-2 py-2">
                <Users className="w-3 h-3" />
                <span className="hidden sm:inline">Appointments</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-1 text-xs px-2 py-2">
                <Calendar className="w-3 h-3" />
                <span className="hidden sm:inline">Calendar</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs px-2 py-2">
                <BarChart3 className="w-3 h-3" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="reminders" className="flex items-center gap-1 text-xs px-2 py-2">
                <Bell className="w-3 h-3" />
                <span className="hidden sm:inline">Reminders</span>
              </TabsTrigger>
              <TabsTrigger value="pre-summary" className="flex items-center gap-1 text-xs px-2 py-2">
                <User className="w-3 h-3" />
                <span className="hidden sm:inline">Pre-Summary</span>
              </TabsTrigger>
              <TabsTrigger value="automation" className="flex items-center gap-1 text-xs px-2 py-2">
                <Cog className="w-3 h-3" />
                <span className="hidden sm:inline">Automation</span>
              </TabsTrigger>
              <TabsTrigger value="daily-summary" className="flex items-center gap-1 text-xs px-2 py-2">
                <Mail className="w-3 h-3" />
                <span className="hidden sm:inline">Daily</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Third row with remaining tabs */}
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 h-auto p-1 mt-2">
              <TabsTrigger value="integrations" className="flex items-center gap-1 text-xs px-2 py-2">
                <Database className="w-3 h-3" />
                <span className="hidden sm:inline">Integrations</span>
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center gap-1 text-xs px-2 py-2">
                <Shield className="w-3 h-3" />
                <span className="hidden sm:inline">Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="production" className="flex items-center gap-1 text-xs px-2 py-2">
                <Server className="w-3 h-3" />
                <span className="hidden sm:inline">Production</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1 text-xs px-2 py-2">
                <Settings className="w-3 h-3" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4">
            <ScheduleAgentDashboard 
              stats={stats}
              recentActivity={recentActivity}
              upcomingTasks={upcomingTasks}
            />
          </TabsContent>

          <TabsContent value="iq-dashboard" className="space-y-4">
            <ScheduleIQDashboard practiceId={practiceId} />
          </TabsContent>

          <TabsContent value="controls" className="space-y-4">
            <ScheduleIQControls 
              practiceId={practiceId}
              onConfigChange={() => setRefreshKey(prev => prev + 1)}
            />
          </TabsContent>

          <TabsContent value="real-time" className="space-y-4">
            <RealTimeCalendar 
              onTimeSlotClick={handleTimeSlotClick}
              onAppointmentClick={handleAppointmentClick}
            />
          </TabsContent>

          <TabsContent value="optimizer" className="space-y-4">
            <ScheduleOptimizer providerId={selectedProviderId || undefined} />
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <SmartSchedulingSuggestions 
              appointments={[]} 
              providerId={selectedProviderId || undefined}
              onApplySuggestion={handleSuggestionApplied}
            />
          </TabsContent>

          <TabsContent value="chat" className="space-y-4">
            <AIScheduleChat />
          </TabsContent>

          <TabsContent value="risk-analysis" className="space-y-4">
            <PatientRiskDashboard showOverview={true} />
          </TabsContent>

          <TabsContent value="book" className="space-y-4">
            <ProductionBookingInterface onAppointmentBooked={handleAppointmentBooked} />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <AppointmentManager 
              key={refreshKey}
              onAppointmentUpdate={(appointment) => {
                console.log("Appointment updated:", appointment);
              }}
            />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <EnhancedCalendarView />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <ScheduleAnalytics />
          </TabsContent>

          <TabsContent value="reminders" className="space-y-4">
            <AutomatedReminders />
          </TabsContent>

          <TabsContent value="pre-summary" className="space-y-4">
            <PreAppointmentSummaryPreview />
          </TabsContent>

          <TabsContent value="automation" className="space-y-4">
            <PreAppointmentAutomation />
          </TabsContent>

          <TabsContent value="daily-summary" className="space-y-4">
            <DailyProviderSummary />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <IntegrationSetup />
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <AdvancedComplianceDashboard />
          </TabsContent>

          <TabsContent value="production" className="space-y-4">
            <ProductionDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <ScheduleSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ScheduleIQ;
