
import React from 'react';
import { AIAgentConfigurationStep } from './AIAgentConfigurationStep';
import { SpecialtyType } from '@/utils/specialtyConfig';
import { AgentConfigData } from '@/types/configuration';

interface AgentConfigurationProps {
  specialty: SpecialtyType;
  agentConfig: Record<string, unknown>;
  onAgentConfigUpdate: (config: Record<string, unknown>) => void;
}

export const AgentConfiguration: React.FC<AgentConfigurationProps> = ({ 
  specialty,
  agentConfig, 
  onAgentConfigUpdate 
}) => {
  // Transform the data structure to match what AIAgentConfigurationStep expects
  const transformedConfig = {
    'appointment-iq': Boolean(agentConfig['appointment-iq']) || false,
    'intake-iq': Boolean(agentConfig['intake-iq']) || false,
    'billing-iq': Boolean(agentConfig['billing-iq']) || false,
    'claims-iq': Boolean(agentConfig['claims-iq']) || false,
    'assist-iq': Boolean(agentConfig['assist-iq']) || false,
    'scribe-iq': Boolean(agentConfig['scribe-iq']) || false,
    automationLevel: Number(agentConfig.automationLevel) || 50,
    businessHours: (agentConfig.businessHours as { start: string; end: string; timezone: string }) || {
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
      specialty={specialty as SpecialtyType}
      agentConfig={transformedConfig}
      onUpdateAgentConfig={handleUpdate}
    />
  );
};
