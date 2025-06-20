
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { PracticeMetrics } from "@/components/analytics/PracticeMetrics";
import { RevenueChart } from "@/components/analytics/RevenueChart";
import { ProviderPerformanceAnalytics } from "@/components/analytics/ProviderPerformanceAnalytics";
import { ComplianceAnalytics } from "@/components/analytics/ComplianceAnalytics";

const Analytics = () => {
  return (
    <Layout>
      <PageHeader 
        title="Analytics"
        subtitle="Practice insights, performance metrics, and compliance monitoring"
      />
      <div className="space-y-6">
        {/* Key Performance Metrics */}
        <PracticeMetrics />
        
        {/* Revenue and Appointment Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RevenueChart />
          <ProviderPerformanceAnalytics />
        </div>
        
        {/* Compliance Analytics */}
        <ComplianceAnalytics />
      </div>
    </Layout>
  );
};

export default Analytics;
