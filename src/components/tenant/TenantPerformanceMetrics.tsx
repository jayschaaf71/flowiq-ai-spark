
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Activity, Database, Zap, Shield } from 'lucide-react';

export const TenantPerformanceMetrics: React.FC = () => {
  const performanceData = [
    {
      metric: 'System Uptime',
      value: 99.8,
      status: 'excellent',
      icon: Activity,
      color: 'text-green-600'
    },
    {
      metric: 'Database Performance',
      value: 95.2,
      status: 'good',
      icon: Database,
      color: 'text-blue-600'
    },
    {
      metric: 'API Response Time',
      value: 87.5,
      status: 'good',
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      metric: 'Security Score',
      value: 98.1,
      status: 'excellent',
      icon: Shield,
      color: 'text-green-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Performance</CardTitle>
        <CardDescription>
          Real-time performance metrics across all tenants
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {performanceData.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="font-medium">{item.metric}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.value}%</span>
                    <Badge variant="secondary" className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="font-medium mb-4">Additional Metrics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Error Rate</p>
              <p className="font-medium text-green-600">0.02%</p>
            </div>
            <div>
              <p className="text-gray-600">Avg Load Time</p>
              <p className="font-medium">142ms</p>
            </div>
            <div>
              <p className="text-gray-600">Active Sessions</p>
              <p className="font-medium">1,247</p>
            </div>
            <div>
              <p className="text-gray-600">Data Backup</p>
              <p className="font-medium text-green-600">Current</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
