
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Wifi, 
  AlertTriangle, 
  CheckCircle,
  Activity,
  RefreshCw,
  Settings
} from "lucide-react";

export const SystemMonitoring = () => {
  const systemMetrics = {
    cpu: { usage: 45, status: "healthy" },
    memory: { usage: 62, status: "healthy" },
    storage: { usage: 78, status: "warning" },
    network: { status: "healthy", latency: "12ms" },
    uptime: "99.98%",
    lastUpdate: "30 seconds ago"
  };

  const alerts = [
    {
      id: 1,
      type: "warning",
      message: "Storage usage approaching 80% threshold",
      time: "5 minutes ago",
      component: "System Storage"
    },
    {
      id: 2,
      type: "info",
      message: "Billing iQ agent scheduled maintenance completed",
      time: "2 hours ago",
      component: "Billing iQ"
    }
  ];

  const agentHealth = [
    { name: "Schedule iQ", status: "healthy", uptime: "99.99%", responseTime: "245ms" },
    { name: "Intake iQ", status: "healthy", uptime: "99.95%", responseTime: "312ms" },
    { name: "Remind iQ", status: "healthy", uptime: "100%", responseTime: "189ms" },
    { name: "Billing iQ", status: "maintenance", uptime: "0%", responseTime: "N/A" },
    { name: "Claims iQ", status: "healthy", uptime: "99.92%", responseTime: "398ms" },
    { name: "Assist iQ", status: "healthy", uptime: "99.97%", responseTime: "267ms" },
    { name: "Scribe iQ", status: "warning", uptime: "98.45%", responseTime: "456ms" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "maintenance": return <Settings className="w-4 h-4 text-blue-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "maintenance": return "bg-blue-100 text-blue-800";
      default: return "bg-red-100 text-red-800";
    }
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 80) return "text-red-600";
    if (usage >= 60) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">System Monitoring</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Settings className="w-4 h-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUsageColor(systemMetrics.cpu.usage)}`}>
              {systemMetrics.cpu.usage}%
            </div>
            <Progress value={systemMetrics.cpu.usage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              System performance optimal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUsageColor(systemMetrics.memory.usage)}`}>
              {systemMetrics.memory.usage}%
            </div>
            <Progress value={systemMetrics.memory.usage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              16GB total available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUsageColor(systemMetrics.storage.usage)}`}>
              {systemMetrics.storage.usage}%
            </div>
            <Progress value={systemMetrics.storage.usage} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              500GB total capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {systemMetrics.network.latency}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Average latency
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              {systemMetrics.network.status}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Health Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agent Health Status</CardTitle>
            <CardDescription>Real-time monitoring of all AI agents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {agentHealth.map((agent, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(agent.status)}
                    <div>
                      <div className="font-medium text-sm">{agent.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Uptime: {agent.uptime} • Response: {agent.responseTime}
                      </div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(agent.status)}>
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Alerts</CardTitle>
            <CardDescription>Recent notifications and warnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      alert.type === "warning" ? "text-yellow-600" : "text-blue-600"
                    }`} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{alert.message}</div>
                      <div className="text-xs text-muted-foreground">
                        {alert.component} • {alert.time}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Dismiss
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="text-sm">No active alerts</div>
                  <div className="text-xs">All systems running normally</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm font-medium mb-2">System Uptime</div>
              <div className="text-2xl font-bold text-green-600">{systemMetrics.uptime}</div>
              <div className="text-xs text-muted-foreground">Since last restart</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Active Agents</div>
              <div className="text-2xl font-bold">6/7</div>
              <div className="text-xs text-muted-foreground">1 in maintenance</div>
            </div>
            <div>
              <div className="text-sm font-medium mb-2">Last Update</div>
              <div className="text-lg font-medium">{systemMetrics.lastUpdate}</div>
              <div className="text-xs text-muted-foreground">Auto-refresh enabled</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
