
import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { SpecialtyType, getSpecialtyConfig } from '@/utils/specialtyConfig';
import { agentTypes } from './config/agentTypes';
import { AgentCard } from './components/AgentCard';
import { AutomationSettings } from './components/AutomationSettings';
import { SelectedAgentsSummary } from './components/SelectedAgentsSummary';

interface AgentConfig {
  'schedule-iq': boolean;
  'intake-iq': boolean;
  
  'billing-iq': boolean;
  'claims-iq': boolean;
  'assist-iq': boolean;
  'scribe-iq': boolean;
  automationLevel: number;
  businessHours: {
    start: string;
    end: string;
    timezone: string;
  };
}

interface AIAgentConfigurationStepProps {
  specialty: SpecialtyType;
  agentConfig: AgentConfig;
  onUpdateAgentConfig: (config: AgentConfig) => void;
}

export const AIAgentConfigurationStep: React.FC<AIAgentConfigurationStepProps> = ({
  specialty,
  agentConfig,
  onUpdateAgentConfig
}) => {
  const [config, setConfig] = useState<AgentConfig>(agentConfig);
  const specialtyConfig = getSpecialtyConfig(specialty);

  const updateConfig = (updates: Partial<AgentConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onUpdateAgentConfig(newConfig);
  };

  const toggleAgent = (agentId: keyof Omit<AgentConfig, 'automationLevel' | 'businessHours'>) => {
    updateConfig({ [agentId]: !config[agentId] });
  };

  const enabledAgents = agentTypes.filter(agent => 
    config[agent.id as keyof AgentConfig] === true
  );

  const selectRecommended = () => {
    const recommendedAgents = agentTypes
      .filter(agent => agent.recommended)
      .reduce((acc, agent) => {
        (acc as any)[agent.id] = true;
        return acc;
      }, {} as Partial<AgentConfig>);
    
    updateConfig(recommendedAgents);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Configure your AI agents</h2>
        <p className="text-gray-600">
          Select which AI agents will help automate your {specialtyConfig.name.toLowerCase()} practice
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={selectRecommended}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg border border-blue-200 hover:bg-blue-100"
        >
          <CheckCircle className="w-4 h-4" />
          Select Recommended
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentTypes.map((agent) => {
          const isEnabled = config[agent.id as keyof AgentConfig] === true;
          
          return (
            <AgentCard
              key={agent.id}
              agent={agent}
              isEnabled={isEnabled}
              onToggle={() => toggleAgent(agent.id as keyof Omit<AgentConfig, 'automationLevel' | 'businessHours'>)}
            />
          );
        })}
      </div>

      {enabledAgents.length > 0 && (
        <AutomationSettings
          automationLevel={config.automationLevel}
          businessHours={config.businessHours}
          onAutomationLevelChange={(level) => updateConfig({ automationLevel: level })}
          onBusinessHoursChange={(hours) => updateConfig({ businessHours: hours })}
        />
      )}

      <SelectedAgentsSummary enabledAgents={enabledAgents} />
    </div>
  );
};
