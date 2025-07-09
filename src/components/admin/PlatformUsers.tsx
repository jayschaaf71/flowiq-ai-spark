import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Mail, MoreVertical } from 'lucide-react';
import { UserInviteDialog } from './UserInviteDialog';

export const PlatformUsers = () => {
  const users = [
    { id: 1, name: "Dr. Mark Thompson", email: "mark.thompson@westcountyspine.com", role: "practice_admin", tenant: "West County Spine & Joint", status: "active" },
    { id: 2, name: "Dr. Amanda Chen", email: "amanda.chen@midwestdentalsleep.com", role: "practice_admin", tenant: "Midwest Dental Sleep Medicine", status: "active" },
    { id: 3, name: "Sarah Wilson", email: "sarah.wilson@westcountyspine.com", role: "staff", tenant: "West County Spine & Joint", status: "pending" },
    { id: 4, name: "James Parker", email: "james.parker@midwestdentalsleep.com", role: "staff", tenant: "Midwest Dental Sleep Medicine", status: "active" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage platform users across all tenants</p>
        </div>
        <UserInviteDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Platform Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.tenant}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};