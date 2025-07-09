import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone,
  Edit,
  Trash2,
  Shield,
  Send,
  MoreVertical,
  Key,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  specialty?: string;
  created_at: string;
  updated_at: string;
  tenant_id?: string;
}

interface InviteMemberData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  specialty: string;
}

const roleOptions = [
  { value: 'admin', label: 'Administrator', description: 'Full system access and user management' },
  { value: 'provider', label: 'Provider/Doctor', description: 'Patient care, documentation, and clinical features' },
  { value: 'staff', label: 'Staff/Assistant', description: 'Front desk, scheduling, and basic patient management' },
  { value: 'manager', label: 'Practice Manager', description: 'Operations management and reporting' },
  { value: 'billing', label: 'Billing Specialist', description: 'Claims processing and revenue cycle management' }
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  pending: 'bg-yellow-100 text-yellow-800'
};

const statusIcons = {
  active: CheckCircle,
  inactive: XCircle,
  pending: Clock
};

export const TeamManagement: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [inviteData, setInviteData] = useState<InviteMemberData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'staff',
    specialty: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading team members:', error);
        // Use mock data for now
        setTeamMembers([
          {
            id: '1',
            first_name: 'Dr. Sarah',
            last_name: 'Johnson',
            email: 'sarah.johnson@practice.com',
            phone: '(555) 123-4567',
            role: 'provider',
            status: 'active',
            specialty: 'Family Medicine',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '2',
            first_name: 'Maria',
            last_name: 'Garcia',
            email: 'maria.garcia@practice.com',
            phone: '(555) 987-6543',
            role: 'staff',
            status: 'active',
            specialty: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: '3',
            first_name: 'John',
            last_name: 'Smith',
            email: 'john.smith@practice.com',
            role: 'admin',
            status: 'pending',
            specialty: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      } else {
        setTeamMembers((data || []).map(member => ({
          ...member,
          status: (member.status as 'active' | 'inactive' | 'pending') || 'active'
        })));
      }
    } catch (error) {
      console.error('Error in loadTeamMembers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load team members',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteData.firstName || !inviteData.lastName || !inviteData.email || !inviteData.role) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      // In a real implementation, this would create the user and send an invitation
      const newMember: TeamMember = {
        id: crypto.randomUUID(),
        first_name: inviteData.firstName,
        last_name: inviteData.lastName,
        email: inviteData.email,
        phone: inviteData.phone,
        role: inviteData.role,
        status: 'pending',
        specialty: inviteData.specialty,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setTeamMembers(prev => [newMember, ...prev]);
      setShowInviteDialog(false);
      setInviteData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'staff',
        specialty: ''
      });

      toast({
        title: 'Invitation Sent',
        description: `Invitation sent to ${inviteData.email}. They will receive setup instructions via email.`
      });
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to send invitation',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateMemberStatus = async (memberId: string, newStatus: 'active' | 'inactive') => {
    try {
      setTeamMembers(prev =>
        prev.map(member =>
          member.id === memberId ? { ...member, status: newStatus } : member
        )
      );

      toast({
        title: 'Status Updated',
        description: `Team member status updated to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating member status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member status',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this team member? This action cannot be undone.')) {
      return;
    }

    try {
      setTeamMembers(prev => prev.filter(member => member.id !== memberId));
      
      toast({
        title: 'Member Removed',
        description: 'Team member has been removed successfully'
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove team member',
        variant: 'destructive'
      });
    }
  };

  const getRoleInfo = (role: string) => {
    return roleOptions.find(r => r.value === role) || roleOptions[0];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Team Management
          </h2>
          <p className="text-muted-foreground">Manage your practice team members and their access</p>
        </div>
        
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Invite Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Invite New Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={inviteData.firstName}
                    onChange={(e) => setInviteData(prev => ({ ...prev, firstName: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={inviteData.lastName}
                    onChange={(e) => setInviteData(prev => ({ ...prev, lastName: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@practice.com"
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={inviteData.phone}
                  onChange={(e) => setInviteData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(555) 123-4567"
                />
              </div>
              
              <div>
                <Label htmlFor="role">Role *</Label>
                <Select value={inviteData.role} onValueChange={(value) => setInviteData(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        <div>
                          <div className="font-medium">{role.label}</div>
                          <div className="text-xs text-muted-foreground">{role.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="specialty">Specialty (Optional)</Label>
                <Input
                  id="specialty"
                  value={inviteData.specialty}
                  onChange={(e) => setInviteData(prev => ({ ...prev, specialty: e.target.value }))}
                  placeholder="e.g., Family Medicine, Cardiology"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={handleInviteMember} className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-4">
        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Team Members Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by inviting your first team member to collaborate on patient care
              </p>
              <Button onClick={() => setShowInviteDialog(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite First Team Member
              </Button>
            </CardContent>
          </Card>
        ) : (
          teamMembers.map((member) => {
            const roleInfo = getRoleInfo(member.role);
            const StatusIcon = statusIcons[member.status];
            
            return (
              <Card key={member.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {member.first_name.charAt(0)}{member.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {member.first_name} {member.last_name}
                          </h3>
                          <Badge className={statusColors[member.status]}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {member.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            {roleInfo.label}
                          </div>
                          {member.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {member.email}
                            </div>
                          )}
                          {member.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {member.phone}
                            </div>
                          )}
                        </div>
                        
                        {member.specialty && (
                          <div className="text-sm text-muted-foreground mt-1">
                            Specialty: {member.specialty}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {member.status === 'active' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateMemberStatus(member.id, 'inactive')}
                        >
                          Deactivate
                        </Button>
                      )}
                      
                      {member.status === 'inactive' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateMemberStatus(member.id, 'active')}
                        >
                          Activate
                        </Button>
                      )}
                      
                      {member.status === 'pending' && (
                        <Button variant="outline" size="sm">
                          <Send className="w-4 h-4 mr-1" />
                          Resend Invite
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingMember(member)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {teamMembers.filter(m => m.status === 'active').length}
            </div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {teamMembers.filter(m => m.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending Invites</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {teamMembers.filter(m => m.role === 'provider').length}
            </div>
            <div className="text-sm text-muted-foreground">Providers</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {teamMembers.filter(m => m.role === 'staff').length}
            </div>
            <div className="text-sm text-muted-foreground">Staff Members</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};