
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
    selectedTemplates: ['intake-form', 'soap-notes'],
    customizationPreferences: {
      useSpecialtyTerminology: true,
      includeBranding: templateConfig.customizationPreferences.includeBranding,
      autoTranslate: false
    }
  };

  const handleUpdate = (updatedConfig: any) => {
    // Transform back to the expected format
    const transformedBack = {
      enableAutoGeneration: updatedConfig.enableAutoGeneration,
      customizationPreferences: {
        includeBranding: updatedConfig.customizationPreferences.includeBranding,
        primaryColor: templateConfig.customizationPreferences.primaryColor,
        secondaryColor: templateConfig.customizationPreferences.secondaryColor
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
