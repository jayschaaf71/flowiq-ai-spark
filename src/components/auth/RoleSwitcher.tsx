
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Shield, Stethoscope, UserCog, User } from 'lucide-react';

const roleConfig = {
  patient: {
    label: 'Patient',
    icon: User,
    color: 'bg-blue-500',
    description: 'Access patient portal and personal health information'
  },
  staff: {
    label: 'Staff',
    icon: Users,
    color: 'bg-green-500',
    description: 'Access staff dashboard and patient management'
  },
  provider: {
    label: 'Provider',
    icon: Stethoscope,
    color: 'bg-purple-500',
    description: 'Access clinical tools and patient care features'
  },
  practice_manager: {
    label: 'Practice Manager',
    icon: UserCog,
    color: 'bg-orange-500',
    description: 'Access practice management and administrative tools'
  },
  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'bg-red-500',
    description: 'Full system access and configuration'
  }
};

export const RoleSwitcher: React.FC = () => {
  const { profile, switchRole, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState(profile?.role || 'patient');
  const [switching, setSwitching] = useState(false);

  if (!profile) return null;

  const handleRoleSwitch = async () => {
    if (selectedRole === profile.role) return;
    
    setSwitching(true);
    await switchRole(selectedRole);
    setSwitching(false);
  };

  const currentRoleConfig = roleConfig[profile.role as keyof typeof roleConfig];
  const CurrentIcon = currentRoleConfig?.icon || User;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CurrentIcon className="w-5 h-5" />
          Role Testing Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Current Role:</span>
          <Badge className={`${currentRoleConfig?.color} text-white`}>
            {currentRoleConfig?.label || profile.role}
          </Badge>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Switch to Role:</label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(roleConfig).map(([role, config]) => {
                const IconComponent = config.icon;
                return (
                  <SelectItem key={role} value={role}>
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4" />
                      {config.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleRoleSwitch} 
          disabled={selectedRole === profile.role || switching || loading}
          className="w-full"
        >
          {switching ? 'Switching...' : 'Switch Role'}
        </Button>

        <div className="text-xs text-gray-600">
          <strong>Current Role Description:</strong>
          <p>{currentRoleConfig?.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
