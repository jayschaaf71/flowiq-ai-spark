
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { revenueAnalyticsService, RevenueMetrics, RevenueKPI } from "@/services/revenueAnalytics";
import { RevenueAnalyticsHeader } from "./revenue/RevenueAnalyticsHeader";
import { RevenueKPIDashboard } from "./revenue/RevenueKPIDashboard";
import { RevenueOverviewTab } from "./revenue/RevenueOverviewTab";
import { ProviderPerformanceTab } from "./revenue/ProviderPerformanceTab";
import { PayerPerformanceTab } from "./revenue/PayerPerformanceTab";
import { ServiceRevenueTab } from "./revenue/ServiceRevenueTab";
import { RevenueForecastTab } from "./revenue/RevenueForecastTab";

export const ComprehensiveRevenueAnalytics = () => {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [kpis, setKPIs] = useState<RevenueKPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [metricsData, kpiData] = await Promise.all([
        revenueAnalyticsService.getRevenueMetrics(dateRange),
        revenueAnalyticsService.getRevenueKPIs(dateRange)
      ]);
      
      setMetrics(metricsData);
      setKPIs(kpiData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        title: "Error Loading Analytics",
        description: "Unable to load revenue analytics data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading revenue analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <RevenueAnalyticsHeader onRefresh={loadAnalytics} />

      <RevenueKPIDashboard kpis={kpis} />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">By Provider</TabsTrigger>
          <TabsTrigger value="payers">By Payer</TabsTrigger>
          <TabsTrigger value="services">By Service</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <RevenueOverviewTab metrics={metrics} />
        </TabsContent>

        <TabsContent value="providers">
          <ProviderPerformanceTab />
        </TabsContent>

        <TabsContent value="payers">
          <PayerPerformanceTab />
        </TabsContent>

        <TabsContent value="services">
          <ServiceRevenueTab />
        </TabsContent>

        <TabsContent value="forecast">
          <RevenueForecastTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
