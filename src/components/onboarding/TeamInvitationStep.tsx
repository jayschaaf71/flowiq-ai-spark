
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserPlus, Mail } from "lucide-react";
import { SpecialtyType } from '@/utils/specialtyConfig';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
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

  const defaultRoles = [
    'Admin',
    'Provider',
    'Nurse',
    'Medical Assistant',
    'Receptionist',
    'Billing Specialist',
    'Office Manager'
  ];

  const handleToggleInviteTeam = (enabled: boolean) => {
    onUpdateTeamConfig({
      ...teamConfig,
      inviteTeam: enabled
    });
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.email && newMember.role) {
      const member: TeamMember = {
        id: Date.now().toString(),
        ...newMember
      };
      
      onUpdateTeamConfig({
        ...teamConfig,
        teamMembers: [...teamConfig.teamMembers, member]
      });
      
      setNewMember({ name: '', email: '', role: '' });
    }
  };

  const handleRemoveMember = (id: string) => {
    onUpdateTeamConfig({
      ...teamConfig,
      teamMembers: teamConfig.teamMembers.filter(member => member.id !== id)
    });
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
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
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Mail className="w-4 h-4 mr-2" />
                        Invite
                      </Button>
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
