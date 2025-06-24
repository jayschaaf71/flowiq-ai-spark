
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  UserPlus, 
  Mail, 
  Trash2,
  Shield,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";
import { SpecialtyType, specialtyConfigs } from '@/utils/specialtyConfig';

interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department: string;
  personalMessage: string;
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

export const TeamInvitationStep = ({ 
  specialty, 
  teamConfig, 
  onUpdateTeamConfig 
}: TeamInvitationStepProps) => {
  const specialtyConfig = specialtyConfigs[specialty];
  const [newMember, setNewMember] = useState<Partial<TeamMember>>({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
    department: '',
    personalMessage: ''
  });

  const rolesBySpecialty = {
    chiropractic: [
      'Practice Manager',
      'Chiropractor',
      'Chiropractic Assistant',
      'Massage Therapist',
      'Front Desk Staff',
      'Insurance Coordinator'
    ],
    dental_sleep: [
      'Practice Manager',
      'Sleep Medicine Physician',
      'Dental Sleep Specialist',
      'Sleep Technician',
      'Front Desk Staff',
      'Insurance Coordinator'
    ],
    med_spa: [
      'Practice Manager',
      'Medical Director',
      'Nurse Practitioner',
      'Aesthetician',
      'Front Desk Staff',
      'Marketing Coordinator'
    ],
    concierge: [
      'Practice Manager',
      'Concierge Physician',
      'Nurse Practitioner',
      'Health Coach',
      'Care Coordinator',
      'Administrative Assistant'
    ],
    hrt: [
      'Practice Manager',
      'Hormone Specialist',
      'Nurse Practitioner',
      'Health Coach',
      'Lab Coordinator',
      'Patient Advocate'
    ]
  };

  const availableRoles = rolesBySpecialty[specialty] || [
    'Practice Manager',
    'Provider',
    'Medical Assistant',
    'Front Desk Staff',
    'Administrative Staff'
  ];

  const addTeamMember = () => {
    if (newMember.firstName && newMember.lastName && newMember.email && newMember.role) {
      const member: TeamMember = {
        id: Date.now().toString(),
        firstName: newMember.firstName || '',
        lastName: newMember.lastName || '',
        email: newMember.email || '',
        role: newMember.role || '',
        department: newMember.department || '',
        personalMessage: newMember.personalMessage || ''
      };

      onUpdateTeamConfig({
        ...teamConfig,
        teamMembers: [...teamConfig.teamMembers, member]
      });

      setNewMember({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        department: '',
        personalMessage: ''
      });
    }
  };

  const removeTeamMember = (id: string) => {
    onUpdateTeamConfig({
      ...teamConfig,
      teamMembers: teamConfig.teamMembers.filter(member => member.id !== id)
    });
  };

  const updateNewMember = (field: keyof TeamMember, value: string) => {
    setNewMember(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleColor = (role: string) => {
    const colors = {
      'Practice Manager': 'bg-purple-100 text-purple-800',
      'Provider': 'bg-blue-100 text-blue-800',
      'Medical Assistant': 'bg-green-100 text-green-800',
      'Front Desk Staff': 'bg-orange-100 text-orange-800',
      'Administrative Staff': 'bg-gray-100 text-gray-800'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Invite Your Team</h2>
        <p className="text-gray-600 text-lg">
          Invite your team members to join your {specialtyConfig.brandName.toLowerCase()} practice on FlowIQ and assign their roles.
        </p>
      </div>

      {/* Team Overview */}
      <Card className="border-2" style={{ borderColor: specialtyConfig.primaryColor + '20' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
            Team Members
          </CardTitle>
          <CardDescription>
            Build your practice team and get everyone set up with appropriate access levels.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {teamConfig.teamMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No team members added yet. Add your first team member below!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {teamConfig.teamMembers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{member.firstName} {member.lastName}</h4>
                        <p className="text-sm text-gray-600">{member.email}</p>
                        {member.department && (
                          <p className="text-xs text-gray-500">{member.department}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamMember(member.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {member.personalMessage && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Personal message:</strong> {member.personalMessage}
                      </p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Team Member */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" style={{ color: specialtyConfig.primaryColor }} />
            Add Team Member
          </CardTitle>
          <CardDescription>
            Invite a new team member to your practice.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={newMember.firstName || ''}
                onChange={(e) => updateNewMember('firstName', e.target.value)}
                placeholder="John"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={newMember.lastName || ''}
                onChange={(e) => updateNewMember('lastName', e.target.value)}
                placeholder="Doe"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={newMember.email || ''}
              onChange={(e) => updateNewMember('email', e.target.value)}
              placeholder="john.doe@example.com"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="role">Role *</Label>
              <Select
                value={newMember.role || ''}
                onValueChange={(value) => updateNewMember('role', value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department (Optional)</Label>
              <Input
                id="department"
                value={newMember.department || ''}
                onChange={(e) => updateNewMember('department', e.target.value)}
                placeholder="Clinical, Administrative, etc."
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="personalMessage">Personal Message (Optional)</Label>
            <Textarea
              id="personalMessage"
              value={newMember.personalMessage || ''}
              onChange={(e) => updateNewMember('personalMessage', e.target.value)}
              placeholder="Welcome to our team! We're excited to have you..."
              className="mt-1"
              rows={3}
            />
          </div>

          <Button
            onClick={addTeamMember}
            disabled={!newMember.firstName || !newMember.lastName || !newMember.email || !newMember.role}
            className="w-full"
            style={{ backgroundColor: specialtyConfig.primaryColor }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Role Permissions</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-blue-800">Practice Manager:</strong>
              <p className="text-blue-700">Full access to all features and settings</p>
            </div>
            <div>
              <strong className="text-blue-800">Provider:</strong>
              <p className="text-blue-700">Patient care, documentation, scheduling</p>
            </div>
            <div>
              <strong className="text-blue-800">Medical Assistant:</strong>
              <p className="text-blue-700">Patient intake, basic documentation</p>
            </div>
            <div>
              <strong className="text-blue-800">Front Desk Staff:</strong>
              <p className="text-blue-700">Scheduling, patient communication</p>
            </div>
          </div>
          <p className="text-xs text-blue-600 mt-4">
            You can modify permissions for individual team members after they join.
          </p>
        </CardContent>
      </Card>

      {/* Invitation Summary */}
      {teamConfig.teamMembers.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Invitation Summary</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">{teamConfig.teamMembers.length}</div>
                <div className="text-sm text-green-600">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {new Set(teamConfig.teamMembers.map(m => m.role)).size}
                </div>
                <div className="text-sm text-green-600">Different Roles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">24h</div>
                <div className="text-sm text-green-600">Invitation Validity</div>
              </div>
            </div>
            <p className="text-sm text-green-700 mt-4">
              Invitations will be sent automatically after you complete the setup process.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
