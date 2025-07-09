
import React from 'react';
import { AIAgentConfigurationStep } from './AIAgentConfigurationStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface AgentConfigurationProps {
  agentConfig: {
    'schedule-iq'?: boolean;
    'intake-iq'?: boolean;
    
    'billing-iq'?: boolean;
    'claims-iq'?: boolean;
    'assist-iq'?: boolean;
    'scribe-iq'?: boolean;
    automationLevel?: number;
    businessHours?: {
      start: string;
      end: string;
      timezone: string;
    };
  };
  onAgentConfigUpdate: (config: any) => void;
}

export const AgentConfiguration: React.FC<AgentConfigurationProps> = ({ 
  agentConfig, 
  onAgentConfigUpdate 
}) => {
  // Transform the data structure to match what AIAgentConfigurationStep expects
  const transformedConfig = {
    'schedule-iq': agentConfig['schedule-iq'] || false,
    'intake-iq': agentConfig['intake-iq'] || false,
    
    'billing-iq': agentConfig['billing-iq'] || false,
    'claims-iq': agentConfig['claims-iq'] || false,
    'assist-iq': agentConfig['assist-iq'] || false,
    'scribe-iq': agentConfig['scribe-iq'] || false,
    automationLevel: agentConfig.automationLevel || 50,
    businessHours: agentConfig.businessHours || {
      start: '9:00',
      end: '17:00',
      timezone: 'America/New_York'
    }
  };

  const handleUpdate = (updatedConfig: any) => {
    onAgentConfigUpdate(updatedConfig);
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
