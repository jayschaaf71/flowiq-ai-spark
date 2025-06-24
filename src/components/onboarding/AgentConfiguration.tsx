
import React from 'react';
import { AIAgentConfigurationStep } from './AIAgentConfigurationStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface AgentConfigurationProps {
  agentConfig: {
    receptionistAgent: boolean;
    schedulingAgent: boolean;
    billingAgent: boolean;
  };
  onAgentConfigUpdate: (config: any) => void;
}

export const AgentConfiguration: React.FC<AgentConfigurationProps> = ({ 
  agentConfig, 
  onAgentConfigUpdate 
}) => {
  // Transform the data structure to match what AIAgentConfigurationStep expects
  const transformedConfig = {
    receptionistAgent: agentConfig.receptionistAgent,
    intakeAgent: false, // Default value since it's not in the original config
    followUpAgent: false, // Default value since it's not in the original config
    reminderAgent: false, // Default value since it's not in the original config
    automationLevel: 50, // Default automation level
    businessHours: {
      start: '9:00',
      end: '17:00',
      timezone: 'America/New_York'
    }
  };

  const handleUpdate = (updatedConfig: any) => {
    // Transform back to the expected format
    const transformedBack = {
      receptionistAgent: updatedConfig.receptionistAgent,
      schedulingAgent: updatedConfig.reminderAgent, // Map reminder to scheduling
      billingAgent: updatedConfig.intakeAgent // Map intake to billing for now
    };
    onAgentConfigUpdate(transformedBack);
  };

  // Default to chiropractic specialty for now
  const defaultSpecialty: SpecialtyType = 'chiropractic';

  return (
    <AIAgentConfigurationStep
      specialty={defaultSpecialty}
      agentConfig={transformedConfig}
      onUpdateAgentConfig={handleUpdate}
    />
  );
};
