
export interface TemplateConfig {
  enableAutoGeneration: boolean;
  selectedTemplates: string[];
  customizationPreferences: {
    includeBranding: boolean;
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
    brandName?: string;
  };
  generationProgress: number;
  generatedTemplates: any[];
}

export interface TemplatePrePopulationStepProps {
  specialty: string;
  templateConfig: TemplateConfig;
  onUpdateTemplateConfig: (config: TemplateConfig) => void;
}

export interface AvailableTemplate {
  id: string;
  name: string;
  description: string;
  icon: any;
  estimated_time: string;
  templates_count: number;
}
