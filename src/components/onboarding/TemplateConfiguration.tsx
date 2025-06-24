
import React from 'react';
import { TemplatePrePopulationStep } from './TemplatePrePopulationStep';
import { SpecialtyType } from '@/utils/specialtyConfig';

interface TemplateConfigurationProps {
  specialty: SpecialtyType;
  templateConfig: {
    enableAutoGeneration: boolean;
    customizationPreferences: {
      includeBranding: boolean;
      primaryColor: string;
      secondaryColor: string;
      logoUrl?: string;
      brandName?: string;
    };
  };
  onTemplateConfigUpdate: (config: any) => void;
}

export const TemplateConfiguration: React.FC<TemplateConfigurationProps> = ({ 
  specialty,
  templateConfig, 
  onTemplateConfigUpdate 
}) => {
  // Transform the data structure to match what TemplatePrePopulationStep expects
  const transformedConfig = {
    enableAutoGeneration: templateConfig.enableAutoGeneration,
    selectedTemplates: ['intake-forms', 'consent-forms'],
    customizationPreferences: {
      includeBranding: templateConfig.customizationPreferences.includeBranding,
      primaryColor: templateConfig.customizationPreferences.primaryColor,
      secondaryColor: templateConfig.customizationPreferences.secondaryColor,
      logoUrl: templateConfig.customizationPreferences.logoUrl,
      brandName: templateConfig.customizationPreferences.brandName
    },
    generationProgress: 0,
    generatedTemplates: []
  };

  const handleUpdate = (updatedConfig: any) => {
    // Transform back to the expected format
    const transformedBack = {
      enableAutoGeneration: updatedConfig.enableAutoGeneration,
      customizationPreferences: {
        includeBranding: updatedConfig.customizationPreferences.includeBranding,
        primaryColor: updatedConfig.customizationPreferences.primaryColor || templateConfig.customizationPreferences.primaryColor,
        secondaryColor: updatedConfig.customizationPreferences.secondaryColor || templateConfig.customizationPreferences.secondaryColor,
        logoUrl: updatedConfig.customizationPreferences.logoUrl,
        brandName: updatedConfig.customizationPreferences.brandName
      }
    };
    onTemplateConfigUpdate(transformedBack);
  };

  return (
    <TemplatePrePopulationStep
      specialty={specialty}
      templateConfig={transformedConfig}
      onUpdateTemplateConfig={handleUpdate}
    />
  );
};
