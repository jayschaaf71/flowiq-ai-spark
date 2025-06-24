
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { revenueAnalyticsService, RevenueMetrics, RevenueKPI } from "@/services/revenueAnalytics";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Target,
  BarChart3,
  PieChart,
  RefreshCw,
  Download,
  AlertCircle
} from "lucide-react";

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

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'percentage':
        return `${value.toFixed(1)}%`;
      case 'days':
        return `${Math.round(value)} days`;
      default:
        return value.toLocaleString();
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <div className="w-4 h-4" />;
    }
  };

  const getKPIColor = (kpi: RevenueKPI) => {
    if (kpi.name === 'Days in A/R' || kpi.name === 'Denial Rate') {
      return kpi.current <= kpi.target ? 'text-green-600' : 'text-red-600';
    }
    return kpi.current >= kpi.target ? 'text-green-600' : 'text-red-600';
  };

  // Mock data for charts and tables
  const providerPerformance = [
    { name: 'Dr. Smith', billed: 125000, collected: 118750, rate: 95.0 },
    { name: 'Dr. Johnson', billed: 98000, collected: 91140, rate: 93.0 },
    { name: 'Dr. Brown', billed: 87500, collected: 79625, rate: 91.0 }
  ];

  const payerPerformance = [
    { name: 'Blue Cross Blue Shield', collected: 85000, rate: 94.5, days: 28 },
    { name: 'Aetna', collected: 67000, rate: 91.2, days: 32 },
    { name: 'Cigna', collected: 54000, rate: 87.8, days: 38 }
  ];

  const revenueByService = [
    { service: 'Office Visits', revenue: 145000, percentage: 38 },
    { service: 'Procedures', revenue: 98000, percentage: 26 },
    { service: 'Diagnostic Tests', revenue: 76000, percentage: 20 },
    { service: 'Consultations', revenue: 61000, percentage: 16 }
  ];

  if (loading) {
    return <div className="flex justify-center p-8">Loading revenue analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Comprehensive Revenue Analytics
          </h3>
          <p className="text-gray-600">
            Advanced revenue cycle analytics with KPI tracking and forecasting
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadAnalytics}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{kpi.name}</CardTitle>
                {getTrendIcon(kpi.trend)}
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getKPIColor(kpi)}`}>
                {formatValue(kpi.current, kpi.format)}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">
                  Target: {formatValue(kpi.target, kpi.format)}
                </span>
                <Badge variant={kpi.variance >= 0 ? "default" : "destructive"} className="text-xs">
                  {kpi.variance > 0 ? '+' : ''}{formatValue(Math.abs(kpi.variance), kpi.format)}
                </Badge>
              </div>
              <Progress 
                value={kpi.name === 'Days in A/R' || kpi.name === 'Denial Rate' 
                  ? Math.max(0, 100 - (kpi.current / kpi.target) * 100)
                  : (kpi.current / kpi.target) * 100
                } 
                className="mt-2" 
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">By Provider</TabsTrigger>
          <TabsTrigger value="payers">By Payer</TabsTrigger>
          <TabsTrigger value="services">By Service</TabsTrigger>
          <TabsTrigger value="forecast">Forecast</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Revenue Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Billed</span>
                    <span className="text-lg font-bold">
                      ${metrics?.totalBilled.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Collected</span>
                    <span className="text-lg font-bold text-green-600">
                      ${metrics?.totalCollected.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Collection Rate</span>
                    <span className="text-lg font-bold">
                      {metrics?.collectionRate.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={metrics?.collectionRate || 0} className="mt-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  A/R Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Average Days in A/R</span>
                    <span className="text-lg font-bold">
                      {Math.round(metrics?.averageDaysInAR || 0)} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Working Days in A/R</span>
                    <span className="text-lg font-bold">
                      {Math.round(metrics?.workingDaysInAR || 0)} days
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Denial Rate</span>
                    <span className="text-lg font-bold text-red-600">
                      {metrics?.denialRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Provider Performance Analysis</CardTitle>
              <CardDescription>
                Revenue performance breakdown by healthcare provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Billed Amount</TableHead>
                    <TableHead>Collected Amount</TableHead>
                    <TableHead>Collection Rate</TableHead>
                    <TableHead>Performance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {providerPerformance.map((provider, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{provider.name}</TableCell>
                      <TableCell>${provider.billed.toLocaleString()}</TableCell>
                      <TableCell>${provider.collected.toLocaleString()}</TableCell>
                      <TableCell>{provider.rate}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={provider.rate} className="w-20" />
                          <Badge variant={provider.rate >= 95 ? "default" : "secondary"}>
                            {provider.rate >= 95 ? "Excellent" : "Good"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payers">
          <Card>
            <CardHeader>
              <CardTitle>Payer Performance Analysis</CardTitle>
              <CardDescription>
                Collection rates and payment timing by insurance provider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Insurance Provider</TableHead>
                    <TableHead>Collected Amount</TableHead>
                    <TableHead>Collection Rate</TableHead>
                    <TableHead>Avg Payment Days</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payerPerformance.map((payer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{payer.name}</TableCell>
                      <TableCell>${payer.collected.toLocaleString()}</TableCell>
                      <TableCell>{payer.rate}%</TableCell>
                      <TableCell>{payer.days} days</TableCell>
                      <TableCell>
                        <Badge variant={
                          payer.rate >= 95 ? "default" : 
                          payer.rate >= 90 ? "secondary" : "destructive"
                        }>
                          {payer.rate >= 95 ? "Excellent" : 
                           payer.rate >= 90 ? "Good" : "Needs Attention"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-600" />
                Revenue by Service Type
              </CardTitle>
              <CardDescription>
                Revenue distribution across different service categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueByService.map((service, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{service.service}</span>
                      <div className="text-right">
                        <div className="font-bold">${service.revenue.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">{service.percentage}%</div>
                      </div>
                    </div>
                    <Progress value={service.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Revenue Forecast
              </CardTitle>
              <CardDescription>
                AI-powered revenue projections for the next 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$52,400</div>
                    <div className="text-sm text-muted-foreground">Next Month</div>
                    <div className="text-xs text-green-600">95% confidence</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$318,200</div>
                    <div className="text-sm text-muted-foreground">Next Quarter</div>
                    <div className="text-xs text-blue-600">87% confidence</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">$654,800</div>
                    <div className="text-sm text-muted-foreground">Next 6 Months</div>
                    <div className="text-xs text-purple-600">78% confidence</div>
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Forecast Factors</h4>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Historical revenue trends show 2% monthly growth</li>
                        <li>• Seasonal adjustments for healthcare utilization patterns</li>
                        <li>• Payer mix changes and contract renewals</li>
                        <li>• Provider productivity and capacity planning</li>
                      </ul>
                    </div>
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
