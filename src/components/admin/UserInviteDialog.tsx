import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail } from 'lucide-react';

export const UserInviteDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
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
      alert('Please fill in all required fields');
      return;
    }

    setIsInviting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔧 [UserInviteDialog] Inviting user:', formData);
      
      // In a real implementation, this would call an API
      alert(`Invitation sent to ${formData.email}! (This would send a real invitation in production)`);

      setFormData({
        email: '',
        role: 'staff',
        tenantId: '',
        firstName: '',
        lastName: ''
      });
      setOpen(false);
    } catch (error) {
      console.error('Error inviting user:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  };

  // Mock tenants data for demo
  const mockTenants = [
    { id: '1', brand_name: 'Midwest Dental Sleep Medicine Institute', specialty: 'dental-sleep-medicine' },
    { id: '2', brand_name: 'West County Spine and Joint', specialty: 'chiropractic-care' }
  ];

  const selectedTenant = mockTenants.find(t => t.id === formData.tenantId);

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
                {mockTenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.brand_name} ({tenant.specialty})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role">Role *</Label>
            <Select onValueChange={(value: 'platform_admin' | 'tenant_admin' | 'practice_manager' | 'staff') => setFormData(prev => ({ ...prev, role: value }))}>
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