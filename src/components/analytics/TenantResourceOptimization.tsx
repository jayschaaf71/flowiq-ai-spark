
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Server, Database, Zap, AlertTriangle } from 'lucide-react';

interface ResourceMetric {
  name: string;
  current: number;
  limit: number;
  usage: number;
  trend: 'up' | 'down' | 'stable';
  recommendation?: string;
  severity: 'low' | 'medium' | 'high';
}

interface OptimizationRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
  category: 'performance' | 'cost' | 'security' | 'reliability';
  estimatedSavings?: string;
}

export const TenantResourceOptimization: React.FC = () => {
  const [metrics, setMetrics] = useState<ResourceMetric[]>([]);
  const [recommendations, setRecommendations] = useState<OptimizationRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptimizationData();
  }, []);

  const loadOptimizationData = async () => {
    setLoading(true);
    try {
      // Simulate loading data - in real implementation, this would come from Supabase
      // @ts-expect-error - Simulated data for demonstration purposes
      const mockMetrics: ResourceMetric[] = [
        {
          name: 'CPU Usage',
          current: 75,
          limit: 100,
          usage: 75,
          trend: 'up',
          recommendation: 'Consider upgrading to a higher tier',
          severity: 'medium'
        },
        {
          name: 'Memory Usage',
          current: 60,
          limit: 100,
          usage: 60,
          trend: 'stable',
          severity: 'low'
        },
        {
          name: 'Storage Usage',
          current: 85,
          limit: 100,
          usage: 85,
          trend: 'up',
          recommendation: 'Archive old data or upgrade storage',
          severity: 'high'
        },
        {
          name: 'API Calls',
          current: 8500,
          limit: 10000,
          usage: 85,
          trend: 'up',
          recommendation: 'Monitor for API rate limiting',
          severity: 'medium'
        }
      ];

      // @ts-expect-error - Simulated data for demonstration purposes  
      const mockRecommendations: OptimizationRecommendation[] = [
        {
          id: '1',
          title: 'Optimize Database Queries',
          description: 'Several queries are taking longer than expected. Consider adding indexes and optimizing complex joins.',
          impact: 'high',
          effort: 'medium',
          category: 'performance',
          estimatedSavings: '20% faster response times'
        },
        {
          id: '2',
          title: 'Implement Data Archiving',
          description: 'Archive data older than 2 years to reduce storage costs and improve query performance.',
          impact: 'medium',
          effort: 'low',
          category: 'cost',
          estimatedSavings: '$150/month storage costs'
        },
        {
          id: '3',
          title: 'Enable Response Caching',
          description: 'Cache frequently accessed API responses to reduce database load and improve user experience.',
          impact: 'medium',
          effort: 'medium',
          category: 'performance',
          estimatedSavings: '30% reduction in API response time'
        }
      ];

      setMetrics(mockMetrics);
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error loading optimization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUsageColor = (usage: number, severity: string) => {
    if (severity === 'high' || usage > 80) return '#ef4444';
    if (severity === 'medium' || usage > 60) return '#f59e0b';
    return '#10b981';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return <Zap className="h-4 w-4" />;
      case 'cost': return <TrendingDown className="h-4 w-4" />;
      case 'security': return <AlertTriangle className="h-4 w-4" />;
      case 'reliability': return <Server className="h-4 w-4" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resource Optimization</CardTitle>
          <CardDescription>Loading optimization analysis...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resource Usage Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Resource Usage Overview
          </CardTitle>
          <CardDescription>
            Current resource utilization and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{metric.name}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {metric.current}{metric.name === 'API Calls' ? '' : '%'}
                    </span>
                    <Badge variant={metric.severity === 'high' ? 'destructive' : metric.severity === 'medium' ? 'default' : 'secondary'}>
                      {metric.severity}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={metric.usage} 
                  className="h-2"
                  style={{ '--progress-background': getUsageColor(metric.usage, metric.severity) } as React.CSSProperties}
                />
                {metric.recommendation && (
                  <p className="text-sm text-muted-foreground">{metric.recommendation}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Usage Chart</CardTitle>
          <CardDescription>Visual representation of current resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                  {metrics.map((metric, index) => (
                    <Cell key={index} fill={getUsageColor(metric.usage, metric.severity)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Optimization Recommendations
          </CardTitle>
          <CardDescription>
            Suggested improvements to enhance performance and reduce costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(rec.category)}
                    <h3 className="font-medium">{rec.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getImpactColor(rec.impact) as "default" | "destructive" | "outline" | "secondary"}>
                      {rec.impact} impact
                    </Badge>
                    <Badge variant="outline">
                      {rec.effort} effort
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{rec.description}</p>
                {rec.estimatedSavings && (
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-green-600">Estimated savings: {rec.estimatedSavings}</span>
                  </div>
                )}
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    Implement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health Alert */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Your storage usage is approaching the limit. Consider implementing the data archiving recommendation to prevent service interruption.
        </AlertDescription>
      </Alert>
    </div>
  );
};
