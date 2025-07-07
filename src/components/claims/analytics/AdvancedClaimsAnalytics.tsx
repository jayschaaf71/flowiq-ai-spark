import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Clock, 
  Target,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Users,
  FileText,
  Download,
  RefreshCw
} from "lucide-react";

export const AdvancedClaimsAnalytics = () => {
  const [activeView, setActiveView] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');
  const { toast } = useToast();

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalClaims: 2847,
      totalRevenue: 1275400,
      averageAmount: 448.23,
      approvalRate: 87.4,
      processingTime: 3.2,
      denialRate: 8.9,
      reimbursementRate: 91.2,
      costPerClaim: 12.50
    },
    trends: {
      monthlyGrowth: 12.5,
      revenueGrowth: 18.2,
      efficiencyGain: 23.1,
      denialReduction: -15.4
    },
    payerBreakdown: [
      { name: 'Blue Cross Blue Shield', claims: 845, revenue: 387200, rate: 89.2 },
      { name: 'Aetna', claims: 623, revenue: 298500, rate: 85.7 },
      { name: 'Cigna', claims: 567, revenue: 245800, rate: 91.3 },
      { name: 'UnitedHealth', claims: 489, revenue: 201900, rate: 88.1 },
      { name: 'Humana', claims: 323, revenue: 142000, rate: 86.5 }
    ],
    specialtyMetrics: [
      { specialty: 'Primary Care', claims: 1240, revenue: 456800, margin: 34.2 },
      { specialty: 'Cardiology', claims: 567, revenue: 342100, margin: 41.8 },
      { specialty: 'Orthopedics', claims: 423, revenue: 287600, margin: 38.9 },
      { specialty: 'Neurology', claims: 345, revenue: 123500, margin: 29.7 },
      { specialty: 'Dermatology', claims: 272, revenue: 65400, margin: 52.3 }
    ]
  };

  const exportReport = () => {
    toast({
      title: "Report Generated",
      description: "Advanced claims analytics report has been exported to CSV"
    });
  };

  const refreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Analytics data has been updated with latest claims information"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            Advanced Claims Analytics
          </h2>
          <p className="text-gray-600">Comprehensive analysis of claims performance and revenue metrics</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={refreshData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button 
            onClick={exportReport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d', '1y'].map((range) => (
          <Button
            key={range}
            variant={dateRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setDateRange(range)}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
          </Button>
        ))}
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{analyticsData.overview.totalClaims.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{analyticsData.trends.monthlyGrowth}%</span>
                </div>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${(analyticsData.overview.totalRevenue / 1000000).toFixed(1)}M</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+{analyticsData.trends.revenueGrowth}%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold">{analyticsData.overview.approvalRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">+2.1%</span>
                </div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Processing</p>
                <p className="text-2xl font-bold">{analyticsData.overview.processingTime}d</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="w-3 h-3 text-green-600" />
                  <span className="text-xs text-green-600">-0.8d</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Tabs */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Performance Overview</TabsTrigger>
          <TabsTrigger value="payers">Payer Analysis</TabsTrigger>
          <TabsTrigger value="specialty">Specialty Breakdown</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Claims Performance</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Approval Rate</span>
                    <span>{analyticsData.overview.approvalRate}%</span>
                  </div>
                  <Progress value={analyticsData.overview.approvalRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Reimbursement Rate</span>
                    <span>{analyticsData.overview.reimbursementRate}%</span>
                  </div>
                  <Progress value={analyticsData.overview.reimbursementRate} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Denial Rate</span>
                    <span>{analyticsData.overview.denialRate}%</span>
                  </div>
                  <Progress value={analyticsData.overview.denialRate} className="h-2 bg-red-100" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Metrics</CardTitle>
                <CardDescription>Revenue and cost analysis</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Average Claim Amount:</span>
                  <span className="font-bold">${analyticsData.overview.averageAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Cost per Claim:</span>
                  <span className="font-bold">${analyticsData.overview.costPerClaim}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Processing Efficiency:</span>
                  <span className="font-bold text-green-600">+{analyticsData.trends.efficiencyGain}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Revenue:</span>
                  <span className="font-bold">${(analyticsData.overview.totalRevenue / 12).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payer Performance Analysis</CardTitle>
              <CardDescription>Detailed breakdown by insurance provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.payerBreakdown.map((payer, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{payer.name}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>{payer.claims} claims</span>
                        <span>${payer.revenue.toLocaleString()} revenue</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{payer.rate}%</div>
                      <div className="text-sm text-gray-600">approval rate</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specialty" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Specialty Performance</CardTitle>
              <CardDescription>Revenue and margin analysis by medical specialty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.specialtyMetrics.map((specialty, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{specialty.specialty}</h4>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        <span>{specialty.claims} claims</span>
                        <span>${specialty.revenue.toLocaleString()} revenue</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{specialty.margin}%</div>
                      <div className="text-sm text-gray-600">profit margin</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Period-over-period comparison</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Claims Volume Growth</span>
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{analyticsData.trends.monthlyGrowth}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Revenue Growth</span>
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{analyticsData.trends.revenueGrowth}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Efficiency Improvement</span>
                  <Badge className="bg-blue-100 text-blue-700">
                    <Target className="w-3 h-3 mr-1" />
                    +{analyticsData.trends.efficiencyGain}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Denial Rate Reduction</span>
                  <Badge className="bg-green-100 text-green-700">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    {analyticsData.trends.denialReduction}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Insights</CardTitle>
                <CardDescription>AI-powered forecasting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm font-medium text-blue-800">Revenue Forecast</p>
                  <p className="text-xs text-blue-700">Expected to reach $1.5M next month (+17%)</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm font-medium text-green-800">Processing Optimization</p>
                  <p className="text-xs text-green-700">Predicted 2.8 day average processing time</p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm font-medium text-yellow-800">Denial Risk Alert</p>
                  <p className="text-xs text-yellow-700">12 claims flagged for potential denial</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};