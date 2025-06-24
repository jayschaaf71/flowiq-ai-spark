
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevenueData } from "@/hooks/useRevenueData";
import { 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Target,
  BarChart3,
  PieChart
} from "lucide-react";

export const RevenueAnalytics = () => {
  const { metrics, payerPerformance, loading } = useRevenueData();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!metrics) return null;

  const revenueMetrics = [
    { 
      label: "Monthly Collections", 
      value: `$${metrics.total_collections.toLocaleString()}`, 
      change: "+18.2%", 
      trend: "up" 
    },
    { 
      label: "Days in A/R", 
      value: `${metrics.average_days_in_ar}`, 
      change: "-28 days", 
      trend: "up" 
    },
    { 
      label: "Collection Rate", 
      value: `${metrics.collection_rate}%`, 
      change: "+12.3%", 
      trend: "up" 
    },
    { 
      label: "Net Collection Rate", 
      value: `${(metrics.collection_rate * 0.965).toFixed(1)}%`, 
      change: "+8.7%", 
      trend: "up" 
    }
  ];

  const procedureAnalysis = [
    { procedure: "Routine Cleaning (D1110)", volume: 145, revenue: 18125, avg: 125 },
    { procedure: "Composite Filling (D2392)", volume: 89, revenue: 24025, avg: 270 },
    { procedure: "Crown Prep (D2740)", volume: 32, revenue: 28800, avg: 900 },
    { procedure: "Root Canal (D3320)", volume: 18, revenue: 21600, avg: 1200 }
  ];

  const forecastData = [
    { period: "Next Week", amount: 8320, confidence: 92 },
    { period: "Next Month", amount: 34500, confidence: 87 },
    { period: "Next Quarter", amount: 98750, confidence: 78 }
  ];

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3 text-green-600" />
                {metric.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payer Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Payer Performance
            </CardTitle>
            <CardDescription>Collection rates and payment timing by insurance provider</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payerPerformance.length > 0 ? (
                payerPerformance.slice(0, 4).map((payer, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full bg-blue-${500 + (index * 100)}`} />
                        <span className="font-medium text-sm">{payer.payer_name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">${payer.total_collected.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{payer.average_payment_days} days avg</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={payer.collection_rate} className="flex-1" />
                      <span className="text-sm font-medium w-12">{payer.collection_rate}%</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No payer performance data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Revenue Forecast
            </CardTitle>
            <CardDescription>AI-powered revenue predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecastData.map((forecast, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{forecast.period}</p>
                    <p className="text-2xl font-bold text-purple-600">
                      ${forecast.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="mb-2">
                      {forecast.confidence}% Confidence
                    </Badge>
                    <Progress value={forecast.confidence} className="w-20" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Procedure Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-green-600" />
            Procedure Revenue Analysis
          </CardTitle>
          <CardDescription>Revenue breakdown by procedure type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {procedureAnalysis.map((procedure, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{procedure.procedure}</p>
                  <p className="text-sm text-muted-foreground">{procedure.volume} procedures</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${procedure.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    ${procedure.avg} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trends and Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              Monthly Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">January 2024</span>
                <span className="font-medium">$134,250</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">February 2024</span>
                <span className="font-medium">${metrics.total_collections.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">March 2024 (Projected)</span>
                <span className="font-medium text-purple-600">$142,100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Clean claim rate improved by 12% this month
                </p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800">
                  Average payment time reduced by {Math.round(30 - metrics.average_days_in_ar)} days
                </p>
              </div>
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-800">
                  Revenue forecast shows 15% growth next quarter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
