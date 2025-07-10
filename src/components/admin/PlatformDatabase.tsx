import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Play, Pause, Settings, Archive } from 'lucide-react';

export const PlatformDatabase = () => {
  const databases = [
    { name: "Primary DB", status: "online", connections: 45, cpu: "23%", memory: "67%" },
    { name: "Read Replica 1", status: "online", connections: 23, cpu: "18%", memory: "45%" },
    { name: "Read Replica 2", status: "online", connections: 19, cpu: "15%", memory: "38%" },
    { name: "Analytics DB", status: "maintenance", connections: 0, cpu: "0%", memory: "12%" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Database Management</h1>
        <p className="text-muted-foreground">Monitor and manage database instances and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {databases.map((db) => (
          <Card key={db.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{db.name}</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant={db.status === 'online' ? 'default' : 'secondary'}>
                {db.status}
              </Badge>
              <div className="text-sm space-y-1">
                <div>Connections: {db.connections}</div>
                <div>CPU: {db.cpu}</div>
                <div>Memory: {db.memory}</div>
              </div>
              <div className="flex space-x-1">
                <Button variant="outline" size="icon" onClick={() => console.log('Start database', db.name)}>
                  <Play className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => console.log('Pause database', db.name)}>
                  <Pause className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => console.log('Configure database', db.name)}>
                  <Settings className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Query Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Database query performance metrics and slow query analysis.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Backup Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Last Backup</span>
              <span className="text-sm font-medium">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Next Scheduled</span>
              <span className="text-sm font-medium">In 4 hours</span>
            </div>
            <Button variant="outline" className="w-full" onClick={() => console.log('Creating manual backup...')}>
              <Archive className="h-4 w-4 mr-2" />
              Create Manual Backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};