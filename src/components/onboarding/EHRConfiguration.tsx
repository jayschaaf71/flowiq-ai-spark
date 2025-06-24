
import React from 'react';
import { EHRIntegrationStep } from './EHRIntegrationStep';

interface EHRConfigurationProps {
  ehrConfig: {
    enableIntegration: boolean;
    ehrSystem: string;
    apiEndpoint: string;
  };
  onEHRConfigUpdate: (config: any) => void;
}

export const EHRConfiguration: React.FC<EHRConfigurationProps> = ({ 
  ehrConfig, 
  onEHRConfigUpdate 
}) => {
  return (
    <EHRIntegrationStep
      ehrConfig={ehrConfig}
      onUpdateEHRConfig={onEHRConfigUpdate}
    />
  );
};
