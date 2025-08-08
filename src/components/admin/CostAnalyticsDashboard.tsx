import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, Calculator, BarChart, ExternalLink, Download } from 'lucide-react';

export const CostAnalyticsDashboard = () => {
  console.log('🔧 [CostAnalyticsDashboard] Component rendered');

  const handleRevenueReport = () => {
    console.log('🔧 [CostAnalyticsDashboard] Generating revenue report');
    alert('Generating detailed revenue report... (This would create a PDF report in production)');
  };

  const handleCostBreakdown = () => {
    console.log('🔧 [CostAnalyticsDashboard] Viewing cost breakdown');
    alert('Opening detailed cost breakdown... (This would show a detailed cost analysis in production)');
  };

  const handleExportData = (dataType: string) => {
    console.log('🔧 [CostAnalyticsDashboard] Exporting data:', dataType);
    alert(`Exporting ${dataType} data... (This would download a CSV/Excel file in production)`);
  };

  const handleFinancialReport = () => {
    console.log('🔧 [CostAnalyticsDashboard] Generating financial report');
    alert('Generating comprehensive financial report... (This would create a detailed financial analysis in production)');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cost Analytics</h1>
        <p className="text-muted-foreground">Platform cost analysis and financial insights</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Costs</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450</div>
            <p className="text-xs text-muted-foreground">
              -5.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$32,781</div>
            <p className="text-xs text-muted-foreground">
              +35.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72.5%</div>
            <p className="text-xs text-muted-foreground">
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Subscription Revenue</span>
              <Badge variant="default">$38,450</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>One-time Fees</span>
              <Badge variant="secondary">$4,231</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Add-on Services</span>
              <Badge variant="secondary">$2,550</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Revenue</span>
              <Badge variant="default">$45,231</Badge>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={handleRevenueReport}>
                <DollarSign className="h-4 w-4 mr-2" />
                Revenue Report
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleExportData('revenue')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Infrastructure Costs</span>
              <Badge variant="default">$6,200</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Development Costs</span>
              <Badge variant="secondary">$3,450</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Support & Operations</span>
              <Badge variant="secondary">$2,800</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Costs</span>
              <Badge variant="default">$12,450</Badge>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={handleCostBreakdown}>
                <Calculator className="h-4 w-4 mr-2" />
                Cost Analysis
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleExportData('costs')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Profit Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Gross Profit</span>
              <Badge variant="default">$32,781</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Profit Margin</span>
              <Badge variant="default">72.5%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Growth Rate</span>
              <Badge variant="secondary">+35.3%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Projected Annual</span>
              <Badge variant="secondary">$393,372</Badge>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={handleFinancialReport}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Financial Report
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleExportData('profit')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Key Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Customer Acquisition Cost</span>
              <Badge variant="default">$245</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Lifetime Value</span>
              <Badge variant="default">$2,450</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Churn Rate</span>
              <Badge variant="secondary">2.1%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Payback Period</span>
              <Badge variant="secondary">3.2 months</Badge>
            </div>
            <div className="flex space-x-2">
              <Button className="flex-1" variant="outline" onClick={() => handleExportData('metrics')}>
                <BarChart className="h-4 w-4 mr-2" />
                Metrics Report
              </Button>
              <Button className="flex-1" variant="outline" onClick={() => handleExportData('all')}>
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};