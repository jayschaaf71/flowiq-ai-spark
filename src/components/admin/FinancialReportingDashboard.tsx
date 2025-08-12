import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, TrendingDown, BarChart, PieChart, Download } from 'lucide-react';

export const FinancialReportingDashboard = () => {
  console.log('🔧 [FinancialReportingDashboard] Component rendered');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-muted-foreground">Comprehensive financial reporting and analysis</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$542,890</div>
            <p className="text-xs text-muted-foreground">
              +23.4% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$393,440</div>
            <p className="text-xs text-muted-foreground">
              +28.1% from last year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Costs</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$149,450</div>
            <p className="text-xs text-muted-foreground">
              -12.3% from last year
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
              +2.8% from last year
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Subscription Revenue</span>
              <Badge variant="default">$462,340</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>One-time Fees</span>
              <Badge variant="secondary">$45,230</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Add-on Services</span>
              <Badge variant="secondary">$35,320</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Revenue</span>
              <Badge variant="default">$542,890</Badge>
            </div>
            <Button className="w-full" variant="outline">
              <BarChart className="h-4 w-4 mr-2" />
              Revenue Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Cost Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Infrastructure</span>
              <Badge variant="default">$62,450</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Development</span>
              <Badge variant="secondary">$41,230</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Support</span>
              <Badge variant="secondary">$25,670</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Marketing</span>
              <Badge variant="secondary">$20,100</Badge>
            </div>
            <Button className="w-full" variant="outline">
              <PieChart className="h-4 w-4 mr-2" />
              Cost Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Revenue Growth</span>
              <Badge variant="default">+23.4%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Profit Growth</span>
              <Badge variant="default">+28.1%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Cost Reduction</span>
              <Badge variant="default">-12.3%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Customer Acquisition Cost</span>
              <Badge variant="secondary">$125</Badge>
            </div>
            <Button className="w-full" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              Growth Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Cash Flow</span>
              <Badge variant="default">Positive</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Runway</span>
              <Badge variant="default">18 months</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Burn Rate</span>
              <Badge variant="secondary">$12,450/month</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Break-even</span>
              <Badge variant="default">Achieved</Badge>
            </div>
            <Button className="w-full" variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Financial Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Report Downloads
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Monthly Revenue Report
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Cost Analysis Report
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Profit & Loss Statement
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Cash Flow Statement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};