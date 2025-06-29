
import { QuickStats } from "@/components/clinic/QuickStats";
import { RecentActivity } from "@/components/clinic/RecentActivity";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActionsSection } from "@/components/dashboard/QuickActionsSection";
import { PracticeAreasSection } from "@/components/dashboard/PracticeAreasSection";
import { CalendarSection } from "@/components/dashboard/CalendarSection";
import { SetupTestingSection } from "@/components/dashboard/SetupTestingSection";
import { KPISection } from "@/components/dashboard/KPISection";
import { ProviderComplianceSection } from "@/components/dashboard/ProviderComplianceSection";
import { AIAssistantButton } from "@/components/dashboard/AIAssistantButton";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRealtimeDashboard } from "@/hooks/useRealtimeDashboard";

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
      <DashboardHeader />
      
      <div className="space-y-6">
        <QuickStats />
        <QuickActionsSection />
        <PracticeAreasSection />
        <CalendarSection />
        <SetupTestingSection />
        <KPISection />
        <ProviderComplianceSection />
        <RecentActivity />
      </div>

      <AIAssistantButton />
    </div>
  );
};

export default Index;
