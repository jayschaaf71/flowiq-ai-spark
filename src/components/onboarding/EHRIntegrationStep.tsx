
import React from 'react';
import { specialtyConfigs } from '@/utils/specialtyConfig';
import { EHRToggleCard } from './ehr/EHRToggleCard';
import { EHRSystemSelector } from './ehr/EHRSystemSelector';
import { DataSyncSettings } from './ehr/DataSyncSettings';
import { APIConfiguration } from './ehr/APIConfiguration';
import { SetupLaterCard } from './ehr/SetupLaterCard';
import { EHRIntegrationStepProps, EHRSystem } from './ehr/types';

export const EHRIntegrationStep: React.FC<EHRIntegrationStepProps> = ({ 
  specialty, 
  ehrConfig, 
  onUpdateEHRConfig 
}) => {
  const specialtyConfig = specialtyConfigs[specialty];

  const ehrSystems: EHRSystem[] = [
    {
      id: 'epic',
      name: 'Epic',
      logo: '🏥',
      description: 'Leading EHR system for large practices',
      popularity: 'Very Popular',
      integration: 'Full API Support'
    },
    {
      id: 'cerner',
      name: 'Cerner (Oracle Health)',
      logo: '⚡',
      description: 'Comprehensive healthcare technology',
      popularity: 'Popular',
      integration: 'Full API Support'
    },
    {
      id: 'athenahealth',
      name: 'athenahealth',
      logo: '🔬',
      description: 'Cloud-based practice management',
      popularity: 'Popular',
      integration: 'Full API Support'
    },
    {
      id: 'drchrono',
      name: 'DrChrono',
      logo: '📱',
      description: 'Mobile-first EHR platform',
      popularity: 'Growing',
      integration: 'Full API Support'
    },
    {
      id: 'practice_fusion',
      name: 'Practice Fusion',
      logo: '🌐',
      description: 'Free cloud-based EHR',
      popularity: 'Popular',
      integration: 'Limited API'
    },
    {
      id: 'other',
      name: 'Other/Custom',
      logo: '⚙️',
      description: 'Custom integration setup',
      popularity: 'Custom',
      integration: 'Custom Setup'
    }
  ];

  const handleIntegrationToggle = (enabled: boolean) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      enableIntegration: enabled
    });
  };

  const handleEHRSelect = (ehrId: string) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      selectedEHR: ehrId
    });
  };

  const handleSyncToggle = (setting: string, enabled: boolean) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      syncSettings: {
        ...ehrConfig.syncSettings,
        [setting]: enabled
      }
    });
  };

  const handleCredentialChange = (field: string, value: string) => {
    onUpdateEHRConfig({
      ...ehrConfig,
      apiCredentials: {
        ...ehrConfig.apiCredentials,
        [field]: value
      }
    });
  };

  const selectedEHR = ehrSystems.find(ehr => ehr.id === ehrConfig.selectedEHR);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">EHR Integration</h2>
        <p className="text-gray-600 text-lg">
          Connect FlowIQ with your existing Electronic Health Record system to streamline your {specialtyConfig.brandName.toLowerCase()} practice workflow.
        </p>
      </div>

      <EHRToggleCard
        enableIntegration={ehrConfig.enableIntegration}
        onToggle={handleIntegrationToggle}
        primaryColor={specialtyConfig.primaryColor}
        brandName={specialtyConfig.brandName}
      />

      {ehrConfig.enableIntegration && (
        <>
          <EHRSystemSelector
            systems={ehrSystems}
            selectedEHR={ehrConfig.selectedEHR}
            onSelect={handleEHRSelect}
            primaryColor={specialtyConfig.primaryColor}
          />

          {ehrConfig.selectedEHR && (
            <DataSyncSettings
              syncSettings={ehrConfig.syncSettings}
              onSyncToggle={handleSyncToggle}
              selectedEHR={selectedEHR}
              primaryColor={specialtyConfig.primaryColor}
            />
          )}

          {ehrConfig.selectedEHR && ehrConfig.selectedEHR !== 'other' && (
            <APIConfiguration
              apiCredentials={ehrConfig.apiCredentials}
              onCredentialChange={handleCredentialChange}
              selectedEHR={selectedEHR}
            />
          )}

          <SetupLaterCard />
        </>
      )}
    </div>
  );
};
