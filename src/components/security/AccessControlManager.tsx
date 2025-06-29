
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Shield, 
  Key, 
  Lock, 
  UserCheck, 
  UserX, 
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

interface UserRole {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  lastAccess: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export const AccessControlManager: React.FC = () => {
  const [users] = useState<UserRole[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@clinic.com',
      role: 'Physician',
      permissions: ['read_phi', 'write_phi', 'prescribe_medication', 'view_reports'],
      lastAccess: '2024-01-15T10:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Mike Chen',
      email: 'mike.chen@clinic.com',
      role: 'Nurse',
      permissions: ['read_phi', 'update_vitals', 'schedule_appointments'],
      lastAccess: '2024-01-15T09:15:00Z',
      status: 'active'
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      email: 'lisa.rodriguez@clinic.com',
      role: 'Administrator',
      permissions: ['read_phi', 'manage_users', 'view_reports', 'system_admin'],
      lastAccess: '2024-01-14T16:45:00Z',
      status: 'active'
    }
  ]);

  const [permissions] = useState<Permission[]>([
    {
      id: '1',
      name: 'read_phi',
      description: 'View patient health information',
      category: 'PHI Access',
      riskLevel: 'high'
    },
    {
      id: '2',
      name: 'write_phi',
      description: 'Create and modify patient records',
      category: 'PHI Access',
      riskLevel: 'high'
    },
    {
      id: '3',
      name: 'prescribe_medication',
      description: 'Prescribe medications to patients',
      category: 'Clinical',
      riskLevel: 'high'
    },
    {
      id: '4',
      name: 'schedule_appointments',
      description: 'Schedule and manage patient appointments',
      category: 'Administrative',
      riskLevel: 'low'
    },
    {
      id: '5',
      name: 'view_reports',
      description: 'Access system reports and analytics',
      category: 'Reporting',
      riskLevel: 'medium'
    },
    {
      id: '6',
      name: 'manage_users',
      description: 'Create and manage user accounts',
      category: 'Administration',
      riskLevel: 'high'
    }
  ]);

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

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return <Badge variant="destructive">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700">Low Risk</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Access Control Management</h2>
          <p className="text-gray-600">Manage user roles, permissions, and access controls</p>
        </div>
        <Button className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Add User
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-xl font-bold">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Permissions</p>
                <p className="text-xl font-bold">{permissions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">High Risk Perms</p>
                <p className="text-xl font-bold">{permissions.filter(p => p.riskLevel === 'high').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Access Management
          </CardTitle>
          <CardDescription>
            Manage user roles and permissions for HIPAA compliance
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
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.slice(0, 2).map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {user.permissions.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.permissions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(user.lastAccess).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(user.status)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
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

      {/* Permissions Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Permission Management
          </CardTitle>
          <CardDescription>
            Configure system permissions and access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {permissions.map((permission) => (
              <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium">{permission.name}</h4>
                    <p className="text-sm text-gray-600">{permission.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{permission.category}</Badge>
                      {getRiskBadge(permission.riskLevel)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Security Notice:</strong> All user access is monitored and logged for HIPAA compliance. 
          Unauthorized access attempts are automatically flagged and investigated.
        </AlertDescription>
      </Alert>
    </div>
  );
};
