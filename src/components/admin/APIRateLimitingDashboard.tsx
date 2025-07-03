import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Shield, 
  AlertTriangle, 
  Clock, 
  BarChart3, 
  Settings, 
  TrendingUp,
  Activity,
  Globe,
  Database,
  Code
} from 'lucide-react';

interface APIEndpoint {
  id: string;
  endpoint: string;
  method: string;
  currentRate: number;
  rateLimit: number;
  period: string;
  usage: number;
  violations: number;
  status: 'healthy' | 'warning' | 'critical';
  lastViolation?: string;
}

interface RateLimitRule {
  id: string;
  name: string;
  pattern: string;
  limit: number;
  period: 'minute' | 'hour' | 'day';
  scope: 'global' | 'tenant' | 'user';
  action: 'throttle' | 'block' | 'queue';
  enabled: boolean;
}

interface APIMetrics {
  totalRequests: number;
  rateLimitedRequests: number;
  uniqueClients: number;
  averageResponseTime: number;
  topEndpoints: { endpoint: string; requests: number }[];
  violationsByTenant: { tenant: string; violations: number }[];
}

export const APIRateLimitingDashboard: React.FC = () => {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([
    {
      id: '1',
      endpoint: '/api/appointments',
      method: 'GET',
      currentRate: 450,
      rateLimit: 1000,
      period: 'hour',
      usage: 45,
      violations: 2,
      status: 'healthy'
    },
    {
      id: '2',
      endpoint: '/api/patients',
      method: 'POST',
      currentRate: 120,
      rateLimit: 100,
      period: 'hour',
      usage: 120,
      violations: 8,
      status: 'critical',
      lastViolation: '2024-01-15 10:45'
    },
    {
      id: '3',
      endpoint: '/api/forms/submit',
      method: 'POST',
      currentRate: 850,
      rateLimit: 1500,
      period: 'hour',
      usage: 57,
      violations: 0,
      status: 'healthy'
    },
    {
      id: '4',
      endpoint: '/api/analytics',
      method: 'GET',
      currentRate: 280,
      rateLimit: 300,
      period: 'hour',
      usage: 93,
      violations: 5,
      status: 'warning',
      lastViolation: '2024-01-15 09:30'
    }
  ]);

  const [rateLimitRules, setRateLimitRules] = useState<RateLimitRule[]>([
    {
      id: '1',
      name: 'Global API Limit',
      pattern: '/api/*',
      limit: 10000,
      period: 'hour',
      scope: 'global',
      action: 'throttle',
      enabled: true
    },
    {
      id: '2',
      name: 'Patient Data Protection',
      pattern: '/api/patients/*',
      limit: 100,
      period: 'hour',
      scope: 'tenant',
      action: 'block',
      enabled: true
    },
    {
      id: '3',
      name: 'Form Submission Limit',
      pattern: '/api/forms/submit',
      limit: 50,
      period: 'hour',
      scope: 'user',
      action: 'queue',
      enabled: true
    },
    {
      id: '4',
      name: 'Analytics Rate Limit',
      pattern: '/api/analytics/*',
      limit: 500,
      period: 'hour',
      scope: 'tenant',
      action: 'throttle',
      enabled: true
    }
  ]);

  const [metrics] = useState<APIMetrics>({
    totalRequests: 125000,
    rateLimitedRequests: 1250,
    uniqueClients: 340,
    averageResponseTime: 145,
    topEndpoints: [
      { endpoint: '/api/appointments', requests: 45000 },
      { endpoint: '/api/patients', requests: 32000 },
      { endpoint: '/api/forms', requests: 28000 },
      { endpoint: '/api/analytics', requests: 20000 }
    ],
    violationsByTenant: [
      { tenant: 'Metro Chiropractic', violations: 15 },
      { tenant: 'Valley Sleep Center', violations: 8 },
      { tenant: 'Sunrise Dental', violations: 3 }
    ]
  });

  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isRealTimeEnabled) return;

    const interval = setInterval(() => {
      setEndpoints(prev => prev.map(endpoint => {
        const variance = Math.floor(Math.random() * 20) - 10;
        const newRate = Math.max(0, endpoint.currentRate + variance);
        const newUsage = Math.round((newRate / endpoint.rateLimit) * 100);
        
        let status: 'healthy' | 'warning' | 'critical' = 'healthy';
        if (newUsage >= 100) status = 'critical';
        else if (newUsage >= 80) status = 'warning';

        return {
          ...endpoint,
          currentRate: newRate,
          usage: newUsage,
          status
        };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [isRealTimeEnabled]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'warning':
        return <Badge variant="warning">Warning</Badge>;
      default:
        return <Badge variant="success">Healthy</Badge>;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'block':
        return <Badge variant="destructive">Block</Badge>;
      case 'throttle':
        return <Badge variant="warning">Throttle</Badge>;
      case 'queue':
        return <Badge variant="secondary">Queue</Badge>;
      default:
        return <Badge variant="outline">Allow</Badge>;
    }
  };

  const criticalEndpoints = endpoints.filter(e => e.status === 'critical');
  const violationRate = (metrics.rateLimitedRequests / metrics.totalRequests) * 100;

  return (
    <div className="space-y-6">
      {/* API Monitoring Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total API Requests</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.totalRequests/1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limited</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.rateLimitedRequests}</div>
            <p className="text-xs text-muted-foreground">{violationRate.toFixed(2)}% of requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.averageResponseTime}ms</div>
            <p className="text-xs text-success">+5ms from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.uniqueClients}</div>
            <p className="text-xs text-muted-foreground">Unique IP addresses</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalEndpoints.length > 0 && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Rate Limit Exceeded:</strong> {criticalEndpoints.length} endpoint(s) are over their rate limits.
            <Button variant="link" className="p-0 h-auto ml-2">
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="monitoring" className="space-y-6">
        <TabsList>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
          <TabsTrigger value="rules">Rate Limit Rules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Endpoint Monitoring</CardTitle>
                  <CardDescription>Real-time rate limiting status for all API endpoints</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isRealTimeEnabled}
                    onCheckedChange={setIsRealTimeEnabled}
                  />
                  <Label>Real-time</Label>
                  {isRealTimeEnabled && (
                    <div className="flex items-center gap-1">
                      <div className="h-2 w-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Live</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Current Rate</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Violations</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {endpoints.map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell className="font-mono text-sm">{endpoint.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{endpoint.method}</Badge>
                      </TableCell>
                      <TableCell>{endpoint.currentRate}</TableCell>
                      <TableCell>{endpoint.rateLimit}/{endpoint.period}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={endpoint.usage} 
                            className="w-16"
                            // @ts-ignore
                            variant={endpoint.status === 'critical' ? 'destructive' : endpoint.status === 'warning' ? 'warning' : 'default'}
                          />
                          <span className="text-sm">{endpoint.usage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{endpoint.violations}</TableCell>
                      <TableCell>{getStatusBadge(endpoint.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Rate Limiting Rules</CardTitle>
                  <CardDescription>Configure and manage API rate limiting policies</CardDescription>
                </div>
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Pattern</TableHead>
                    <TableHead>Limit</TableHead>
                    <TableHead>Scope</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateLimitRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell className="font-mono text-sm">{rule.pattern}</TableCell>
                      <TableCell>{rule.limit}/{rule.period}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.scope}</Badge>
                      </TableCell>
                      <TableCell>{getActionBadge(rule.action)}</TableCell>
                      <TableCell>
                        <Badge variant={rule.enabled ? 'success' : 'secondary'}>
                          {rule.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={(checked) => {
                              setRateLimitRules(prev => prev.map(r => 
                                r.id === rule.id ? { ...r, enabled: checked } : r
                              ));
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top API Endpoints</CardTitle>
                <CardDescription>Most frequently accessed endpoints</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.topEndpoints.map((endpoint, index) => (
                    <div key={endpoint.endpoint} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm">#{index + 1}</div>
                        <code className="text-sm">{endpoint.endpoint}</code>
                      </div>
                      <div className="text-sm font-medium">
                        {(endpoint.requests/1000).toFixed(0)}k requests
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rate Limit Violations by Tenant</CardTitle>
                <CardDescription>Tenants with the most violations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {metrics.violationsByTenant.map((item, index) => (
                    <div key={item.tenant} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="font-medium text-sm">#{index + 1}</div>
                        <div className="text-sm">{item.tenant}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-medium">{item.violations} violations</div>
                        <Badge variant={item.violations > 10 ? 'destructive' : 'warning'}>
                          {item.violations > 10 ? 'High' : 'Medium'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Global Rate Limiting Settings</CardTitle>
              <CardDescription>Configure platform-wide rate limiting behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Default Rate Limit</Label>
                    <Input type="number" defaultValue="1000" />
                    <p className="text-xs text-muted-foreground mt-1">Requests per hour</p>
                  </div>
                  <div>
                    <Label>Burst Limit</Label>
                    <Input type="number" defaultValue="100" />
                    <p className="text-xs text-muted-foreground mt-1">Peak requests per minute</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Rate Limiting</Label>
                      <p className="text-sm text-muted-foreground">Apply rate limits to all API endpoints</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto-scaling Response</Label>
                      <p className="text-sm text-muted-foreground">Automatically adjust limits based on load</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Alert Notifications</Label>
                      <p className="text-sm text-muted-foreground">Send alerts when limits are exceeded</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};