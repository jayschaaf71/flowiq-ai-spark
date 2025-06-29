
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ClinicMetrics } from "@/components/clinic/ClinicMetrics";
import { ProviderSummary } from "@/components/clinic/ProviderSummary";
import { RecentActivity } from "@/components/clinic/RecentActivity";
import { QuickStats } from "@/components/clinic/QuickStats";
import { ComplianceMonitor } from "@/components/compliance/ComplianceMonitor";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { FinancialSummaryWidget } from "@/components/dashboard/FinancialSummaryWidget";
import { PatientExperienceWidget } from "@/components/dashboard/PatientExperienceWidget";
import { ComplianceWidget } from "@/components/dashboard/ComplianceWidget";
import { AIAssistant } from "@/components/AIAssistant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Settings, TrendingUp, Users, Calendar as CalendarIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleOnboardingClick = () => {
    navigate('/onboard-tenant');
  };

  const handleAIAgentsClick = () => {
    navigate('/agents/scribe');
  };

  const handleAnalyticsClick = () => {
    navigate('/analytics');
  };

  const quickActions = [
    { label: "Patient Management", icon: Users, path: "/patient-management", color: "bg-blue-50 text-blue-700" },
    { label: "Schedule", icon: CalendarIcon, path: "/schedule", color: "bg-green-50 text-green-700" },
    { label: "Analytics", icon: TrendingUp, path: "/analytics", color: "bg-purple-50 text-purple-700" },
    { label: "Financial", icon: TrendingUp, path: "/financial", color: "bg-green-50 text-green-700" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader 
          title="Clinic Dashboard"
          subtitle={`Daily operations overview and key performance indicators${profile?.tenant_id ? ` - ${profile.tenant_id.toUpperCase()} Tenant` : ''}`}
        />
        <div className="flex gap-2">
          <Button 
            onClick={handleAIAgentsClick}
            variant="outline"
          >
            AI Agents
          </Button>
          <Button 
            onClick={handleAnalyticsClick}
          >
            View Analytics
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Quick Stats Overview - Now Clickable */}
        <QuickStats />

        {/* Quick Actions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to key areas of your practice</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className={`h-20 flex-col gap-2 ${action.color}`}
                  onClick={() => navigate(action.path)}
                >
                  <action.icon className="h-6 w-6" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* New Practice Areas Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FinancialSummaryWidget />
          <PatientExperienceWidget />
          <ComplianceWidget />
        </div>

        {/* Calendar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CalendarWidget />
          </div>
          <div>
            <MiniCalendar />
          </div>
        </div>

        {/* Testing & Setup Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Setup & Testing
            </CardTitle>
            <CardDescription>
              Access setup flows and testing tools
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button 
              onClick={handleOnboardingClick}
              className="flex-1"
              variant="outline"
            >
              Go Through Onboarding Flow
            </Button>
            <Button 
              onClick={() => navigate('/agents')}
              className="flex-1"
              variant="outline"
            >
              Configure AI Agents
            </Button>
          </CardContent>
        </Card>
        
        {/* Key Performance Indicators - Now Clickable */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/analytics')}
            >
              View Detailed Analytics
            </Button>
          </div>
          <ClinicMetrics />
        </div>

        {/* Provider Summary and Compliance Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProviderSummary />
          </div>
          <div>
            <ComplianceMonitor />
          </div>
        </div>

        {/* Recent Activity - Now Clickable */}
        <RecentActivity />
      </div>

      {/* AI Chat Assistant */}
      <Button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-200"
        size="icon"
      >
        <MessageSquare className="h-5 w-5" />
      </Button>

      <AIAssistant isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
