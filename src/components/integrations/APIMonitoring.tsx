
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3, 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Globe,
  RefreshCw
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface APIMetrics {
  endpoint: string;
  method: string;
  requests: number;
  successRate: number;
  avgResponseTime: number;
  errors: number;
  status: 'healthy' | 'warning' | 'critical';
}

interface APILog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userAgent?: string;
  ip?: string;
}

export const APIMonitoring: React.FC = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [metrics, setMetrics] = useState<APIMetrics[]>([
    {
      endpoint: '/api/appointments',
      method: 'GET',
      requests: 1250,
      successRate: 98.5,
      avgResponseTime: 145,
      errors: 19,
      status: 'healthy'
    },
    {
      endpoint: '/api/appointments',
      method: 'POST',
      requests: 340,
      successRate: 96.8,
      avgResponseTime: 280,
      errors: 11,
      status: 'healthy'
    },
    {
      endpoint: '/api/patients',
      method: 'GET',
      requests: 890,
      successRate: 99.2,
      avgResponseTime: 95,
      errors: 7,
      status: 'healthy'
    },
    {
      endpoint: '/api/webhooks/receive',
      method: 'POST',
      requests: 156,
      successRate: 87.2,
      avgResponseTime: 450,
      errors: 20,
      status: 'warning'
    }
  ]);

  const [recentLogs, setRecentLogs] = useState<APILog[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      endpoint: '/api/appointments',
      method: 'GET',
      statusCode: 200,
      responseTime: 120,
      ip: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      endpoint: '/api/patients',
      method: 'POST',
      statusCode: 201,
      responseTime: 350,
      ip: '192.168.1.105'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 900000).toISOString(),
      endpoint: '/api/webhooks/receive',
      method: 'POST',
      statusCode: 500,
      responseTime: 1200,
      ip: '192.168.1.102'
    }
  ]);

  // Sample data for charts
  const responseTimeData = [
    { time: '00:00', responseTime: 120 },
    { time: '04:00', responseTime: 98 },
    { time: '08:00', responseTime: 145 },
    { time: '12:00', responseTime: 200 },
    { time: '16:00', responseTime: 180 },
    { time: '20:00', responseTime: 95 },
  ];

  const requestVolumeData = [
    { hour: '00', requests: 45 },
    { hour: '04', requests: 20 },
    { hour: '08', requests: 120 },
    { hour: '12', requests: 200 },
    { hour: '16', requests: 180 },
    { hour: '20', requests: 85 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-700';
      case 'warning': return 'bg-yellow-100 text-yellow-700';
      case 'critical': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusCodeColor = (code: number) => {
    if (code >= 200 && code < 300) return 'text-green-600';
    if (code >= 400 && code < 500) return 'text-yellow-600';
    if (code >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  const totalRequests = metrics.reduce((sum, metric) => sum + metric.requests, 0);
  const avgSuccessRate = metrics.reduce((sum, metric) => sum + metric.successRate, 0) / metrics.length;
  const totalErrors = metrics.reduce((sum, metric) => sum + metric.errors, 0);
  const avgResponseTime = metrics.reduce((sum, metric) => sum + metric.avgResponseTime, 0) / metrics.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold">API Monitoring</h2>
            <p className="text-gray-600">Monitor API performance and usage metrics</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Requests</div>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">12% increase</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">0.3% increase</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{Math.round(avgResponseTime)}ms</div>
                <div className="text-sm text-gray-600">Avg Response Time</div>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">15ms faster</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{totalErrors}</div>
                <div className="text-sm text-gray-600">Total Errors</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex items-center mt-2 text-sm">
              <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600">5 fewer than yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
            <CardDescription>Average response time over the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="responseTime" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Request Volume</CardTitle>
            <CardDescription>Number of requests by hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Endpoint Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Endpoint Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric, index) => {
              const StatusIcon = getStatusIcon(metric.status);
              
              return (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {metric.method}
                        </Badge>
                        <span className="font-medium">{metric.endpoint}</span>
                        <Badge className={getStatusColor(metric.status)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {metric.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Requests:</span>
                          <div className="font-semibold">{metric.requests.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Success Rate:</span>
                          <div className="font-semibold">{metric.successRate}%</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Response:</span>
                          <div className="font-semibold">{metric.avgResponseTime}ms</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Errors:</span>
                          <div className="font-semibold text-red-600">{metric.errors}</div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Success Rate</span>
                          <span>{metric.successRate}%</span>
                        </div>
                        <Progress value={metric.successRate} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent API Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Recent API Calls</CardTitle>
          <CardDescription>Latest API requests and responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between py-2 border-b">
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {log.method}
                  </Badge>
                  <span className="font-medium">{log.endpoint}</span>
                  <span className={`font-semibold ${getStatusCodeColor(log.statusCode)}`}>
                    {log.statusCode}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>{log.responseTime}ms</span>
                  <span>{log.ip}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
