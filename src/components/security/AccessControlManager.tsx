
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnhancedAuth } from "@/hooks/useEnhancedAuth";
import { 
  Shield, 
  Users, 
  Key, 
  Lock, 
  Eye, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  UserCheck,
  UserX
} from "lucide-react";

interface AccessRule {
  id: string;
  resource: string;
  role: string;
  permissions: string[];
  status: 'active' | 'inactive';
}

interface UserAccess {
  id: string;
  email: string;
  role: string;
  lastAccess: string;
  status: 'active' | 'inactive' | 'suspended';
  permissions: string[];
}

export const AccessControlManager = () => {
  const { user, primaryTenant } = useEnhancedAuth();

  const [accessRules] = useState<AccessRule[]>([
    {
      id: '1',
      resource: 'Patient Records',
      role: 'Provider',
      permissions: ['read', 'write', 'delete'],
      status: 'active'
    },
    {
      id: '2',
      resource: 'Patient Records',
      role: 'Nurse',
      permissions: ['read', 'write'],
      status: 'active'
    },
    {
      id: '3',
      resource: 'Patient Records',
      role: 'Receptionist',
      permissions: ['read'],
      status: 'active'
    },
    {
      id: '4',
      resource: 'Financial Data',
      role: 'Billing Manager',
      permissions: ['read', 'write'],
      status: 'active'
    },
    {
      id: '5',
      resource: 'System Admin',
      role: 'Administrator',
      permissions: ['read', 'write', 'delete', 'admin'],
      status: 'active'
    }
  ]);

  const [userAccess] = useState<UserAccess[]>([
    {
      id: '1',
      email: 'dr.smith@clinic.com',
      role: 'Provider',
      lastAccess: '2024-01-15 14:30',
      status: 'active',
      permissions: ['read', 'write', 'delete']
    },
    {
      id: '2',
      email: 'nurse.jones@clinic.com',
      role: 'Nurse',
      lastAccess: '2024-01-15 13:45',
      status: 'active',
      permissions: ['read', 'write']
    },
    {
      id: '3',
      email: 'reception@clinic.com',
      role: 'Receptionist',
      lastAccess: '2024-01-15 12:15',
      status: 'active',
      permissions: ['read']
    }
  ]);

  const getPermissionBadge = (permission: string) => {
    const variants = {
      read: 'bg-blue-100 text-blue-700',
      write: 'bg-green-100 text-green-700',
      delete: 'bg-red-100 text-red-700',
      admin: 'bg-purple-100 text-purple-700'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={variants[permission as keyof typeof variants] || 'bg-gray-100 text-gray-700'}
      >
        {permission}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'suspended':
        return <UserX className="w-4 h-4 text-red-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-400" />;
    }
  };

  const securityMetrics = [
    { label: 'Active Users', value: userAccess.filter(u => u.status === 'active').length, icon: Users },
    { label: 'Access Rules', value: accessRules.filter(r => r.status === 'active').length, icon: Shield },
    { label: 'Failed Logins (24h)', value: 0, icon: AlertTriangle },
    { label: 'Permission Changes', value: 2, icon: Key }
  ];

  return (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {securityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <metric.icon className="w-6 h-6 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">User Access</TabsTrigger>
          <TabsTrigger value="roles">Role Permissions</TabsTrigger>
          <TabsTrigger value="security">Security Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Access Management
              </CardTitle>
              <CardDescription>
                Manage user access and permissions for {primaryTenant?.tenant.brand_name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Last Access</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAccess.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.permissions.map((permission) => (
                            <span key={permission}>
                              {getPermissionBadge(permission)}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {user.lastAccess}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(user.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Role-Based Access Control
              </CardTitle>
              <CardDescription>
                Configure permissions for different user roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accessRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.resource}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{rule.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {rule.permissions.map((permission) => (
                            <span key={permission}>
                              {getPermissionBadge(permission)}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(rule.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Policies
                </CardTitle>
                <CardDescription>
                  Active security policies and controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium">Authentication Policies</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Multi-Factor Authentication</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <Badge className="bg-green-100 text-green-700">Enabled</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Session Timeout (30 min)</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Password Complexity</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <Badge className="bg-green-100 text-green-700">Enforced</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Access Controls</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Row-Level Security</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">Role-Based Access</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm">API Rate Limiting</span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All access controls are automatically enforced and logged for HIPAA compliance. 
                Any changes to user permissions are immediately reflected across all systems and recorded in the audit trail.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
