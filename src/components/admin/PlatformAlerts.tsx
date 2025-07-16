import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Bell, Check, X, Loader } from 'lucide-react';
import { usePlatformMetrics } from '@/hooks/usePlatformMetrics';
import { formatDistanceToNow } from 'date-fns';

export const PlatformAlerts = () => {
  const { 
    alerts, 
    resolveAlert, 
    acknowledgeAlert, 
    isResolvingAlert, 
    isAcknowledgingAlert 
  } = usePlatformMetrics();

  if (!alerts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader className="h-6 w-6 animate-spin" />
          <span>Loading alerts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alert Management</h1>
        <p className="text-muted-foreground">Monitor and manage platform alerts and notifications</p>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Bell className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {alerts.filter(a => a.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {alerts.filter(a => a.severity === 'critical' && a.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {alerts.filter(a => a.status === 'resolved' && new Date(a.created_at) >= new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3m</div>
            <p className="text-xs text-muted-foreground">Average response</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-red-500' : 
                    alert.severity === 'high' ? 'text-orange-500' : 
                    alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    alert.severity === 'critical' ? 'destructive' : 
                    alert.severity === 'high' ? 'secondary' : 'outline'
                  }>
                    {alert.severity}
                  </Badge>
                  {alert.status === 'resolved' ? (
                    <Badge variant="default">
                      <Check className="h-3 w-3 mr-1" />
                      Resolved
                    </Badge>
                  ) : alert.status === 'acknowledged' ? (
                    <div className="flex space-x-1">
                      <Badge variant="secondary">Acknowledged</Badge>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => resolveAlert(alert.id)}
                        disabled={isResolvingAlert}
                      >
                        {isResolvingAlert ? (
                          <Loader className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Resolve
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => acknowledgeAlert(alert.id)}
                        disabled={isAcknowledgingAlert}
                      >
                        {isAcknowledgingAlert ? (
                          <Loader className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Acknowledge
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => resolveAlert(alert.id)}
                        disabled={isResolvingAlert}
                      >
                        {isResolvingAlert ? (
                          <Loader className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <X className="h-4 w-4 mr-1" />
                        )}
                        Resolve
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};