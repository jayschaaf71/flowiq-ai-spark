import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePlatformUsers } from '@/hooks/usePlatformUsers';
import { useTenantManagement } from '@/hooks/useTenantManagement';

export const UserInviteDialog: React.FC = () => {
  const { inviteUser, isInviting } = usePlatformUsers();
  const { tenants } = useTenantManagement();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'staff' as 'platform_admin' | 'tenant_admin' | 'practice_manager' | 'staff',
    tenantId: '',
    firstName: '',
    lastName: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.role || !formData.tenantId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      await inviteUser({
        tenantId: formData.tenantId,
        email: formData.email,
        role: formData.role,
        firstName: formData.firstName,
        lastName: formData.lastName
      });

      setFormData({
        email: '',
        role: 'staff',
        tenantId: '',
        firstName: '',
        lastName: ''
      });
      setOpen(false);

      toast({
        title: "User Invited",
        description: `Invitation sent to ${formData.email}`,
      });
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      });
    }
  };

  const selectedTenant = tenants?.find(t => t.id === formData.tenantId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invite User to Practice
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="user@practice.com"
            />
          </div>

          <div>
            <Label htmlFor="tenant">Practice *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, tenantId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select practice" />
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
            <Label htmlFor="role">Role *</Label>
            <Select onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform_admin">Platform Admin</SelectItem>
                <SelectItem value="tenant_admin">Practice Admin</SelectItem>
                <SelectItem value="practice_manager">Practice Manager</SelectItem>
                <SelectItem value="staff">Staff Member</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedTenant && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                User will be invited to <strong>{selectedTenant.brand_name}</strong> as a{' '}
                <strong>
                  {formData.role === 'platform_admin' ? 'Platform Admin' : 
                   formData.role === 'tenant_admin' ? 'Practice Admin' :
                   formData.role === 'practice_manager' ? 'Practice Manager' : 'Staff Member'}
                </strong>
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isInviting}>
              {isInviting ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};