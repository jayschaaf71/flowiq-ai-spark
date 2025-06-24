
import React from 'react';
import { TeamInvitationStep } from './TeamInvitationStep';

interface TeamConfigurationProps {
  teamConfig: {
    inviteTeam: boolean;
    teamMembers: any[];
  };
  onTeamConfigUpdate: (config: any) => void;
}

export const TeamConfiguration: React.FC<TeamConfigurationProps> = ({ 
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
      teamConfig={transformedConfig}
      onUpdateTeamConfig={handleUpdate}
    />
  );
};
