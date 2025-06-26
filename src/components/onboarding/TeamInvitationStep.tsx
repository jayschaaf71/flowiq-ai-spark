
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { SpecialtyType } from '@/utils/specialtyConfig';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  invitationSent?: boolean;
  invitationStatus?: 'pending' | 'sent' | 'failed';
}

interface TeamInvitationStepProps {
  specialty: SpecialtyType;
  teamConfig: {
    inviteTeam: boolean;
    teamMembers: TeamMember[];
    roles: string[];
  };
  onUpdateTeamConfig: (config: any) => void;
}

export const TeamInvitationStep: React.FC<TeamInvitationStepProps> = ({
  specialty,
  teamConfig,
  onUpdateTeamConfig
}) => {
  const [newMember, setNewMember] = useState({ name: '', email: '', role: '' });
  const [sendingInvitations, setSendingInvitations] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

  const defaultRoles = [
    'Admin',
    'Provider',
    'Nurse',  
    'Medical Assistant',
    'Receptionist',
    'Billing Specialist',
    'Office Manager'
  ];

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleToggleInviteTeam = (enabled: boolean) => {
    onUpdateTeamConfig({
      ...teamConfig,
      inviteTeam: enabled
    });
  };

  const handleAddMember = () => {
    if (!newMember.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter the team member's name.",
        variant: "destructive"
      });
      return;
    }

    if (!newMember.email.trim()) {
      toast({
        title: "Email Required", 
        description: "Please enter the team member's email address.",
        variant: "destructive"
      });
      return;
    }

    if (!isValidEmail(newMember.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (!newMember.role) {
      toast({
        title: "Role Required",
        description: "Please select a role for the team member.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate email
    const emailExists = teamConfig.teamMembers.some(member => 
      member.email.toLowerCase() === newMember.email.toLowerCase()
    );

    if (emailExists) {
      toast({
        title: "Duplicate Email",
        description: "A team member with this email address already exists.",
        variant: "destructive"
      });
      return;
    }

    const member: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name.trim(),
      email: newMember.email.trim().toLowerCase(),
      role: newMember.role,
      invitationSent: false,
      invitationStatus: 'pending'
    };
    
    onUpdateTeamConfig({
      ...teamConfig,
      teamMembers: [...teamConfig.teamMembers, member]
    });
    
    setNewMember({ name: '', email: '', role: '' });
    
    toast({
      title: "Team Member Added",
      description: `${member.name} has been added to your team.`,
    });
  };

  const handleSendInvitation = async (memberId: string) => {
    const member = teamConfig.teamMembers.find(m => m.id === memberId);
    if (!member) return;

    setSendingInvitations(prev => ({ ...prev, [memberId]: true }));

    try {
      // Update member status to indicate invitation is being sent
      const updatedMembers = teamConfig.teamMembers.map(m => 
        m.id === memberId 
          ? { ...m, invitationStatus: 'pending' as const }
          : m
      );
      
      onUpdateTeamConfig({
        ...teamConfig,
        teamMembers: updatedMembers
      });

      // Simulate invitation sending (this will be handled by the main onboarding completion)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update member status to sent
      const finalMembers = teamConfig.teamMembers.map(m => 
        m.id === memberId 
          ? { ...m, invitationSent: true, invitationStatus: 'sent' as const }
          : m
      );
      
      onUpdateTeamConfig({
        ...teamConfig,
        teamMembers: finalMembers
      });

      toast({
        title: "Invitation Queued",
        description: `Invitation for ${member.name} will be sent when you complete onboarding.`,
      });

    } catch (error) {
      console.error('Error preparing invitation:', error);
      
      // Update member status to failed
      const failedMembers = teamConfig.teamMembers.map(m => 
        m.id === memberId 
          ? { ...m, invitationStatus: 'failed' as const }
          : m
      );
      
      onUpdateTeamConfig({
        ...teamConfig,
        teamMembers: failedMembers
      });

      toast({
        title: "Error",
        description: `Failed to queue invitation for ${member.name}.`,
        variant: "destructive"
      });
    } finally {
      setSendingInvitations(prev => ({ ...prev, [memberId]: false }));
    }
  };

  const handleRemoveMember = (id: string) => {
    const member = teamConfig.teamMembers.find(m => m.id === id);
    onUpdateTeamConfig({
      ...teamConfig,
      teamMembers: teamConfig.teamMembers.filter(member => member.id !== id)
    });
    
    if (member) {
      toast({
        title: "Team Member Removed",
        description: `${member.name} has been removed from your team.`,
      });
    }
  };

  const getStatusBadge = (member: TeamMember) => {
    switch (member.invitationStatus) {
      case 'sent':
        return <Badge className="bg-green-100 text-green-700"><Check className="w-3 h-3 mr-1" />Queued</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Team Setup</h2>
        <p className="text-gray-600 text-lg">
          Invite your team members and assign roles for your practice
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Team Invitations</CardTitle>
            <div className="flex items-center gap-2">
              <Label htmlFor="invite-toggle">Enable team invitations</Label>
              <Switch
                id="invite-toggle"
                checked={teamConfig.inviteTeam}
                onCheckedChange={handleToggleInviteTeam}
              />
            </div>
          </div>
        </CardHeader>
        {teamConfig.inviteTeam && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <div className="flex gap-2">
                  <Select value={newMember.role} onValueChange={(value) => setNewMember({...newMember, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {defaultRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddMember} size="sm">
                    <UserPlus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {teamConfig.teamMembers.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Team Members ({teamConfig.teamMembers.length})</h4>
                {teamConfig.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.email}</p>
                      </div>
                      <Badge variant="secondary">{member.role}</Badge>
                      {getStatusBadge(member)}
                    </div>
                    <div className="flex items-center gap-2">
                      {!member.invitationSent && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendInvitation(member.id)}
                          disabled={sendingInvitations[member.id]}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          {sendingInvitations[member.id] ? 'Queueing...' : 'Queue Invite'}
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Team Access Overview</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Admins have full access to all features and settings</li>
                <li>• Providers can access patient records and clinical features</li>
                <li>• Staff can manage appointments and basic patient info</li>
                <li>• Billing specialists have access to financial features</li>
              </ul>
            </div>
          </CardContent>
        )}
      </Card>

      {!teamConfig.inviteTeam && (
        <div className="text-center py-8 text-gray-500">
          <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Team invitations are disabled. You can add team members later from settings.</p>
        </div>
      )}
    </div>
  );
};
