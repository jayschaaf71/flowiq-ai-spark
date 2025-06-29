
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  TrendingUp,
  DollarSign,
  Target,
  Printer
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: string;
  lastGenerated: string;
  status: 'ready' | 'generating' | 'scheduled';
}

export const FinancialReporting: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reports: Report[] = [
    {
      id: '1',
      name: 'Monthly Revenue Report',
      description: 'Comprehensive monthly revenue analysis with KPIs',
      category: 'revenue',
      frequency: 'monthly',
      lastGenerated: '2024-01-20',
      status: 'ready'
    },
    {
      id: '2',
      name: 'Claims Aging Report',
      description: 'Outstanding claims analysis by aging buckets',
      category: 'claims',
      frequency: 'weekly',
      lastGenerated: '2024-01-18',
      status: 'ready'
    },
    {
      id: '3',
      name: 'Payer Performance Analysis',
      description: 'Collection rates and payment trends by payer',
      category: 'payer',
      frequency: 'monthly',
      lastGenerated: '2024-01-15',
      status: 'generating'
    },
    {
      id: '4',
      name: 'Denial Management Report',
      description: 'Denial patterns and correction recommendations',
      category: 'denials',
      frequency: 'weekly',
      lastGenerated: '2024-01-19',
      status: 'ready'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = reports.filter(report => 
    selectedCategory === 'all' || report.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-purple-600" />
        <div>
          <h2 className="text-2xl font-bold">Financial Reporting</h2>
          <p className="text-gray-600">Generate and manage financial reports</p>
        </div>
      </div>

      {/* Report Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Report Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('all')}
              size="sm"
            >
              All Reports
            </Button>
            <Button
              variant={selectedCategory === 'revenue' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('revenue')}
              size="sm"
            >
              Revenue
            </Button>
            <Button
              variant={selectedCategory === 'claims' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('claims')}
              size="sm"
            >
              Claims
            </Button>
            <Button
              variant={selectedCategory === 'payer' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('payer')}
              size="sm"
            >
              Payer Analysis
            </Button>
            <Button
              variant={selectedCategory === 'denials' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('denials')}
              size="sm"
            >
              Denials
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Generate and download financial reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{report.name}</h3>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline">
                        {report.frequency}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Category: {report.category}</span>
                      <span>Last Generated: {report.lastGenerated}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button size="sm" disabled={report.status === 'generating'}>
                      <Download className="h-4 w-4 mr-2" />
                      {report.status === 'generating' ? 'Generating...' : 'Download'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Revenue Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">MTD Collections</span>
                <span className="font-medium">$164,750</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">YTD Collections</span>
                <span className="font-medium">$1,847,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Collection Rate</span>
                <span className="font-medium">94.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Claims Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Clean Claim Rate</span>
                <span className="font-medium">92.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Avg Days in A/R</span>
                <span className="font-medium">18.2 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Denial Rate</span>
                <span className="font-medium">2.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Trends & Forecasts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Revenue Growth</span>
                <span className="font-medium text-green-600">+12.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Next Month Forecast</span>
                <span className="font-medium">$178,900</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Confidence</span>
                <span className="font-medium">87%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custom Report Builder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-600" />
            Custom Report Builder
          </CardTitle>
          <CardDescription>
            Create custom reports with specific metrics and filters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Available Metrics</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm">Total Collections</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm">Claims Submitted</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm">Denial Rate</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm">Days in A/R</label>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Filters</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm">Date Range</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm">Provider</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm">Payer</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <label className="text-sm">Service Type</label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button>
              Generate Custom Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
