import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCostAnalytics } from '@/hooks/useCostAnalytics';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Users,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';

export const CostAnalyticsDashboard = () => {
  const {
    marginAnalysisData,
    costBreakdownData,
    featureROIData,
    recommendations,
    isLoading,
    updateRecommendation,
    generateSampleData
  } = useCostAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-20"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalRevenue = marginAnalysisData.reduce((sum, data) => sum + data.totalRevenue, 0);
  const totalCosts = marginAnalysisData.reduce((sum, data) => sum + data.totalCosts, 0);
  const averageMargin = marginAnalysisData.length > 0 
    ? marginAnalysisData.reduce((sum, data) => sum + data.marginPercentage, 0) / marginAnalysisData.length 
    : 0;
  const profitableTenants = marginAnalysisData.filter(data => data.profitabilityStatus === 'profitable' || data.profitabilityStatus === 'highly_profitable').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cost & Margin Analysis</h1>
          <p className="text-muted-foreground">Comprehensive insights into platform profitability and cost optimization</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateSampleData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate Sample Data
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Costs</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCosts.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageMargin.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Target: 25%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profitable Tenants</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profitableTenants}/{marginAnalysisData.length}</div>
            <p className="text-xs text-muted-foreground">{((profitableTenants / (marginAnalysisData.length || 1)) * 100).toFixed(1)}% of total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="margins" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="margins">Margin Analysis</TabsTrigger>
          <TabsTrigger value="costs">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="features">Feature ROI</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="margins" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Tenant Profitability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marginAnalysisData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{data.tenantName}</h4>
                        <p className="text-sm text-muted-foreground">
                          Revenue: ${data.totalRevenue.toLocaleString()} | Costs: ${data.totalCosts.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">{data.marginPercentage.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground">${data.grossMargin.toLocaleString()}</div>
                      </div>
                      <Badge variant={
                        data.profitabilityStatus === 'highly_profitable' ? 'default' :
                        data.profitabilityStatus === 'profitable' ? 'secondary' :
                        data.profitabilityStatus === 'break_even' ? 'outline' : 'destructive'
                      }>
                        {data.profitabilityStatus.replace('_', ' ')}
                      </Badge>
                      {data.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : data.trend === 'down' ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <div className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Cost Breakdown by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costBreakdownData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.trend > 0 ? '+' : ''}{item.trend.toFixed(1)}%
                        </span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={item.percentage} className="flex-1" />
                      <span className="text-sm text-muted-foreground w-12">
                        {item.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Feature ROI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {featureROIData.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{feature.featureName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.activeUsers} active users | {feature.usage} usage sessions
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{feature.roi.toFixed(1)}% ROI</div>
                      <div className="text-sm text-muted-foreground">
                        Revenue: ${feature.revenue.toLocaleString()} | Cost: ${feature.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Cost Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          rec.priority === 'critical' ? 'destructive' :
                          rec.priority === 'high' ? 'default' :
                          rec.priority === 'medium' ? 'secondary' : 'outline'
                        }>
                          {rec.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Potential Savings: ${rec.potential_savings.toLocaleString()}</span>
                        <span>Effort: {rec.implementation_effort}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateRecommendation({ id: rec.id, status: 'implementing' })}
                        >
                          Implement
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => updateRecommendation({ id: rec.id, status: 'dismissed' })}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No active recommendations at this time.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};