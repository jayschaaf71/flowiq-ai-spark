
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
  return (
    <TeamInvitationStep
      teamConfig={teamConfig}
      onUpdateTeamConfig={onTeamConfigUpdate}
    />
  );
};
