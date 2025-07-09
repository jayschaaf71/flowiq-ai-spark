import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Wifi, HardDrive } from 'lucide-react';

export const PlatformInfrastructure = () => {
  const services = [
    { name: "Web Servers", status: "healthy", uptime: "99.98%", icon: Server },
    { name: "Database Cluster", status: "healthy", uptime: "99.95%", icon: Database },
    { name: "Load Balancer", status: "warning", uptime: "99.87%", icon: Wifi },
    { name: "Storage Systems", status: "healthy", uptime: "99.99%", icon: HardDrive },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Infrastructure Status</h1>
        <p className="text-muted-foreground">Monitor platform infrastructure and system health</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <Card key={service.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{service.name}</CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant={service.status === 'healthy' ? 'default' : 'secondary'}>
                    {service.status}
                  </Badge>
                  <span className="text-sm font-medium">{service.uptime}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Infrastructure monitoring charts and detailed metrics will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  );
};