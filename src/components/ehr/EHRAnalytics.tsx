
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { StatsCards } from "./analytics/StatsCards";
import { VisitTrendsChart } from "./analytics/VisitTrendsChart";
import { DiagnosisChart } from "./analytics/DiagnosisChart";
import { ComplianceOverview } from "./analytics/ComplianceOverview";
import { ComplianceIssues } from "./analytics/ComplianceIssues";
import { RevenueAnalytics } from "./analytics/RevenueAnalytics";
import { ProviderPerformance } from "./analytics/ProviderPerformance";

export const EHRAnalytics = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">EHR Analytics</h2>
          <p className="text-muted-foreground">Practice insights and compliance monitoring</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <StatsCards />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VisitTrendsChart />
        <DiagnosisChart />
      </div>

      {/* Compliance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ComplianceOverview />
        <ComplianceIssues />
      </div>

      {/* Revenue Analytics */}
      <RevenueAnalytics />

      {/* Provider Performance */}
      <ProviderPerformance />
    </div>
  );
};
