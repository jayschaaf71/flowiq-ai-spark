import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets,
  Scale,
  Bluetooth,
  Wifi,
  Battery,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Smartphone,
  Watch,
  Stethoscope,
  Pill,
  Calendar,
  Bell,
  Download,
  Share
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface DeviceReading {
  id: string;
  deviceType: 'blood_pressure' | 'glucose' | 'weight' | 'heart_rate' | 'temperature' | 'oxygen_saturation';
  value: number | string;
  unit: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
  deviceName: string;
  batteryLevel?: number;
  connectionStatus: 'connected' | 'disconnected' | 'syncing';
}

interface MonitoringDevice {
  id: string;
  name: string;
  type: string;
  model: string;
  batteryLevel: number;
  connectionStatus: 'connected' | 'disconnected' | 'syncing';
  lastSync: Date;
  dataPoints: number;
  icon: any;
}

interface PatientGoal {
  id: string;
  type: string;
  target: number;
  current: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly';
  progress: number;
  achieved: boolean;
}

const RemoteMonitoring = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');

  const devices: MonitoringDevice[] = [
    {
      id: '1',
      name: 'Blood Pressure Monitor',
      type: 'blood_pressure',
      model: 'Omron HEM-7120',
      batteryLevel: 85,
      connectionStatus: 'connected',
      lastSync: new Date(Date.now() - 300000),
      dataPoints: 24,
      icon: Heart
    },
    {
      id: '2',
      name: 'Glucose Meter',
      type: 'glucose',
      model: 'FreeStyle Libre',
      batteryLevel: 42,
      connectionStatus: 'connected',
      lastSync: new Date(Date.now() - 900000),
      dataPoints: 8,
      icon: Droplets
    },
    {
      id: '3',
      name: 'Smart Scale',
      type: 'weight',
      model: 'Withings Body+',
      batteryLevel: 68,
      connectionStatus: 'syncing',
      lastSync: new Date(Date.now() - 1800000),
      dataPoints: 7,
      icon: Scale
    },
    {
      id: '4',
      name: 'Fitness Tracker',
      type: 'activity',
      model: 'Fitbit Charge 5',
      batteryLevel: 23,
      connectionStatus: 'connected',
      lastSync: new Date(Date.now() - 60000),
      dataPoints: 1440,
      icon: Activity
    }
  ];

  const latestReadings: DeviceReading[] = [
    {
      id: '1',
      deviceType: 'blood_pressure',
      value: '128/82',
      unit: 'mmHg',
      timestamp: new Date(Date.now() - 300000),
      status: 'warning',
      deviceName: 'Blood Pressure Monitor',
      batteryLevel: 85,
      connectionStatus: 'connected'
    },
    {
      id: '2',
      deviceType: 'glucose',
      value: 145,
      unit: 'mg/dL',
      timestamp: new Date(Date.now() - 900000),
      status: 'normal',
      deviceName: 'Glucose Meter',
      batteryLevel: 42,
      connectionStatus: 'connected'
    },
    {
      id: '3',
      deviceType: 'weight',
      value: 168.5,
      unit: 'lbs',
      timestamp: new Date(Date.now() - 1800000),
      status: 'normal',
      deviceName: 'Smart Scale',
      batteryLevel: 68,
      connectionStatus: 'syncing'
    },
    {
      id: '4',
      deviceType: 'heart_rate',
      value: 78,
      unit: 'bpm',
      timestamp: new Date(Date.now() - 60000),
      status: 'normal',
      deviceName: 'Fitness Tracker',
      batteryLevel: 23,
      connectionStatus: 'connected'
    },
    {
      id: '5',
      deviceType: 'oxygen_saturation',
      value: 98,
      unit: '%',
      timestamp: new Date(Date.now() - 120000),
      status: 'normal',
      deviceName: 'Pulse Oximeter',
      connectionStatus: 'connected'
    },
    {
      id: '6',
      deviceType: 'temperature',
      value: 98.6,
      unit: '°F',
      timestamp: new Date(Date.now() - 3600000),
      status: 'normal',
      deviceName: 'Smart Thermometer',
      connectionStatus: 'connected'
    }
  ];

  const goals: PatientGoal[] = [
    {
      id: '1',
      type: 'Blood Pressure',
      target: 120,
      current: 128,
      unit: 'mmHg systolic',
      period: 'daily',
      progress: 85,
      achieved: false
    },
    {
      id: '2',
      type: 'Weight Loss',
      target: 165,
      current: 168.5,
      unit: 'lbs',
      period: 'monthly',
      progress: 75,
      achieved: false
    },
    {
      id: '3',
      type: 'Daily Steps',
      target: 10000,
      current: 8750,
      unit: 'steps',
      period: 'daily',
      progress: 88,
      achieved: false
    },
    {
      id: '4',
      type: 'Glucose Level',
      target: 140,
      current: 145,
      unit: 'mg/dL',
      period: 'daily',
      progress: 92,
      achieved: true
    }
  ];

  // Sample chart data
  const heartRateData = [
    { time: '6:00', value: 65 },
    { time: '8:00', value: 72 },
    { time: '10:00', value: 68 },
    { time: '12:00', value: 75 },
    { time: '14:00', value: 82 },
    { time: '16:00', value: 78 },
    { time: '18:00', value: 74 },
    { time: '20:00', value: 69 },
  ];

  const bloodPressureData = [
    { time: 'Mon', systolic: 125, diastolic: 80 },
    { time: 'Tue', systolic: 132, diastolic: 85 },
    { time: 'Wed', systolic: 128, diastolic: 82 },
    { time: 'Thu', systolic: 124, diastolic: 78 },
    { time: 'Fri', systolic: 130, diastolic: 84 },
    { time: 'Sat', systolic: 126, diastolic: 81 },
    { time: 'Sun', systolic: 128, diastolic: 82 },
  ];

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return Heart;
      case 'glucose': return Droplets;
      case 'weight': return Scale;
      case 'heart_rate': return Activity;
      case 'temperature': return Thermometer;
      case 'oxygen_saturation': return Activity;
      default: return Activity;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-500';
      case 'syncing': return 'text-yellow-500';
      case 'disconnected': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Remote Patient Monitoring</h1>
          <p className="text-muted-foreground">Real-time health data from connected devices</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Devices</p>
                      <p className="text-2xl font-bold text-foreground">
                        {devices.filter(d => d.connectionStatus === 'connected').length}
                      </p>
                    </div>
                    <Bluetooth className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Today's Readings</p>
                      <p className="text-2xl font-bold text-foreground">24</p>
                    </div>
                    <Activity className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Alerts</p>
                      <p className="text-2xl font-bold text-foreground">2</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Goals Met</p>
                      <p className="text-2xl font-bold text-foreground">3/4</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Latest Readings */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Latest Readings
                </CardTitle>
                <CardDescription>Most recent data from your monitoring devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {latestReadings.map((reading) => {
                    const DeviceIcon = getDeviceIcon(reading.deviceType);
                    return (
                      <div key={reading.id} className="p-4 rounded-lg border bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <DeviceIcon className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground capitalize">
                              {reading.deviceType.replace('_', ' ')}
                            </span>
                          </div>
                          <Badge 
                            variant={reading.status === 'normal' ? 'default' : 
                                   reading.status === 'warning' ? 'secondary' : 'destructive'}
                          >
                            {reading.status}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-foreground">
                            {reading.value} <span className="text-sm font-normal">{reading.unit}</span>
                          </p>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{formatTimestamp(reading.timestamp)}</span>
                            <div className="flex items-center gap-1">
                              <Wifi className={`h-3 w-3 ${getConnectionStatusColor(reading.connectionStatus)}`} />
                              {reading.batteryLevel && (
                                <span>{reading.batteryLevel}%</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Heart Rate Today</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Blood Pressure This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={2} />
                      <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--secondary))" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Devices Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Connected Devices</h2>
              <Button>
                <Bluetooth className="mr-2 h-4 w-4" />
                Add Device
              </Button>
            </div>

            <div className="grid gap-6">
              {devices.map((device) => {
                const DeviceIcon = device.icon;
                return (
                  <Card key={device.id} className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <DeviceIcon className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">{device.model}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Last sync: {formatTimestamp(device.lastSync)}
                              </span>
                              <span>{device.dataPoints} data points today</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2 mb-2">
                              <Battery className="h-4 w-4" />
                              <Progress value={device.batteryLevel} className="w-16 h-2" />
                              <span className="text-xs">{device.batteryLevel}%</span>
                            </div>
                            <Badge 
                              variant={device.connectionStatus === 'connected' ? 'default' : 
                                     device.connectionStatus === 'syncing' ? 'secondary' : 'destructive'}
                            >
                              {device.connectionStatus}
                            </Badge>
                          </div>
                          
                          <Button variant="outline" size="sm">
                            Settings
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Health Trends</h2>
              <div className="flex gap-2">
                <Button 
                  variant={selectedTimeRange === 'today' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeRange('today')}
                >
                  Today
                </Button>
                <Button 
                  variant={selectedTimeRange === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeRange('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={selectedTimeRange === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeRange('month')}
                >
                  Month
                </Button>
              </div>
            </div>

            <div className="grid gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Heart Rate Trends</CardTitle>
                  <CardDescription>Average: 74 bpm | Range: 65-85 bpm</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={heartRateData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/0.2)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Blood Pressure Trends</CardTitle>
                  <CardDescription>Average: 128/82 mmHg</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bloodPressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={2} name="Systolic" />
                      <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--secondary))" strokeWidth={2} name="Diastolic" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Health Goals</h2>
              <Button>
                <Target className="mr-2 h-4 w-4" />
                Set New Goal
              </Button>
            </div>

            <div className="grid gap-4">
              {goals.map((goal) => (
                <Card key={goal.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{goal.type}</h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {goal.period} goal
                        </p>
                      </div>
                      {goal.achieved ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Achieved
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          In Progress
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-3" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Current: {goal.current} {goal.unit}</span>
                        <span>Target: {goal.target} {goal.unit}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RemoteMonitoring;