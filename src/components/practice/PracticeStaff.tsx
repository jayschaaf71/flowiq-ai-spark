import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  MoreVertical,
  Clock,
  Shield
} from 'lucide-react';
import { PracticeUserInviteDialog } from './PracticeUserInviteDialog';

export const PracticeStaff = () => {
  const staff = [
    { 
      id: 1, 
      name: "Dr. Emily Wilson", 
      role: "provider",
      email: "emily@practice.com",
      status: "active",
      schedule: "Mon-Fri 9AM-5PM",
      permissions: "Full Access"
    },
    { 
      id: 2, 
      name: "Jennifer Lee", 
      role: "practice_manager",
      email: "jennifer@practice.com",
      status: "active",
      schedule: "Mon-Fri 8AM-6PM",
      permissions: "Admin Access"
    },
    { 
      id: 3, 
      name: "Michael Torres", 
      role: "staff",
      email: "michael@practice.com",
      status: "active",
      schedule: "Tue-Sat 10AM-6PM",
      permissions: "Standard Access"
    },
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'provider': return 'default';
      case 'practice_manager': return 'secondary';
      case 'staff': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Staff Management</h1>
          <p className="text-muted-foreground">Manage your practice team and permissions</p>
        </div>
        <PracticeUserInviteDialog />
      </div>

      {/* Staff Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staff.length}</div>
            <p className="text-xs text-muted-foreground">
              All active members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Providers</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter(s => s.role === 'provider').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Licensed providers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Duty Today</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staff.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently working
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <UserCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{member.schedule}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Shield className="h-3 w-3" />
                        <span>{member.permissions}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getRoleBadgeVariant(member.role)}>
                    {member.role.replace('_', ' ')}
                  </Badge>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status}
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