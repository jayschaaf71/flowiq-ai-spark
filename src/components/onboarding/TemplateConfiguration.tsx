
import React from 'react';
import { TemplatePrePopulationStep } from './TemplatePrePopulationStep';

interface TemplateConfigurationProps {
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
  templateConfig, 
  onTemplateConfigUpdate 
}) => {
  return (
    <TemplatePrePopulationStep
      templateConfig={templateConfig}
      onUpdateTemplateConfig={onTemplateConfigUpdate}
    />
  );
};
