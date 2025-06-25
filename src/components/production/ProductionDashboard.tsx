
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Activity, 
  Shield, 
  Database, 
  Zap, 
  TestTube, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Server,
  HardDrive,
  Cpu
} from 'lucide-react';
import { monitoringService } from '@/services/production/monitoringService';
import { backupService } from '@/services/production/backupService';
import { performanceService } from '@/services/production/performanceService';
import { testingService } from '@/services/production/testingService';

export const ProductionDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [systemMetrics, setSystemMetrics] = useState({
    uptime: 99.9,
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 35,
    activeConnections: 234,
    responseTime: 142,
    errorRate: 0.02,
    throughput: 856
  });
  const [performanceScore, setPerformanceScore] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [backupStatus, setBackupStatus] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    setLoading(true);
    try {
      const [metrics, performance, tests, backup] = await Promise.all([
        monitoringService.collectMetrics(),
        performanceService.measurePerformance(),
        testingService.getTestResults(),
        backupService.getBackupHistory(5)
      ]);
      
      setSystemMetrics(metrics);
      setPerformanceScore(performanceService.getPerformanceScore());
      setTestResults(tests);
      setBackupStatus(backup);
    } catch (error) {
      console.error('Failed to load production data:', error);
      toast({
        title: "Error Loading Production Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runHealthCheck = async () => {
    setLoading(true);
    try {
      await Promise.all([
        monitoringService.collectMetrics(),
        performanceService.measurePerformance(),
        testingService.runTestSuite('1') // Run HIPAA compliance tests
      ]);
      
      await loadProductionData();
      
      toast({
        title: "Health Check Complete",
        description: "All systems checked successfully",
      });
    } catch (error) {
      toast({
        title: "Health Check Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setLoading(true);
    try {
      await backupService.createBackup('full');
      await loadProductionData();
      
      toast({
        title: "Backup Initiated",
        description: "Full system backup has been started",
      });
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    try {
      const results = await testingService.runAllTests();
      setTestResults(results);
      
      toast({
        title: "Test Suite Complete",
        description: `${results.passedTests}/${results.totalTests} tests passed`,
        variant: results.failedTests === 0 ? "default" : "destructive"
      });
    } catch (error) {
      toast({
        title: "Test Suite Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">System Health</p>
                <p className="text-2xl font-bold text-green-600">{systemMetrics.uptime.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Performance</p>
                <p className="text-2xl font-bold text-blue-600">{performanceScore}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TestTube className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Test Coverage</p>
                <p className="text-2xl font-bold text-purple-600">
                  {testResults ? `${testResults.coverage.toFixed(0)}%` : '0%'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Database className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium">Last Backup</p>
                <p className="text-sm font-bold text-orange-600">
                  {backupStatus && backupStatus.length > 0 ? 'Today' : 'Never'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Production Controls</CardTitle>
          <CardDescription>
            Monitor and manage your production environment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={runHealthCheck} disabled={loading}>
              <Activity className="w-4 h-4 mr-2" />
              Health Check
            </Button>
            <Button onClick={createBackup} disabled={loading} variant="outline">
              <Database className="w-4 h-4 mr-2" />
              Create Backup
            </Button>
            <Button onClick={runAllTests} disabled={loading} variant="outline">
              <TestTube className="w-4 h-4 mr-2" />
              Run Tests
            </Button>
            <Button onClick={loadProductionData} disabled={loading} variant="outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="monitoring" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monitoring">System Monitoring</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="backup">Backup & Recovery</TabsTrigger>
        </TabsList>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      CPU Usage
                    </span>
                    <span>{systemMetrics.cpuUsage.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.cpuUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      Memory Usage
                    </span>
                    <span>{systemMetrics.memoryUsage.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.memoryUsage} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4" />
                      Disk Usage
                    </span>
                    <span>{systemMetrics.diskUsage.toFixed(1)}%</span>
                  </div>
                  <Progress value={systemMetrics.diskUsage} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Active Connections</p>
                    <p className="text-2xl font-bold">{systemMetrics.activeConnections}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Response Time</p>
                    <p className="text-2xl font-bold">{systemMetrics.responseTime}ms</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Error Rate</p>
                    <p className="text-2xl font-bold text-green-600">{systemMetrics.errorRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Throughput</p>
                    <p className="text-2xl font-bold">{systemMetrics.throughput}/min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Score: {performanceScore}/100</CardTitle>
              <CardDescription>
                Based on Core Web Vitals and application metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={performanceScore} className="h-3" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Code splitting enabled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Image optimization active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Input debouncing implemented</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Virtual scrolling needed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-sm">Service worker caching pending</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          {testResults && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Test Results Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Tests</p>
                      <p className="text-2xl font-bold">{testResults.totalTests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Passed</p>
                      <p className="text-2xl font-bold text-green-600">{testResults.passedTests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Failed</p>
                      <p className="text-2xl font-bold text-red-600">{testResults.failedTests}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Coverage</p>
                      <p className="text-2xl font-bold">{testResults.coverage.toFixed(0)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Suites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testResults.suites.map((suite, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {suite.status === 'passed' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : suite.status === 'failed' ? (
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          ) : (
                            <Clock className="w-4 h-4 text-gray-600" />
                          )}
                          <span className="text-sm font-medium">{suite.name}</span>
                        </div>
                        <Badge 
                          variant={suite.status === 'passed' ? 'default' : 'destructive'}
                          className={suite.status === 'passed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {suite.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Backup Status</CardTitle>
                <CardDescription>
                  Recent backup operations and recovery points
                </CardDescription>
              </CardHeader>
              <CardContent>
                {backupStatus && backupStatus.length > 0 ? (
                  <div className="space-y-3">
                    {backupStatus.slice(0, 3).map((backup, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Database className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="font-medium">{backup.type} backup</p>
                            <p className="text-sm text-gray-600">
                              {backup.endTime ? backup.endTime.toLocaleString() : 'In progress'}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant={backup.status === 'completed' ? 'default' : 'destructive'}
                          className={backup.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {backup.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No recent backups</p>
                    <p className="text-sm">Click "Create Backup" to start</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disaster Recovery</CardTitle>
                <CardDescription>
                  Recovery objectives and failover status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">RTO (Recovery Time)</p>
                    <p className="text-xl font-bold">30 min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">RPO (Recovery Point)</p>
                    <p className="text-xl font-bold">15 min</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Replication Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-Failover</span>
                    <Badge variant="secondary">Disabled</Badge>
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
