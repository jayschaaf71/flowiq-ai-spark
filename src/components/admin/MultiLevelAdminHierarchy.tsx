import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Crown, 
  Shield, 
  Users, 
  UserPlus, 
  Settings, 
  Eye, 
  Edit, 
  Trash2,
  Building,
  UserCheck
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'platform_admin' | 'tenant_admin' | 'practice_manager' | 'staff';
  tenants: string[];
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  scope: 'platform' | 'tenant' | 'practice';
}

export const MultiLevelAdminHierarchy: React.FC = () => {
  const [adminUsers] = useState<AdminUser[]>([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@flowiq.com',
      role: 'super_admin',
      tenants: ['all'],
      permissions: ['all'],
      status: 'active',
      lastLogin: '2024-01-15 09:30',
      createdAt: '2023-01-01'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@flowiq.com',
      role: 'platform_admin',
      tenants: ['all'],
      permissions: ['tenant_management', 'analytics', 'support'],
      status: 'active',
      lastLogin: '2024-01-15 08:45',
      createdAt: '2023-02-15'
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@sunrisedental.com',
      role: 'tenant_admin',
      tenants: ['sunrise-dental'],
      permissions: ['user_management', 'settings', 'analytics'],
      status: 'active',
      lastLogin: '2024-01-14 16:20',
      createdAt: '2023-06-10'
    },
    {
      id: '4',
      name: 'Lisa Brown',
      email: 'lisa@metrochiropractor.com',
      role: 'practice_manager',
      tenants: ['metro-chiropractic'],
      permissions: ['schedule_management', 'staff_management', 'reports'],
      status: 'active',
      lastLogin: '2024-01-15 07:15',
      createdAt: '2023-08-22'
    }
  ]);

  const [permissions] = useState<Permission[]>([
    // Platform-level permissions
    { id: 'tenant_management', name: 'Tenant Management', description: 'Create, modify, and delete tenants', category: 'Platform', scope: 'platform' },
    { id: 'platform_analytics', name: 'Platform Analytics', description: 'View system-wide analytics and reports', category: 'Platform', scope: 'platform' },
    { id: 'system_settings', name: 'System Settings', description: 'Configure platform-wide settings', category: 'Platform', scope: 'platform' },
    { id: 'user_management', name: 'User Management', description: 'Manage platform users and roles', category: 'Platform', scope: 'platform' },
    
    // Tenant-level permissions
    { id: 'tenant_settings', name: 'Tenant Settings', description: 'Configure tenant-specific settings', category: 'Tenant', scope: 'tenant' },
    { id: 'tenant_analytics', name: 'Tenant Analytics', description: 'View tenant analytics and reports', category: 'Tenant', scope: 'tenant' },
    { id: 'billing_management', name: 'Billing Management', description: 'Manage billing and subscriptions', category: 'Tenant', scope: 'tenant' },
    { id: 'integration_management', name: 'Integration Management', description: 'Configure integrations and APIs', category: 'Tenant', scope: 'tenant' },
    
    // Practice-level permissions
    { id: 'schedule_management', name: 'Schedule Management', description: 'Manage appointments and schedules', category: 'Practice', scope: 'practice' },
    { id: 'staff_management', name: 'Staff Management', description: 'Manage practice staff and roles', category: 'Practice', scope: 'practice' },
    { id: 'patient_management', name: 'Patient Management', description: 'Manage patient records and data', category: 'Practice', scope: 'practice' },
    { id: 'reports', name: 'Reports', description: 'Generate and view practice reports', category: 'Practice', scope: 'practice' }
  ]);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'platform_admin':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'tenant_admin':
        return <Building className="h-4 w-4 text-green-500" />;
      case 'practice_manager':
        return <UserCheck className="h-4 w-4 text-purple-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      super_admin: 'destructive',
      platform_admin: 'default',
      tenant_admin: 'secondary',
      practice_manager: 'outline',
      staff: 'outline'
    };
    
    return (
      <Badge variant={variants[role] || 'outline'}>
        {role.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const roleHierarchy = [
    {
      role: 'super_admin',
      name: 'Super Administrator',
      description: 'Full platform access with all permissions',
      icon: Crown,
      color: 'text-yellow-500'
    },
    {
      role: 'platform_admin',
      name: 'Platform Administrator',
      description: 'Platform-wide management and analytics',
      icon: Shield,
      color: 'text-blue-500'
    },
    {
      role: 'tenant_admin',
      name: 'Tenant Administrator',
      description: 'Full access within assigned tenants',
      icon: Building,
      color: 'text-green-500'
    },
    {
      role: 'practice_manager',
      name: 'Practice Manager',
      description: 'Operational management within practice',
      icon: UserCheck,
      color: 'text-purple-500'
    },
    {
      role: 'staff',
      name: 'Staff',
      description: 'Limited access to assigned functions',
      icon: Users,
      color: 'text-gray-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Role Hierarchy Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Role Hierarchy</CardTitle>
          <CardDescription>
            Multi-level role-based access control with granular permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {roleHierarchy.map((level, index) => {
              const Icon = level.icon;
              const userCount = adminUsers.filter(u => u.role === level.role).length;
              
              return (
                <div key={level.role} className="relative">
                  <Card className="p-4">
                    <div className="text-center space-y-2">
                      <Icon className={`h-8 w-8 mx-auto ${level.color}`} />
                      <h3 className="font-medium text-sm">{level.name}</h3>
                      <p className="text-xs text-muted-foreground">{level.description}</p>
                      <Badge variant="outline">{userCount} users</Badge>
                    </div>
                  </Card>
                  {index < roleHierarchy.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-muted-foreground">
                      →
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Admin Users Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Administrative Users</CardTitle>
              <CardDescription>
                Manage users with administrative privileges across the platform
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Admin User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Administrative User</DialogTitle>
                  <DialogDescription>
                    Add a new user with administrative privileges
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Smith" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">Administrative Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="platform_admin">Platform Administrator</SelectItem>
                        <SelectItem value="tenant_admin">Tenant Administrator</SelectItem>
                        <SelectItem value="practice_manager">Practice Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                      {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox id={permission.id} />
                          <Label htmlFor={permission.id} className="text-sm">
                            {permission.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(false)}>
                      Create User
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tenants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell>
                    {user.tenants.includes('all') ? (
                      <Badge variant="outline">All Tenants</Badge>
                    ) : (
                      <Badge variant="secondary">{user.tenants.length} tenants</Badge>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm">{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => console.log('Editing user', user.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => console.log('Deleting user', user.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions Matrix</CardTitle>
          <CardDescription>
            Overview of permissions by role and scope
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Platform', 'Tenant', 'Practice'].map((category) => (
              <div key={category}>
                <h4 className="font-medium mb-2">{category} Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissions
                    .filter(p => p.category === category)
                    .map((permission) => (
                      <div key={permission.id} className="p-3 border rounded-lg">
                        <h5 className="font-medium text-sm">{permission.name}</h5>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};