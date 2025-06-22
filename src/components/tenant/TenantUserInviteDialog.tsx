
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserPlus, Mail, X } from 'lucide-react';
import { useTenantManagement } from '@/hooks/useTenantManagement';
import { useToast } from '@/hooks/use-toast';

interface TenantUserInviteDialogProps {
  tenantId: string;
  tenantName: string;
}

export const TenantUserInviteDialog: React.FC<TenantUserInviteDialogProps> = ({
  tenantId,
  tenantName
}) => {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const [role, setRole] = useState<'tenant_admin' | 'practice_manager' | 'staff'>('staff');
  const [isLoading, setIsLoading] = useState(false);
  const { inviteUser } = useTenantManagement();
  const { toast } = useToast();

  const addEmail = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail]);
      setCurrentEmail('');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove));
  };

  const handleInvite = async () => {
    if (emails.length === 0) return;

    setIsLoading(true);
    try {
      for (const email of emails) {
        await new Promise(resolve => {
          inviteUser({
            tenantId,
            email,
            role,
          });
          setTimeout(resolve, 100); // Small delay between invites
        });
      }
      
      toast({
        title: 'Invitations Sent',
        description: `${emails.length} invitation(s) sent successfully to ${tenantName}`,
      });
      
      setEmails([]);
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send some invitations',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addEmail();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite Users
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Users to {tenantName}</DialogTitle>
          <DialogDescription>
            Send invitations to join this tenant organization
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Input */}
          <div>
            <Label htmlFor="email">Email Addresses</Label>
            <div className="flex gap-2">
              <Input
                id="email"
                type="email"
                value={currentEmail}
                onChange={(e) => setCurrentEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="user@example.com"
              />
              <Button type="button" onClick={addEmail} disabled={!currentEmail}>
                <UserPlus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Email Tags */}
          {emails.length > 0 && (
            <div className="space-y-2">
              <Label>Pending Invitations</Label>
              <div className="flex flex-wrap gap-2">
                {emails.map((email) => (
                  <Badge key={email} variant="secondary" className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {email}
                    <button
                      onClick={() => removeEmail(email)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Role Selection */}
          <div>
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value: any) => setRole(value)}>
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

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleInvite}
              disabled={isLoading || emails.length === 0}
            >
              {isLoading ? 'Sending...' : `Send ${emails.length} Invitation${emails.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
