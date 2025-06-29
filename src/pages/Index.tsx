
import { QuickStats } from "@/components/clinic/QuickStats";
import { RecentActivity } from "@/components/clinic/RecentActivity";
import { EnhancedDashboardHeader } from "@/components/dashboard/EnhancedDashboardHeader";
import { QuickActionsSection } from "@/components/dashboard/QuickActionsSection";
import { PracticeAreasSection } from "@/components/dashboard/PracticeAreasSection";
import { CalendarSection } from "@/components/dashboard/CalendarSection";
import { SetupTestingSection } from "@/components/dashboard/SetupTestingSection";
import { KPISection } from "@/components/dashboard/KPISection";
import { ProviderComplianceSection } from "@/components/dashboard/ProviderComplianceSection";
import { AIAssistantButton } from "@/components/dashboard/AIAssistantButton";
import { RealTimeActivityFeed } from "@/components/dashboard/RealTimeActivityFeed";
import { SmartInsightsWidget } from "@/components/dashboard/SmartInsightsWidget";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";
import { BarChart3 } from "lucide-react";

const Index = () => {
  const { isLoading } = useDashboardData();
  
  // Set up real-time updates
  useRealtimeDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <EnhancedDashboardHeader />
      
      <div className="space-y-6">
        <QuickStats />
        <QuickActionsSection />
        
        {/* Enhanced dashboard widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RealTimeActivityFeed />
          <SmartInsightsWidget />
        </div>
        
        {/* Advanced Analytics Link */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-600">Get comprehensive insights with detailed analytics dashboards</p>
            </div>
            <a 
              href="/advanced-analytics"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </a>
          </div>
        </div>
        
        <PracticeAreasSection />
        <CalendarSection />
        <SetupTestingSection />
        <KPISection />
        <ProviderComplianceSection />
      </div>

      <AIAssistantButton />
    </div>
  );
};

export default Index;
