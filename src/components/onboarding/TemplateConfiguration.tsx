
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
  onTemplateConfigUpdate: (config: { enableAutoGeneration: boolean; customizationPreferences: any }) => void;
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

  const handleUpdate = (updatedConfig: { enableAutoGeneration?: boolean; customizationPreferences?: any; selectedTemplates?: string[]; generationProgress?: number; generatedTemplates?: any[] }) => {
    // Transform back to the expected format
    const transformedBack = {
      enableAutoGeneration: updatedConfig.enableAutoGeneration,
      customizationPreferences: {
        includeBranding: Boolean((updatedConfig.customizationPreferences as any)?.includeBranding),
        primaryColor: String((updatedConfig.customizationPreferences as any)?.primaryColor || templateConfig.customizationPreferences.primaryColor),
        secondaryColor: String((updatedConfig.customizationPreferences as any)?.secondaryColor || templateConfig.customizationPreferences.secondaryColor),
        logoUrl: String((updatedConfig.customizationPreferences as any)?.logoUrl || ''),
        brandName: String((updatedConfig.customizationPreferences as any)?.brandName || '')
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
