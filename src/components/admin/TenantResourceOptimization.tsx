import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Zap, 
  Users, 
  HardDrive,
  AlertCircle,
  CheckCircle,
  Settings,
  BarChart3
} from 'lucide-react';

interface TenantResourceUsage {
  tenantId: string;
  tenantName: string;
  subscription: string;
  users: number;
  storageGB: number;
  apiCalls: number;
  monthlyRevenue: number;
  costPerUser: number;
  utilizationScore: number;
  optimizationPotential: 'high' | 'medium' | 'low';
  recommendedActions: string[];
}

interface CostOptimization {
  category: string;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
  implementation: string;
}

export const TenantResourceOptimization: React.FC = () => {
  const [tenantUsage] = useState<TenantResourceUsage[]>([
    {
      tenantId: '1',
      tenantName: 'Sunrise Dental',
      subscription: 'Enterprise',
      users: 15,
      storageGB: 2.4,
      apiCalls: 12500,
      monthlyRevenue: 1200,
      costPerUser: 80,
      utilizationScore: 85,
      optimizationPotential: 'low',
      recommendedActions: ['Consider Pro plan upgrade for better value']
    },
    {
      tenantId: '2',
      tenantName: 'Metro Chiropractic',
      subscription: 'Pro',
      users: 8,
      storageGB: 4.1,
      apiCalls: 8500,
      monthlyRevenue: 450,
      costPerUser: 56.25,
      utilizationScore: 45,
      optimizationPotential: 'high',
      recommendedActions: [
        'Reduce storage usage by archiving old files',
        'Optimize API call patterns',
        'Consider downgrading to Standard plan'
      ]
    },
    {
      tenantId: '3',
      tenantName: 'Valley Sleep Center',
      subscription: 'Enterprise',
      users: 25,
      storageGB: 1.8,
      apiCalls: 18900,
      monthlyRevenue: 2100,
      costPerUser: 84,
      utilizationScore: 92,
      optimizationPotential: 'low',
      recommendedActions: ['Excellent utilization - maintain current plan']
    },
    {
      tenantId: '4',
      tenantName: 'Riverside Wellness',
      subscription: 'Standard',
      users: 5,
      storageGB: 0.8,
      apiCalls: 3200,
      monthlyRevenue: 180,
      costPerUser: 36,
      utilizationScore: 72,
      optimizationPotential: 'medium',
      recommendedActions: [
        'Good utilization for Standard plan',
        'Monitor growth for potential upgrade'
      ]
    }
  ]);

  const [optimizations] = useState<CostOptimization[]>([
    {
      category: 'Storage Optimization',
      currentCost: 2400,
      optimizedCost: 1800,
      savings: 600,
      impact: 'high',
      description: 'Implement automated archiving for files older than 2 years',
      implementation: 'Deploy archive policies across all tenants'
    },
    {
      category: 'API Rate Limiting',
      currentCost: 1200,
      optimizedCost: 900,
      savings: 300,
      impact: 'medium',
      description: 'Optimize API call patterns and implement intelligent caching',
      implementation: 'Update API gateway with new rate limiting rules'
    },
    {
      category: 'Compute Resources',
      currentCost: 3600,
      optimizedCost: 3100,
      savings: 500,
      impact: 'medium',
      description: 'Auto-scaling optimization during off-peak hours',
      implementation: 'Deploy dynamic scaling policies'
    },
    {
      category: 'Database Optimization',
      currentCost: 1800,
      optimizedCost: 1400,
      savings: 400,
      impact: 'high',
      description: 'Query optimization and index tuning',
      implementation: 'Run database optimization scripts'
    }
  ]);

  const totalCurrentCost = optimizations.reduce((sum, opt) => sum + opt.currentCost, 0);
  const totalOptimizedCost = optimizations.reduce((sum, opt) => sum + opt.optimizedCost, 0);
  const totalSavings = totalCurrentCost - totalOptimizedCost;
  const savingsPercentage = (totalSavings / totalCurrentCost) * 100;

  const getOptimizationBadge = (potential: string) => {
    switch (potential) {
      case 'high':
        return <Badge variant="destructive">High Potential</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium Potential</Badge>;
      default:
        return <Badge variant="success">Optimized</Badge>;
    }
  };

  const getUtilizationColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'destructive';
  };

  return (
    <div className="space-y-6">
      {/* Cost Optimization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalCurrentCost/1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">Across all infrastructure</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Potential Savings</CardTitle>
            <TrendingDown className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">${(totalSavings/1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">{savingsPercentage.toFixed(1)}% reduction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimized Cost</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalOptimizedCost/1000).toFixed(1)}k</div>
            <p className="text-xs text-success">After optimizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROI Timeline</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 months</div>
            <p className="text-xs text-muted-foreground">To break even</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tenants" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tenants">Tenant Analysis</TabsTrigger>
          <TabsTrigger value="optimizations">Cost Optimizations</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="tenants" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tenant Resource Utilization</CardTitle>
              <CardDescription>
                Analyze resource usage patterns and optimization opportunities per tenant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Storage</TableHead>
                    <TableHead>API Calls</TableHead>
                    <TableHead>Cost/User</TableHead>
                    <TableHead>Utilization</TableHead>
                    <TableHead>Optimization</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tenantUsage.map((tenant) => (
                    <TableRow key={tenant.tenantId}>
                      <TableCell className="font-medium">{tenant.tenantName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{tenant.subscription}</Badge>
                      </TableCell>
                      <TableCell>{tenant.users}</TableCell>
                      <TableCell>{tenant.storageGB} GB</TableCell>
                      <TableCell>{tenant.apiCalls.toLocaleString()}</TableCell>
                      <TableCell>${tenant.costPerUser}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={tenant.utilizationScore} 
                            className="w-16"
                            // @ts-ignore
                            variant={getUtilizationColor(tenant.utilizationScore)}
                          />
                          <span className="text-sm">{tenant.utilizationScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{getOptimizationBadge(tenant.optimizationPotential)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Infrastructure Cost Optimizations</CardTitle>
              <CardDescription>
                Identified opportunities to reduce operational costs while maintaining performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizations.map((opt, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{opt.category}</h4>
                        <Badge 
                          variant={opt.impact === 'high' ? 'destructive' : opt.impact === 'medium' ? 'warning' : 'secondary'}
                        >
                          {opt.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{opt.description}</p>
                      <p className="text-xs text-muted-foreground">{opt.implementation}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">
                        ${opt.savings.toLocaleString()}/mo
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${opt.currentCost.toLocaleString()} → ${opt.optimizedCost.toLocaleString()}
                      </div>
                      <Button size="sm" className="mt-2">
                        Apply Optimization
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  High Priority Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-success mt-1" />
                    <div>
                      <p className="font-medium">Implement Storage Archiving</p>
                      <p className="text-sm text-muted-foreground">Save $600/month with automated archiving policies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-success mt-1" />
                    <div>
                      <p className="font-medium">Optimize Database Queries</p>
                      <p className="text-sm text-muted-foreground">Reduce database costs by 22% with query optimization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-warning mt-1" />
                    <div>
                      <p className="font-medium">Review Metro Chiropractic Usage</p>
                      <p className="text-sm text-muted-foreground">45% utilization suggests plan optimization needed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Automated Optimizations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-scaling Policies</p>
                      <p className="text-sm text-muted-foreground">Dynamic resource allocation</p>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Storage Cleanup</p>
                      <p className="text-sm text-muted-foreground">Automated file archiving</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">API Rate Optimization</p>
                      <p className="text-sm text-muted-foreground">Intelligent request batching</p>
                    </div>
                    <Badge variant="secondary">Configuration</Badge>
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