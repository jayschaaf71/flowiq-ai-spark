
import React from 'react';
import { TeamInvitationStep } from './TeamInvitationStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface TeamConfigurationProps {
  specialty: SpecialtyType;
  teamConfig: {
    inviteTeam: boolean;
    teamMembers: any[];
  };
  onTeamConfigUpdate: (config: any) => void;
}

export const TeamConfiguration: React.FC<TeamConfigurationProps> = ({ 
  specialty,
  teamConfig, 
  onTeamConfigUpdate 
}) => {
  // Transform the data structure to match what TeamInvitationStep expects
  const transformedConfig = {
    inviteTeam: teamConfig.inviteTeam,
    teamMembers: teamConfig.teamMembers,
    roles: ['Admin', 'Staff', 'Provider', 'Receptionist']
  };

  const handleUpdate = (updatedConfig: any) => {
    // Transform back to the expected format
    const transformedBack = {
      inviteTeam: updatedConfig.inviteTeam,
      teamMembers: updatedConfig.teamMembers
    };
    onTeamConfigUpdate(transformedBack);
  };

  return (
    <TeamInvitationStep
      specialty={specialty}
      teamConfig={transformedConfig}
      onUpdateTeamConfig={handleUpdate}
    />
  );
};
