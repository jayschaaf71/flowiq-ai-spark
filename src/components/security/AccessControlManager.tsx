
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Shield,
  Key,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  UserCheck,
  UserX,
  Lock,
  Unlock,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'locked';
  lastLogin: string;
  permissions: string[];
  mfaEnabled: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean;
}

export const AccessControlManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'users' | 'roles' | 'permissions'>('users');

  const [users] = useState<User[]>([
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@clinic.com',
      role: 'Physician',
      department: 'Internal Medicine',
      status: 'active',
      lastLogin: '2024-01-20 09:30',
      permissions: ['read_patients', 'write_patients', 'read_soap_notes', 'write_soap_notes'],
      mfaEnabled: true
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.davis@clinic.com',
      role: 'Nurse',
      department: 'Patient Care',
      status: 'active',
      lastLogin: '2024-01-20 08:45',
      permissions: ['read_patients', 'read_soap_notes', 'write_vitals'],
      mfaEnabled: true
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@clinic.com',
      role: 'Administrator',
      department: 'IT',
      status: 'active',
      lastLogin: '2024-01-20 07:15',
      permissions: ['admin_all', 'user_management', 'system_settings'],
      mfaEnabled: true
    },
    {
      id: '4',
      name: 'Lisa Brown',
      email: 'lisa.brown@clinic.com',
      role: 'Receptionist',
      department: 'Front Desk',
      status: 'locked',
      lastLogin: '2024-01-19 16:30',
      permissions: ['read_appointments', 'write_appointments', 'read_patients_basic'],
      mfaEnabled: false
    }
  ]);

  const [roles] = useState<Role[]>([
    {
      id: '1',
      name: 'Physician',
      description: 'Full access to patient records and medical data',
      permissions: ['read_patients', 'write_patients', 'read_soap_notes', 'write_soap_notes', 'prescribe_medications'],
      userCount: 8,
      isSystem: true
    },
    {
      id: '2',
      name: 'Nurse',
      description: 'Access to patient care and basic medical records',
      permissions: ['read_patients', 'read_soap_notes', 'write_vitals', 'read_medications'],
      userCount: 12,
      isSystem: true
    },
    {
      id: '3',
      name: 'Administrator',
      description: 'System administration and user management',
      permissions: ['admin_all', 'user_management', 'system_settings', 'audit_logs'],
      userCount: 3,
      isSystem: true
    },
    {
      id: '4',
      name: 'Receptionist',
      description: 'Front desk operations and appointment scheduling',
      permissions: ['read_appointments', 'write_appointments', 'read_patients_basic'],
      userCount: 5,
      isSystem: false
    }
  ]);

  const permissions = [
    { id: 'read_patients', name: 'Read Patient Records', category: 'Patient Data' },
    { id: 'write_patients', name: 'Write Patient Records', category: 'Patient Data' },
    { id: 'read_soap_notes', name: 'Read SOAP Notes', category: 'Medical Records' },
    { id: 'write_soap_notes', name: 'Write SOAP Notes', category: 'Medical Records' },
    { id: 'prescribe_medications', name: 'Prescribe Medications', category: 'Medical Records' },
    { id: 'read_appointments', name: 'Read Appointments', category: 'Scheduling' },
    { id: 'write_appointments', name: 'Write Appointments', category: 'Scheduling' },
    { id: 'user_management', name: 'Manage Users', category: 'Administration' },
    { id: 'system_settings', name: 'System Settings', category: 'Administration' },
    { id: 'audit_logs', name: 'View Audit Logs', category: 'Administration' },
    { id: 'admin_all', name: 'Full Administrator Access', category: 'Administration' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'locked': return <UserX className="h-4 w-4 text-red-600" />;
      case 'inactive': return <Users className="h-4 w-4 text-gray-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">Access Control Manager</h2>
          <p className="text-gray-600">Manage user access, roles, and permissions</p>
        </div>
      </div>

      {/* Access Control Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-gray-600">Total Users</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{roles.length}</div>
              <div className="text-sm text-gray-600">Defined Roles</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {users.filter(u => u.mfaEnabled).length}/{users.length}
              </div>
              <div className="text-sm text-gray-600">MFA Enabled</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Card>
        <CardHeader>
          <div className="flex gap-2">
            <Button
              variant={selectedTab === 'users' ? 'default' : 'outline'}
              onClick={() => setSelectedTab('users')}
            >
              <Users className="h-4 w-4 mr-2" />
              Users
            </Button>
            <Button
              variant={selectedTab === 'roles' ? 'default' : 'outline'}
              onClick={() => setSelectedTab('roles')}
            >
              <Shield className="h-4 w-4 mr-2" />
              Roles
            </Button>
            <Button
              variant={selectedTab === 'permissions' ? 'default' : 'outline'}
              onClick={() => setSelectedTab('permissions')}
            >
              <Key className="h-4 w-4 mr-2" />
              Permissions
            </Button>
          </div>
        </CardHeader>
      </Card>

      {selectedTab === 'users' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Management</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
            <CardDescription>
              Manage user accounts, roles, and access permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users by name, email, or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(user.status)}
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{user.name}</h3>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                            {user.mfaEnabled && (
                              <Badge variant="outline" className="text-green-600 border-green-300">
                                <Lock className="h-3 w-3 mr-1" />
                                MFA
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{user.email}</span>
                            <span>{user.role}</span>
                            <span>{user.department}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last login: {user.lastLogin}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          {user.status === 'locked' ? (
                            <Unlock className="h-4 w-4" />
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'roles' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Role Management</CardTitle>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Role
              </Button>
            </div>
            <CardDescription>
              Define and manage user roles and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{role.name}</h3>
                        <Badge variant="outline">
                          {role.userCount} users
                        </Badge>
                        {role.isSystem && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            System Role
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled={role.isSystem}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" disabled={role.isSystem}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedTab === 'permissions' && (
        <Card>
          <CardHeader>
            <CardTitle>Permission Matrix</CardTitle>
            <CardDescription>
              Overview of all system permissions organized by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {['Patient Data', 'Medical Records', 'Scheduling', 'Administration'].map((category) => (
                <div key={category}>
                  <h3 className="font-semibold mb-3">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {permissions
                      .filter(p => p.category === category)
                      .map((permission) => (
                        <div key={permission.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{permission.name}</div>
                              <div className="text-sm text-gray-600">{permission.id}</div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {roles.filter(r => r.permissions.includes(permission.id)).length} roles
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border-l-4 border-yellow-500 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="font-medium">MFA Not Enabled</div>
                <div className="text-sm text-gray-600">
                  1 user (Lisa Brown) doesn't have multi-factor authentication enabled
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 border-l-4 border-red-500 bg-red-50">
              <UserX className="h-4 w-4 text-red-600" />
              <div>
                <div className="font-medium">Locked Account</div>
                <div className="text-sm text-gray-600">
                  Lisa Brown's account is currently locked due to failed login attempts
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
