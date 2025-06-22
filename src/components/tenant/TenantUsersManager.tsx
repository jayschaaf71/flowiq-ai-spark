
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { UserPlus, Mail, Shield, Users, Crown } from 'lucide-react';

export const TenantUsersManager: React.FC = () => {
  const { tenants, inviteUser, isInviting } = useTenantManagement();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'tenant_admin' | 'practice_manager' | 'staff'>('staff');

  const handleInviteUser = () => {
    if (selectedTenant && inviteEmail && inviteRole) {
      inviteUser({
        tenantId: selectedTenant,
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail('');
      setInviteDialogOpen(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'platform_admin': return Crown;
      case 'tenant_admin': return Shield;
      case 'practice_manager': return Users;
      case 'staff': return UserPlus;
      default: return UserPlus;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'platform_admin': return 'bg-purple-100 text-purple-800';
      case 'tenant_admin': return 'bg-red-100 text-red-800';
      case 'practice_manager': return 'bg-blue-100 text-blue-800';
      case 'staff': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-gray-600">Manage users across all tenants</p>
        </div>
        
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite User to Tenant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="tenant">Select Tenant</Label>
                <Select onValueChange={setSelectedTenant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants?.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.brand_name} ({tenant.specialty})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select onValueChange={(value: any) => setInviteRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="practice_manager">Practice Manager</SelectItem>
                    <SelectItem value="tenant_admin">Tenant Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setInviteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleInviteUser}
                  disabled={isInviting || !selectedTenant || !inviteEmail}
                >
                  {isInviting ? 'Inviting...' : 'Send Invitation'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Role Hierarchy Info */}
      <Card>
        <CardHeader>
          <CardTitle>Role Hierarchy</CardTitle>
          <CardDescription>Understanding user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Badge className="bg-purple-100 text-purple-800">
                <Crown className="w-3 h-3 mr-1" />
                Platform Admin
              </Badge>
              <p className="text-sm text-gray-600">
                Full system access across all tenants
              </p>
            </div>

            <div className="space-y-2">
              <Badge className="bg-red-100 text-red-800">
                <Shield className="w-3 h-3 mr-1" />
                Tenant Admin
              </Badge>
              <p className="text-sm text-gray-600">
                Manages their specific tenant
              </p>
            </div>

            <div className="space-y-2">
              <Badge className="bg-blue-100 text-blue-800">
                <Users className="w-3 h-3 mr-1" />
                Practice Manager
              </Badge>
              <p className="text-sm text-gray-600">
                Manages forms, staff, and patients
              </p>
            </div>

            <div className="space-y-2">
              <Badge className="bg-green-100 text-green-800">
                <UserPlus className="w-3 h-3 mr-1" />
                Staff
              </Badge>
              <p className="text-sm text-gray-600">
                Limited access to assigned functions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tenants and Their Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tenants?.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span>{tenant.brand_name}</span>
              </CardTitle>
              <CardDescription>
                {tenant.specialty} • {tenant.max_users} max users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Current Users:</span>
                  <span className="font-medium">0 / {tenant.max_users}</span>
                </div>
                
                <div className="text-center py-6 text-gray-500">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No users invited yet</p>
                  <p className="text-xs">Invite users to get started</p>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setSelectedTenant(tenant.id);
                    setInviteDialogOpen(true);
                  }}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite to {tenant.brand_name}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
