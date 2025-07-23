
import React from 'react';
import { EnhancedEHRIntegrationStep } from './ehr/EnhancedEHRIntegrationStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface EHRConfigurationProps {
  specialty: SpecialtyType;
  ehrConfig: {
    enableIntegration: boolean;
    ehrSystem: string;
    apiEndpoint: string;
  };
  onEHRConfigUpdate: (config: { enableIntegration: boolean; ehrSystem: string; apiEndpoint: string }) => void;
}

export const EHRConfiguration: React.FC<EHRConfigurationProps> = ({ 
  specialty,
  ehrConfig, 
  onEHRConfigUpdate 
}) => {
  // Transform the data structure to match what EnhancedEHRIntegrationStep expects
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

  const handleUpdate = (updatedConfig: { enableIntegration: boolean; selectedEHR: string; apiCredentials?: { endpoint: string; apiKey: string; clientId: string } }) => {
    // Transform back to the expected format
    const transformedBack = {
      enableIntegration: updatedConfig.enableIntegration,
      ehrSystem: updatedConfig.selectedEHR || '',
      apiEndpoint: updatedConfig.apiCredentials?.endpoint || ''
    };
    onEHRConfigUpdate(transformedBack);
  };

  return (
    <EnhancedEHRIntegrationStep
      specialty={specialty}
      ehrConfig={transformedConfig}
      onUpdateEHRConfig={handleUpdate}
    />
  );
};
