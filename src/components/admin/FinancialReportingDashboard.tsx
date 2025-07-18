import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCostAnalytics } from '@/hooks/useCostAnalytics';
import { 
  FileText, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Users,
  AlertCircle,
  Target
} from 'lucide-react';

export const FinancialReportingDashboard = () => {
  const [reportType, setReportType] = useState('monthly');
  const [selectedPeriod, setSelectedPeriod] = useState<Date | undefined>(new Date());
  
  const {
    marginAnalysisData,
    costBreakdownData,
    featureROIData,
    isLoading
  } = useCostAnalytics();

  const generateReport = () => {
    // Implementation for generating and downloading reports
    console.log('Generating report:', { reportType, selectedPeriod });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Calculate key financial metrics
  const totalRevenue = marginAnalysisData.reduce((sum, data) => sum + data.totalRevenue, 0);
  const totalCosts = marginAnalysisData.reduce((sum, data) => sum + data.totalCosts, 0);
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
  
  const highRiskTenants = marginAnalysisData.filter(data => data.churnRiskScore > 70).length;
  const topPerformingFeatures = featureROIData
    .sort((a, b) => b.roi - a.roi)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Reporting</h1>
          <p className="text-muted-foreground">Generate comprehensive financial reports and forecasts</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly Report</SelectItem>
              <SelectItem value="quarterly">Quarterly Report</SelectItem>
              <SelectItem value="annual">Annual Report</SelectItem>
              <SelectItem value="custom">Custom Period</SelectItem>
            </SelectContent>
          </Select>
          <DatePicker
            selected={selectedPeriod}
            onSelect={setSelectedPeriod}
          />
          <Button onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+12.5%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">${totalCosts.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Costs</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                <span className="text-sm text-red-600">+8.2%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">${netProfit.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Net Profit</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+18.7%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{profitMargin.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Profit Margin</div>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">+4.2%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Key Performance Indicators */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Revenue Growth Rate</span>
                <span className="text-sm">12.5%</span>
              </div>
              <Progress value={62.5} className="h-2" />
              <div className="text-xs text-muted-foreground">Target: 20%</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Customer Acquisition Cost</span>
                <span className="text-sm">$450</span>
              </div>
              <Progress value={75} className="h-2" />
              <div className="text-xs text-muted-foreground">Target: $350</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Average Revenue Per User</span>
                <span className="text-sm">$320</span>
              </div>
              <Progress value={80} className="h-2" />
              <div className="text-xs text-muted-foreground">Target: $400</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Churn Rate</span>
                <span className="text-sm">3.2%</span>
              </div>
              <Progress value={32} className="h-2" />
              <div className="text-xs text-muted-foreground">Target: &lt;5%</div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">High Churn Risk Tenants</div>
                <div className="text-sm text-muted-foreground">{highRiskTenants} tenants at risk</div>
              </div>
              <Badge variant="destructive">{highRiskTenants}</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Cost Inflation Rate</div>
                <div className="text-sm text-muted-foreground">Infrastructure costs trending up</div>
              </div>
              <Badge variant="secondary">8.2%</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Market Competition</div>
                <div className="text-sm text-muted-foreground">3 new competitors identified</div>
              </div>
              <Badge variant="outline">Medium</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">Regulatory Changes</div>
                <div className="text-sm text-muted-foreground">HIPAA compliance updates pending</div>
              </div>
              <Badge variant="outline">Low</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Top Performing Features by ROI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformingFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium">{index + 1}</span>
                  </div>
                  <div>
                    <div className="font-medium">{feature.featureName}</div>
                    <div className="text-sm text-muted-foreground">
                      {feature.activeUsers} users | {feature.usage} sessions
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-green-600">{feature.roi.toFixed(1)}% ROI</div>
                  <div className="text-sm text-muted-foreground">
                    ${(feature.revenue - feature.cost).toLocaleString()} profit
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Revenue Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Revenue Forecast (Next 12 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">$2.1M</div>
              <div className="text-sm text-muted-foreground">Conservative Estimate</div>
              <div className="text-xs text-green-600 mt-1">85% confidence</div>
            </div>
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold">$2.4M</div>
              <div className="text-sm text-muted-foreground">Most Likely Scenario</div>
              <div className="text-xs text-green-600 mt-1">70% confidence</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold">$2.8M</div>
              <div className="text-sm text-muted-foreground">Optimistic Estimate</div>
              <div className="text-xs text-green-600 mt-1">45% confidence</div>
            </div>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Forecast based on current growth trends, market conditions, and planned feature releases.
              Assumptions include 15% customer growth, 8% pricing increase, and successful launch of 2 major features.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};