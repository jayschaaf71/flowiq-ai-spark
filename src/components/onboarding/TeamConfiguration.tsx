
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Trash2,
  Shield,
  CheckCircle
} from 'lucide-react';
import { SpecialtyType, getSpecialtyConfig } from '@/utils/specialtyConfig';

interface TeamMember {
  name: string;
  email: string;
  role: string;
}

interface TeamConfig {
  inviteTeam: boolean;
  teamMembers: TeamMember[];
}

interface TeamConfigurationProps {
  specialty: SpecialtyType;
  teamConfig: TeamConfig | undefined;
  onTeamConfigUpdate: (config: TeamConfig) => void;
}

const roleOptions = [
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'provider', label: 'Provider', description: 'Patient care and documentation' },
  { value: 'staff', label: 'Staff', description: 'Front desk and scheduling' },
  { value: 'assistant', label: 'Assistant', description: 'Support and basic tasks' }
];

export const TeamConfiguration: React.FC<TeamConfigurationProps> = ({
  specialty,
  teamConfig,
  onTeamConfigUpdate
}) => {
  const [config, setConfig] = useState<TeamConfig>({
    inviteTeam: teamConfig?.inviteTeam || false,
    teamMembers: teamConfig?.teamMembers || []
  });

  const updateConfig = (updates: Partial<TeamConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onTeamConfigUpdate(newConfig);
  };

  const addTeamMember = () => {
    const newMember: TeamMember = {
      name: '',
      email: '',
      role: 'staff'
    };
    updateConfig({
      teamMembers: [...config.teamMembers, newMember]
    });
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = config.teamMembers.map((member, i) => 
      i === index ? { ...member, [field]: value } : member
    );
    updateConfig({ teamMembers: updatedMembers });
  };

  const removeTeamMember = (index: number) => {
    const updatedMembers = config.teamMembers.filter((_, i) => i !== index);
    updateConfig({ teamMembers: updatedMembers });
  };

  const specialtyConfig = getSpecialtyConfig(specialty);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Set up your team</h2>
        <p className="text-gray-600">
          Invite team members and assign roles for collaborative workflows
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h3 className="font-medium">Invite team members</h3>
              <p className="text-sm text-gray-600">
                Add your team now or set up later in settings
              </p>
            </div>
            <Switch
              checked={config.inviteTeam}
              onCheckedChange={(checked) => updateConfig({ inviteTeam: checked })}
            />
          </div>

          {config.inviteTeam && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Team Members</h4>
                <Button
                  onClick={addTeamMember}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </Button>
              </div>

              {config.teamMembers.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                  <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No team members added yet</p>
                  <Button
                    onClick={addTeamMember}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Add Your First Team Member
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {config.teamMembers.map((member, index) => (
                    <Card key={index} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                          <div>
                            <Label htmlFor={`name-${index}`}>Name</Label>
                            <Input
                              id={`name-${index}`}
                              value={member.name}
                              onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                              placeholder="Full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`email-${index}`}>Email</Label>
                            <Input
                              id={`email-${index}`}
                              type="email"
                              value={member.email}
                              onChange={(e) => updateTeamMember(index, 'email', e.target.value)}
                              placeholder="email@example.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`role-${index}`}>Role</Label>
                            <select
                              id={`role-${index}`}
                              value={member.role}
                              onChange={(e) => updateTeamMember(index, 'role', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              {roleOptions.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <Button
                              onClick={() => removeTeamMember(index)}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Role-Based Access Control</h4>
              <p className="text-sm text-blue-800 mb-3">
                Team members will receive different permissions based on their role:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {roleOptions.map((role) => (
                  <div key={role.value} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                    <span className="text-sm">
                      <strong>{role.label}:</strong> {role.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {config.inviteTeam && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800 mb-2">
            <Mail className="w-4 h-4" />
            <span className="font-medium">Invitation Process</span>
          </div>
          <p className="text-sm text-green-700">
            Team members will receive email invitations with setup instructions once your FlowIQ practice is launched.
          </p>
        </div>
      )}
    </div>
  );
};
