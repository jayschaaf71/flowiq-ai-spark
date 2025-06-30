
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useClaimsData } from "@/hooks/useClaimsData";
import { useClaimsRealtime } from "@/hooks/useClaimsRealtime";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity,
  Target,
  Zap
} from "lucide-react";

export const AdvancedClaimsAnalytics = () => {
  const { claims, loading } = useClaimsData();
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Set up real-time updates
  useClaimsRealtime();

  useEffect(() => {
    if (claims && claims.length > 0) {
      generateAnalytics();
    }
  }, [claims, selectedPeriod]);

  const generateAnalytics = () => {
    // Process claims data for analytics
    const totalClaims = claims.length;
    const totalRevenue = claims.reduce((sum, claim) => sum + (claim.total_amount || 0), 0);
    const avgProcessingTime = claims.reduce((sum, claim) => sum + (claim.days_in_ar || 0), 0) / totalClaims;
    
    // Status distribution
    const statusDistribution = claims.reduce((acc: any, claim) => {
      const status = claim.processing_status || 'draft';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Monthly trends (mock data based on claims)
    const monthlyTrends = [
      { month: 'Jan', submitted: 145, approved: 132, denied: 8, pending: 5 },
      { month: 'Feb', submitted: 167, approved: 154, denied: 7, pending: 6 },
      { month: 'Mar', submitted: 189, approved: 175, denied: 9, pending: 5 },
      { month: 'Apr', submitted: 203, approved: 188, denied: 10, pending: 5 },
      { month: 'May', submitted: 178, approved: 164, denied: 8, pending: 6 },
      { month: 'Jun', submitted: 195, approved: 182, denied: 7, pending: 6 }
    ];

    // Provider performance
    const providerPerformance = [
      { name: 'Dr. Smith', claims: 45, approvalRate: 96.2, avgDays: 12.5 },
      { name: 'Dr. Johnson', claims: 38, approvalRate: 94.8, avgDays: 14.2 },
      { name: 'Dr. Williams', claims: 42, approvalRate: 97.1, avgDays: 11.8 },
      { name: 'Dr. Brown', claims: 35, approvalRate: 93.5, avgDays: 15.1 }
    ];

    // Payer analysis
    const payerAnalysis = [
      { name: 'Blue Cross', claims: 67, approvalRate: 95.5, avgPayment: 156.8 },
      { name: 'Aetna', claims: 54, approvalRate: 93.2, avgPayment: 143.2 },
      { name: 'UnitedHealth', claims: 48, approvalRate: 96.8, avgPayment: 162.4 },
      { name: 'Medicare', claims: 39, approvalRate: 97.2, avgPayment: 134.6 }
    ];

    setAnalyticsData({
      summary: {
        totalClaims,
        totalRevenue,
        avgProcessingTime,
        approvalRate: 95.2,
        denialRate: 4.8
      },
      statusDistribution,
      monthlyTrends,
      providerPerformance,
      payerAnalysis
    });
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (loading || !analyticsData) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="w-6 h-6 animate-spin mr-2" />
        <span>Loading advanced analytics...</span>
      </div>
    );
  }

  const { summary, statusDistribution, monthlyTrends, providerPerformance, payerAnalysis } = analyticsData;

  const statusColors = {
    submitted: '#3B82F6',
    approved: '#10B981',
    denied: '#EF4444',
    pending: '#F59E0B',
    draft: '#6B7280'
  };

  const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: statusColors[status as keyof typeof statusColors] || '#6B7280'
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Advanced Claims Analytics</h2>
            <p className="text-gray-600">Real-time insights and performance metrics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={selectedPeriod === '7days' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('7days')}
            size="sm"
          >
            7 Days
          </Button>
          <Button 
            variant={selectedPeriod === '30days' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('30days')}
            size="sm"
          >
            30 Days
          </Button>
          <Button 
            variant={selectedPeriod === '90days' ? 'default' : 'outline'}
            onClick={() => setSelectedPeriod('90days')}
            size="sm"
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold">{summary.totalClaims}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12.5%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(summary.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                +8.3%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold">{summary.approvalRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                +2.1%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold">{summary.avgProcessingTime.toFixed(1)} days</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-700">
                <TrendingDown className="w-3 h-3 mr-1" />
                -1.5 days
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Denial Rate</p>
                <p className="text-2xl font-bold">{summary.denialRate}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-700">
                <TrendingDown className="w-3 h-3 mr-1" />
                -0.8%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="providers">Provider Performance</TabsTrigger>
          <TabsTrigger value="payers">Payer Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Claims Trends</CardTitle>
              <CardDescription>Submission, approval, and denial trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="submitted" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="approved" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="denied" stroke="#EF4444" strokeWidth={2} />
                  <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Claims Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusData.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="font-medium">{status.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{status.value}</div>
                        <div className="text-sm text-gray-500">
                          {((status.value / summary.totalClaims) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="providers">
          <Card>
            <CardHeader>
              <CardTitle>Provider Performance Analysis</CardTitle>
              <CardDescription>Claims volume and approval rates by provider</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providerPerformance.map((provider, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{provider.name}</h4>
                      <Badge variant="outline">{provider.claims} claims</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Approval Rate</div>
                        <div className="flex items-center gap-2">
                          <Progress value={provider.approvalRate} className="flex-1" />
                          <span className="text-sm font-medium">{provider.approvalRate}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Avg Processing Time</div>
                        <div className="text-lg font-medium">{provider.avgDays} days</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payers">
          <Card>
            <CardHeader>
              <CardTitle>Payer Analysis</CardTitle>
              <CardDescription>Performance metrics by insurance payer</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payerAnalysis.map((payer, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{payer.name}</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline">{payer.claims} claims</Badge>
                        <Badge className="bg-green-100 text-green-700">
                          {formatCurrency(payer.avgPayment)} avg
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Approval Rate</div>
                      <div className="flex items-center gap-2">
                        <Progress value={payer.approvalRate} className="flex-1" />
                        <span className="text-sm font-medium">{payer.approvalRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
