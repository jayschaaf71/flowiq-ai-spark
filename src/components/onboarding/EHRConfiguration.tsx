
import React from 'react';
import { EHRIntegrationStep } from './EHRIntegrationStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface EHRConfigurationProps {
  specialty: SpecialtyType;
  ehrConfig: {
    enableIntegration: boolean;
    ehrSystem: string;
    apiEndpoint: string;
  };
  onEHRConfigUpdate: (config: any) => void;
}

export const EHRConfiguration: React.FC<EHRConfigurationProps> = ({ 
  specialty,
  ehrConfig, 
  onEHRConfigUpdate 
}) => {
  // Transform the data structure to match what EHRIntegrationStep expects
  const transformedConfig = {
    enableIntegration: ehrConfig.enableIntegration,
    selectedEHR: ehrConfig.ehrSystem,
    syncSettings: {
      patientData: true,
      appointments: true,
      clinicalNotes: true,
      billing: false
    },
    apiCredentials: {
      endpoint: ehrConfig.apiEndpoint,
      apiKey: '',
      clientId: ''
    }
  };

  const handleUpdate = (updatedConfig: any) => {
    // Transform back to the expected format
    const transformedBack = {
      enableIntegration: updatedConfig.enableIntegration,
      ehrSystem: updatedConfig.selectedEHR,
      apiEndpoint: updatedConfig.apiCredentials.endpoint
    };
    onEHRConfigUpdate(transformedBack);
  };

  return (
    <EHRIntegrationStep
      specialty={specialty}
      ehrConfig={transformedConfig}
      onUpdateEHRConfig={handleUpdate}
    />
  );
};
