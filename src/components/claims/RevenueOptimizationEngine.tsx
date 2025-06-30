
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  DollarSign, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Brain,
  Lightbulb,
  Calendar,
  Clock
} from "lucide-react";

interface RevenueOpportunity {
  id: string;
  title: string;
  description: string;
  potentialRevenue: number;
  priority: 'high' | 'medium' | 'low';
  category: 'coding' | 'billing' | 'collections' | 'authorization';
  status: 'active' | 'implemented' | 'dismissed';
  estimatedImpact: number;
  timeToImplement: string;
  actionItems: string[];
}

interface RevenueMetrics {
  totalRevenue: number;
  previousPeriod: number;
  growthRate: number;
  optimizationOpportunities: number;
  potentialAdditionalRevenue: number;
  collectionRate: number;
  denialRate: number;
  avgDaysInAR: number;
}

export const RevenueOptimizationEngine = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [opportunities, setOpportunities] = useState<RevenueOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadOptimizationData();
  }, []);

  const loadOptimizationData = async () => {
    try {
      setLoading(true);
      
      // Mock revenue metrics
      const mockMetrics: RevenueMetrics = {
        totalRevenue: 485000,
        previousPeriod: 432000,
        growthRate: 12.3,
        optimizationOpportunities: 15,
        potentialAdditionalRevenue: 85000,
        collectionRate: 94.2,
        denialRate: 5.8,
        avgDaysInAR: 18.5
      };

      // Mock optimization opportunities
      const mockOpportunities: RevenueOpportunity[] = [
        {
          id: '1',
          title: 'Optimize Coding for Chronic Care Management',
          description: 'Implement CCM billing codes for eligible patients to increase revenue',
          potentialRevenue: 28000,
          priority: 'high',
          category: 'coding',
          status: 'active',
          estimatedImpact: 15.2,
          timeToImplement: '2-3 weeks',
          actionItems: [
            'Identify eligible patients',
            'Train staff on CCM documentation',
            'Implement billing workflow'
          ]
        },
        {
          id: '2',
          title: 'Reduce Denial Rate Through Pre-Authorization',
          description: 'Implement automated pre-authorization checks to reduce denials',
          potentialRevenue: 22000,
          priority: 'high',
          category: 'authorization',
          status: 'active',
          estimatedImpact: 12.8,
          timeToImplement: '1-2 weeks',
          actionItems: [
            'Set up automated eligibility verification',
            'Configure pre-auth workflows',
            'Train staff on new process'
          ]
        },
        {
          id: '3',
          title: 'Optimize Collections Process',
          description: 'Implement automated follow-up for overdue accounts',
          potentialRevenue: 18500,
          priority: 'medium',
          category: 'collections',
          status: 'active',
          estimatedImpact: 8.5,
          timeToImplement: '3-4 weeks',
          actionItems: [
            'Set up automated reminder system',
            'Create collection workflows',
            'Implement payment plans'
          ]
        },
        {
          id: '4',
          title: 'Improve Charge Capture',
          description: 'Implement real-time charge capture to reduce missed charges',
          potentialRevenue: 16000,
          priority: 'medium',
          category: 'billing',
          status: 'active',
          estimatedImpact: 7.2,
          timeToImplement: '2-3 weeks',
          actionItems: [
            'Audit current charge capture',
            'Implement mobile charge entry',
            'Train providers on documentation'
          ]
        }
      ];

      setMetrics(mockMetrics);
      setOpportunities(mockOpportunities);
    } catch (error) {
      console.error('Error loading optimization data:', error);
      toast({
        title: "Error Loading Data",
        description: "Unable to load revenue optimization data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const implementOpportunity = async (opportunityId: string) => {
    try {
      const opportunity = opportunities.find(o => o.id === opportunityId);
      if (!opportunity) return;

      // Update opportunity status
      setOpportunities(prev => 
        prev.map(o => 
          o.id === opportunityId 
            ? { ...o, status: 'implemented' as const }
            : o
        )
      );

      toast({
        title: "Opportunity Implemented",
        description: `Started implementation of: ${opportunity.title}`,
      });
    } catch (error) {
      toast({
        title: "Implementation Error",
        description: "Failed to implement opportunity",
        variant: "destructive"
      });
    }
  };

  const dismissOpportunity = (opportunityId: string) => {
    setOpportunities(prev => 
      prev.map(o => 
        o.id === opportunityId 
          ? { ...o, status: 'dismissed' as const }
          : o
      )
    );
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'coding': return <Brain className="w-4 h-4" />;
      case 'billing': return <DollarSign className="w-4 h-4" />;
      case 'collections': return <Target className="w-4 h-4" />;
      case 'authorization': return <CheckCircle className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Clock className="w-6 h-6 animate-spin mr-2" />
        <span>Loading revenue optimization engine...</span>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-orange-500" />
        <p>Unable to load revenue optimization data</p>
      </div>
    );
  }

  const revenueData = [
    { month: 'Jan', revenue: 385000, optimized: 408000 },
    { month: 'Feb', revenue: 420000, optimized: 445000 },
    { month: 'Mar', revenue: 465000, optimized: 495000 },
    { month: 'Apr', revenue: 485000, optimized: 520000 },
    { month: 'May', revenue: 492000, optimized: 535000 },
    { month: 'Jun', revenue: 485000, optimized: 570000 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-8 w-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold">Revenue Optimization Engine</h2>
            <p className="text-gray-600">AI-powered revenue maximization with actionable insights</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-green-100 text-green-700">
            <Brain className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <Button variant="outline" onClick={loadOptimizationData}>
            <Target className="w-4 h-4 mr-2" />
            Refresh Analysis
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{metrics.growthRate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Potential Revenue</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.potentialAdditionalRevenue)}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-blue-100 text-blue-700">
                {metrics.optimizationOpportunities} opportunities
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Collection Rate</p>
                <p className="text-2xl font-bold">{metrics.collectionRate}%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="mt-2">
              <Progress value={metrics.collectionRate} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Days in A/R</p>
                <p className="text-2xl font-bold">{metrics.avgDaysInAR}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <div className="mt-2">
              <Badge className="bg-orange-100 text-orange-700">
                Industry avg: 25 days
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="trends">Revenue Trends</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Potential</CardTitle>
                <CardDescription>Current revenue compared to optimized potential</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Bar dataKey="revenue" fill="#3B82F6" name="Current Revenue" />
                    <Bar dataKey="optimized" fill="#10B981" name="Optimized Potential" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Impact</CardTitle>
                <CardDescription>Potential revenue increase by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-600" />
                      <span>Coding Optimization</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(28000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Pre-Authorization</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(22000)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-orange-600" />
                      <span>Collections</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(18500)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-purple-600" />
                      <span>Charge Capture</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(16000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities">
          <div className="space-y-4">
            {opportunities.filter(o => o.status === 'active').map((opportunity) => (
              <Card key={opportunity.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(opportunity.category)}
                      <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getPriorityColor(opportunity.priority)}>
                        {opportunity.priority} priority
                      </Badge>
                      <Badge variant="outline">
                        {formatCurrency(opportunity.potentialRevenue)}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Estimated Impact</p>
                      <p className="font-semibold">{opportunity.estimatedImpact}% increase</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time to Implement</p>
                      <p className="font-semibold">{opportunity.timeToImplement}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Category</p>
                      <p className="font-semibold capitalize">{opportunity.category}</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-600 mb-2">Action Items:</p>
                    <ul className="space-y-1">
                      {opportunity.actionItems.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => implementOpportunity(opportunity.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Implement
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => dismissOpportunity(opportunity.id)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Growth Trends</CardTitle>
              <CardDescription>Historical and projected revenue with optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    name="Current Revenue"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="optimized" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Optimized Potential"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  AI-Powered Recommendations
                </CardTitle>
                <CardDescription>
                  Based on your practice patterns and industry benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-900">High-Impact Opportunity</h4>
                    <p className="text-blue-800 mt-1">
                      Implementing CCM billing could increase your revenue by 15-20% within 3 months. 
                      Your patient population shows high eligibility for chronic care management services.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-semibold text-green-900">Quick Win</h4>
                    <p className="text-green-800 mt-1">
                      Automated pre-authorization checking can reduce your denial rate from 5.8% to 3.2%, 
                      saving approximately $22,000 in lost revenue annually.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-semibold text-orange-900">Process Improvement</h4>
                    <p className="text-orange-800 mt-1">
                      Your average days in A/R (18.5 days) is better than industry average. 
                      Focus on optimizing charge capture to maximize this advantage.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
